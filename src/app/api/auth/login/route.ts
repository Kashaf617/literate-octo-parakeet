import { NextRequest, NextResponse } from "next/server";
import { loginAdmin, createSessionToken, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await loginAdmin(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const token = await createSessionToken({ sub: user.id, email: user.email, name: user.name, role: user.role });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
