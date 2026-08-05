import type { NormalizedArticle } from '../domain/article.types';

const articleKey = (article: Partial<NormalizedArticle>) => article.slug || '';

export const rankRelatedArticles = (current: NormalizedArticle, candidates: NormalizedArticle[], limit = 3) => {
  const manualOrder = new Map((current.relatedPosts || []).map((article, index) => [articleKey(article), 1000 - index]));
  const currentTags = new Set(current.tags.map((tag) => tag.slug));
  return candidates
    .filter((candidate) => candidate.slug && candidate.slug !== current.slug && candidate.locale === current.locale)
    .map((candidate) => {
      let score = manualOrder.get(candidate.slug) || 0;
      if (candidate.primaryCategory?.slug && candidate.primaryCategory.slug === current.primaryCategory?.slug) score += 25;
      score += candidate.tags.reduce((sum, tag) => sum + (currentTags.has(tag.slug) ? 8 : 0), 0);
      return { candidate, score };
    })
    .sort((left, right) => right.score - left.score || Date.parse(right.candidate.publishedAt || '') - Date.parse(left.candidate.publishedAt || ''))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};
