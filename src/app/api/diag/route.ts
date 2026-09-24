import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: any = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
    nodeEnv: process.env.NODE_ENV,
    dbCheck: "pending"
  };

  try {
    const adminCount = await prisma.adminUser.count();
    const productCount = await prisma.product.count();
    result.dbCheck = "success";
    result.adminCount = adminCount;
    result.productCount = productCount;
  } catch (err: any) {
    result.dbCheck = "error";
    result.errorMessage = err.message;
  }

  return NextResponse.json(result);
}
