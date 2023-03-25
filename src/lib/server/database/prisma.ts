import { PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const log: ["query"] | [] = !isProduction ? ["query"] : [];

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient({ log });

if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
