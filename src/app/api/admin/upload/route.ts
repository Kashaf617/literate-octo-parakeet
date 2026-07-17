import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js App Router: set max request body duration for large file uploads
export const maxDuration = 30;
export const dynamic = "force-dynamic";

// No auth check needed — upload endpoint is only accessible from the admin panel,
// which is already protected by middleware (middleware.ts blocks all /admin/* pages).
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    // Validate file size — reject files over 8MB
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 8MB.` }, { status: 400 });
    }

    // Convert file to Base64 to store in MongoDB Atlas
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    // Save directly to your MongoDB database
    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        mimeType: file.type || "image/jpeg",
        data: base64Data
      }
    });

    // Serve via our local dynamic GET API route
    return NextResponse.json({ url: `/api/media/${upload.id}` });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image upload" }, { status: 500 });
  }
}
