import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }
    
    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter(f => f.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i))
      .map(f => `/uploads/${f}`)
      .sort() // Sort alphabetically, or we could sort by mtime if we want newest first
      .reverse(); // Give newest first typically if names are timestamped

    return NextResponse.json({ files: images });
  } catch (error) {
    console.error("Error reading media directory:", error);
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}
