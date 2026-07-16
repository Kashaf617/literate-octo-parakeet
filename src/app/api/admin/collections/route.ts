import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const collections = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const collection = await prisma.collection.create({
    data: { name: data.name, slug: slugify(data.name), color: data.color || "#1f6fdb" }
  });
  return NextResponse.json(collection, { status: 201 });
}
