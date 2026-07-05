import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern — prevents exhausting DB connections
// from hot-reloading in dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * True once DATABASE_URL is set. Every read function in lib/data/*.ts checks
 * this first — if it's false, they return the bundled sample data instead of
 * touching Prisma at all, so the site works before a database is connected.
 */
export function isDatabaseConfigured() {
  return !!process.env.DATABASE_URL;
}
