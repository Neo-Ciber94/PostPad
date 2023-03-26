import { environment } from "@/lib/shared/env";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/server/database/prisma";

export const authOptions: AuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  pages: { signIn: "/" },
  providers: [
    GoogleProvider({
      clientId: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: environment.GITHUB_CLIENT_ID,
      clientSecret: environment.GITHUB_CLIENT_SECRET,
    }),
    AzureADB2CProvider({
      tenantId: environment.AZURE_AD_B2C_TENANT_NAME,
      clientId: environment.AZURE_AD_B2C_CLIENT_ID,
      clientSecret: environment.AZURE_AD_B2C_CLIENT_SECRET,
      primaryUserFlow: environment.AZURE_AD_B2C_PRIMARY_USER_FLOW,
      authorization: { params: { scope: "offline_access openid" } },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
