import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { prisma } from "../database/prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (session == null || session.user == null) {
    return null;
  }

  const email = session.user.email;

  if (email == null) {
    return null;
  }

  const user = await prisma.user.findFirst({ where: { email } });
  return user;
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id;
}
