import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If ImgBB API Key is configured in environment, upload to cloud storage
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    if (imgbbApiKey) {
      const body = new URLSearchParams();
      body.append("image", buffer.toString("base64"));

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ url: data.data.url });
      } else {
        const errorText = await response.text();
        console.error("ImgBB Upload API error:", errorText);
      }
    }

    // Fallback: Save to local filesystem (Only works locally, fails on read-only Vercel)
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${nanoid(10)}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image upload" }, { status: 500 });
  }
}
