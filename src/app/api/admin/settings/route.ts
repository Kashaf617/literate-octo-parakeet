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
  await prisma.$transaction(
    keys.map((key) =>
      prisma.setting.upsert({
        where: { key },
        update: { value: String(body[key]) },
        create: { key, value: String(body[key]) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
