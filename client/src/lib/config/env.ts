import { z } from 'zod';

const optionalUrl = z.string().url().optional();
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_STRAPI_URL: optionalUrl,
});
const serverSchema = publicSchema.extend({
  SITE_URL: optionalUrl,
  CONTENT_ANALYZER_API_URL: optionalUrl,
  CONTENT_ANALYZER_BOOKING_KEY: z.string().min(32).optional(),
  CONTENT_ANALYZER_BOOKING_SITE_ID: z.string().regex(/^site_[a-zA-Z0-9_-]+$/).optional(),
  STRAPI_API_TOKEN: z.string().min(1).optional(),
  STRAPI_PREVIEW_SECRET: z.string().min(32).optional(),
  STRAPI_WEBHOOK_SECRET: z.string().min(32).optional(),
});

const formatError = (issues: z.ZodIssue[]) => issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');

export const getPublicEnv = () => {
  const result = publicSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
  });
  if (!result.success) throw new Error(`Invalid public environment configuration: ${formatError(result.error.issues)}`);
  return result.data;
};

export const getServerEnv = () => {
  const result = serverSchema.safeParse(process.env);
  if (!result.success) throw new Error(`Invalid server environment configuration: ${formatError(result.error.issues)}`);
  return result.data;
};

export const requireServerEnv = <K extends keyof ReturnType<typeof getServerEnv>>(key: K): string => {
  const value = getServerEnv()[key];
  if (!value) throw new Error(`Missing required server environment variable: ${key}`);
  return value;
};
