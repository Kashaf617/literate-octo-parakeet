import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

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
