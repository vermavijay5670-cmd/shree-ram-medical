import type { PrismaClient as PrismaClientType } from "@prisma/client";

// Standard Next.js singleton pattern - prevents exhausting DB connections
// from hot-reloading in dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };

function getClient(): PrismaClientType {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  // Imported lazily, inside the function, so merely importing this file
  // (e.g. just for isDatabaseConfigured()) never constructs a real
  // PrismaClient or touches the generated client at all.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  const client: PrismaClientType = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// A Proxy that only constructs the real client the first time a property
// (e.g. `.company`, `.medicine`) is actually accessed. Every lib/data/*.ts
// function checks isDatabaseConfigured() before touching `prisma.*`, so if
// the database isn't connected (or the client somehow failed to generate),
// pages that don't need the database are completely unaffected.
export const prisma: PrismaClientType = new Proxy({} as PrismaClientType, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient() as object, prop, receiver);
  },
});

/**
 * True once DATABASE_URL is set. Every read function in lib/data/*.ts checks
 * this first - if it's false, they return the bundled sample data instead of
 * touching Prisma at all, so the site works before a database is connected.
 */
export function isDatabaseConfigured() {
  return !!process.env.DATABASE_URL;
}
