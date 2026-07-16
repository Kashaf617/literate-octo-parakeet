import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createCustomerSessionToken, setCustomerSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.customer.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { name, email, passwordHash }
    });

    const token = await createCustomerSessionToken({
      sub: customer.id,
      email: customer.email,
      name: customer.name
    });

    await setCustomerSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
