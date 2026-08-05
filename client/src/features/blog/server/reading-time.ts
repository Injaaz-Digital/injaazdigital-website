const WORDS_PER_MINUTE = 220;

export const plainTextFromHtml = (html: string) => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const estimateReadingTime = (html: string, override?: unknown) => {
  const parsedOverride = Number.parseInt(String(override ?? ''), 10);
  if (Number.isFinite(parsedOverride) && parsedOverride > 0) return parsedOverride;
  const words = plainTextFromHtml(html).split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};
