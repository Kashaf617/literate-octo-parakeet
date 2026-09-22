import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"]
  });

globalForPrisma.prisma = prisma;

// Wraps any promise with a timeout – returns fallback if DB is slow
export async function withTimeout<T>(promise: Promise<T>, fallback: T, ms = 8000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error("db_timeout")), ms);
  });
  try {
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timer!);
    return result;
  } catch {
    clearTimeout(timer!);
    return fallback;
  }
}
