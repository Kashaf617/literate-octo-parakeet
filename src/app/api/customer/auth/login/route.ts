import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createCustomerSessionToken, setCustomerSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (customer.isBlocked) {
      return NextResponse.json({ error: "Your account has been suspended. Please contact support." }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, customer.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createCustomerSessionToken({
      sub: customer.id,
      email: customer.email,
      name: customer.name
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set("devineora_customer_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
