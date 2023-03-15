import { z } from "zod";

export type Environment = z.infer<typeof envSchema>;

const envSchema = z.object({
  DATABASE_URL: z.string(),

  // google
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  // github
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),

  // microsoft
  AZURE_AD_B2C_TENANT_NAME: z.string(),
  AZURE_AD_B2C_CLIENT_ID: z.string(),
  AZURE_AD_B2C_CLIENT_SECRET: z.string(),
  AZURE_AD_B2C_PRIMARY_USER_FLOW: z.string(),
});

export const environment: Environment = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,

  // google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // github
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

  // microsoft
  AZURE_AD_B2C_TENANT_NAME: process.env.AZURE_AD_B2C_TENANT_NAME,
  AZURE_AD_B2C_CLIENT_ID: process.env.AZURE_AD_B2C_CLIENT_ID,
  AZURE_AD_B2C_CLIENT_SECRET: process.env.AZURE_AD_B2C_CLIENT_SECRET,
  AZURE_AD_B2C_PRIMARY_USER_FLOW: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
} satisfies Partial<Environment>);