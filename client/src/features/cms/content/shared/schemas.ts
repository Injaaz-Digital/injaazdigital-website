import { z } from 'zod';
import { cmsBlockSchema } from '../../blocks/schemas/block.schemas';

export const localeSchema = z.enum(['en', 'ar']);
export const cmsLinkSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  label: z.string().trim().min(1).max(80),
  url: z.string().trim().min(1).max(2048),
  style: z.string().trim().optional(),
  isExternal: z.boolean().optional(),
  trackingId: z.string().trim().max(120).optional(),
}).passthrough();

export const cmsMediaSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  url: z.string().trim().min(1),
  alternativeText: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  mime: z.string().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
}).passthrough();

export const seoSchema = z.object({
  metaTitle: z.string().trim().max(70).optional().nullable(),
  metaDescription: z.string().trim().max(180).optional().nullable(),
  canonicalUrl: z.string().trim().max(2048).optional().nullable(),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  openGraphTitle: z.string().trim().max(100).optional().nullable(),
  openGraphDescription: z.string().trim().max(240).optional().nullable(),
  shareImage: z.unknown().optional().nullable(),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
  keywords: z.string().optional().nullable(),
  structuredDataOverride: z.record(z.string(), z.unknown()).optional().nullable(),
}).passthrough();

export const navigationItemSchema = cmsLinkSchema;
export const headerSchema = z.object({
  navLinks: z.array(navigationItemSchema).default([]),
  serviceLinks: z.array(navigationItemSchema).default([]),
  primaryCta: cmsLinkSchema.optional().nullable(),
  showLanguageSwitcher: z.boolean().optional(),
}).passthrough();
export const footerSchema = z.object({
  columns: z.array(z.unknown()).default([]),
  socialLinks: z.array(cmsLinkSchema).default([]),
  legalLinks: z.array(cmsLinkSchema).default([]),
}).passthrough();
export const siteSettingSchema = z.object({
  siteName: z.string().trim().min(1),
  defaultLocale: localeSchema.default('en'),
  header: headerSchema.optional().nullable(),
  footer: footerSchema.optional().nullable(),
  defaultSeo: seoSchema.optional().nullable(),
}).passthrough();
export const cmsPageSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  documentId: z.string().optional(),
  title: z.string().trim().optional().default(''),
  description: z.string().trim().optional().default(''),
  slug: z.string().trim().optional(),
  locale: localeSchema.default('en'),
  blocks: z.array(cmsBlockSchema).default([]),
  seo: seoSchema.optional().nullable(),
}).passthrough();
export const authorSchema = z.object({ name: z.string().trim().min(1), slug: z.string().trim().optional() }).passthrough();
export const categorySchema = z.object({ name: z.string().trim().min(1), slug: z.string().trim().min(1) }).passthrough();
export const articleCtaSchema = cmsLinkSchema.extend({
  headline: z.string().trim().max(140).optional().nullable(),
  body: z.string().trim().max(400).optional().nullable(),
}).passthrough();
export const articleSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  locale: localeSchema.default('en'),
  body: z.string().default(''),
  excerpt: z.string().optional().default(''),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
  author: authorSchema.optional().nullable(),
  tags: z.array(categorySchema).optional().default([]),
  primaryCategory: categorySchema.optional().nullable(),
  articleCta: articleCtaSchema.optional().nullable(),
  readingTimeMinutes: z.number().int().positive().default(1),
  relatedPosts: z.array(z.unknown()).optional().default([]),
  seo: seoSchema.optional().nullable(),
}).passthrough();
