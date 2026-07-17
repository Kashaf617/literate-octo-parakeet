import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    const info: any = {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      cookies: req.cookies.getAll().map(c => c.name),
    };

    if (!file) {
      return NextResponse.json({ error: "No file", info }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    const upload = await prisma.upload.create({
      data: {
        filename: file.name,
        mimeType: file.type || "image/jpeg",
        data: base64Data
      }
    });

    return NextResponse.json({ 
      success: true,
      url: `/api/media/${upload.id}`,
      info
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack?.split("\n").slice(0, 5)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Upload test endpoint is live. POST a file here." });
}
