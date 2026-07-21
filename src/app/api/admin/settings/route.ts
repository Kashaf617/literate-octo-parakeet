import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const settings = await prisma.setting.findMany();
  const dict = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);
  return NextResponse.json(dict);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const body = await req.json();
  const keys = Object.keys(body);
  
  // Upsert all keys provided in the body
  if (body.email_gmail_pass) {
    body.email_gmail_pass = String(body.email_gmail_pass).replace(/\s+/g, "").trim();
  }

  for (const key of keys) {
    const val = String(body[key]);
    const existing = await prisma.setting.findFirst({ where: { key } });
    if (existing) {
      await prisma.setting.update({ where: { key }, data: { value: val } });
    } else {
      await prisma.setting.create({ data: { key, value: val } });
    }
  }

  return NextResponse.json({ success: true });
}
