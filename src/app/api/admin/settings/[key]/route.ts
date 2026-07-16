import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { setSetting } from "@/lib/settings";

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const body = await req.json();
  const saved = await setSetting(params.key, body);
  return NextResponse.json(saved);
}
