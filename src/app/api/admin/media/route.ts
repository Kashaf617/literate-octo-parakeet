import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Returns all uploaded media from MongoDB as /api/media/[id] URLs
export async function GET(req: NextRequest) {
  try {
    const uploads = await prisma.upload.findMany({
      select: { id: true, filename: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    const files = uploads.map(u => `/api/media/${u.id}`);
    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error reading media from database:", error);
    return NextResponse.json({ files: [] });
  }
}
