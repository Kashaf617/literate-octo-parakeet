import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

// Extension → MIME type map (used when browser sends empty type)
const EXT_MIME: Record<string, string> = {
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".gif":  "image/gif",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".bmp":  "image/bmp",
  ".tiff": "image/tiff",
  ".tif":  "image/tiff",
};

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|bmp|tiff?)$/i;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine MIME type — use browser-reported type first, fall back to extension
    const ext = (file.name.toLowerCase().match(/\.\w+$/) || [""])[0];
    const mimeType =
      file.type && file.type !== "application/octet-stream" && file.type !== ""
        ? file.type
        : EXT_MIME[ext] || "";

    // Validate: must be an image by MIME type OR by extension
    const isImage =
      mimeType.startsWith("image/") || IMAGE_EXT_RE.test(file.name);

    if (!isImage) {
      return NextResponse.json(
        { error: `Only image files are allowed. Received type: "${file.type || "(empty)"}", name: "${file.name}"` },
        { status: 400 }
      );
    }

    // Validate file size — reject files over 8MB
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 8MB.` },
        { status: 400 }
      );
    }

    // Convert file to Base64 to store in MongoDB Atlas
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    // Save directly to your MongoDB database
    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        mimeType: mimeType || "image/jpeg",
        data: base64Data,
      },
    });

    return NextResponse.json({ url: `/api/media/${upload.id}` });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
