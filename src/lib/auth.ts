import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SESSION_COOKIE = "devineora_admin_session";
const CUSTOMER_SESSION_COOKIE = "devineora_customer_session";
const secretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

export interface AdminSessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export interface CustomerSessionPayload {
  sub: string;
  email: string;
  name: string;
}

export async function createSessionToken(payload: AdminSessionPayload) {
  return new SignJWT({ ...payload } as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function createCustomerSessionToken(payload: CustomerSessionPayload) {
  return new SignJWT({ ...payload } as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // longer session for customers
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function verifyCustomerSessionToken(token: string): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as CustomerSessionPayload;
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function setCustomerSessionCookie(token: string) {
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function clearCustomerSessionCookie() {
  const store = await cookies();
  store.delete(CUSTOMER_SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyCustomerSessionToken(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
