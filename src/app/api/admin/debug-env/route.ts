import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (secret !== "devineora_debug_123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.IMGBB_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  return NextResponse.json({
    IMGBB_API_KEY_exists: !!key,
    IMGBB_API_KEY_length: key ? key.length : 0,
    IMGBB_API_KEY_start: key ? key.substring(0, 4) + "..." : "none",
    NEXT_PUBLIC_IMGBB_API_KEY_exists: !!publicKey,
    NEXT_PUBLIC_IMGBB_API_KEY_length: publicKey ? publicKey.length : 0,
    NEXT_PUBLIC_IMGBB_API_KEY_start: publicKey ? publicKey.substring(0, 4) + "..." : "none",
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || "not set"
  });
}
