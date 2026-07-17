import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (secret !== "devineora_debug_123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.IMGBB_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "IMGBB_API_KEY is not defined in environment variables" });
  }

  // Perform a real test upload to ImgBB using their key and a tiny dummy image
  let imgbbResult: any = null;
  try {
    const dummyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const buffer = Buffer.from(dummyBase64, "base64");
    const blob = new Blob([buffer], { type: "image/png" });
    const body = new FormData();
    body.append("image", blob, "test.png");

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body
    });

    const status = response.status;
    const data = await response.json();
    imgbbResult = { status, data };
  } catch (err: any) {
    imgbbResult = { error: err.message || err };
  }

  return NextResponse.json({
    IMGBB_API_KEY_exists: true,
    IMGBB_API_KEY_length: key.length,
    IMGBB_API_KEY_start: key.substring(0, 4) + "...",
    imgbb_test_upload_result: imgbbResult,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || "not set"
  });
}
