import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../database/prisma";

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);

  if (session == null || session.user == null) {
    throw new Error("no session found");
  }

  const email = session.user.email;

  if (email == null) {
    throw new Error("user email not set");
  }

  const user = await prisma.user.findFirst({ where: { email } });

  if (user == null) {
    throw new Error("user id not found");
  }

  return user.id;
}
