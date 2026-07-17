import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const upload = await prisma.upload.findUnique({
      where: { id }
    });

    if (!upload) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    const buffer = Buffer.from(upload.data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": upload.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable" // Cache images for performance
      }
    });
  } catch (error) {
    console.error("Failed to load image from database:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
