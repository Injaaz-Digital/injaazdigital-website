export type SearchableArticle = {
  title?: string; excerpt?: string; body?: string; publishedAt?: string; updatedAt?: string;
  primaryCategory?: { slug?: string; name?: string } | null;
  tags?: Array<{ slug?: string; name?: string }>;
  [key: string]: unknown;
};

const normalize = (value: unknown) => String(value || '').toLocaleLowerCase().normalize('NFKC');
const includes = (value: unknown, query: string) => normalize(value).includes(query);

export const scoreArticleSearch = (article: SearchableArticle, rawQuery: string) => {
  const query = normalize(rawQuery).trim();
  if (!query) return 0;
  let score = 0;
  if (includes(article.title, query)) score += 50;
  if (includes(article.excerpt, query)) score += 25;
  if (includes(article.primaryCategory?.name, query)) score += 18;
  if (article.tags?.some((tag) => includes(tag.name, query))) score += 12;
  if (includes(article.body, query)) score += 5;
  return score;
};

export const rankArticleSearch = <T extends SearchableArticle>(articles: T[], query: string) => articles
  .map((article) => ({ article, score: scoreArticleSearch(article, query) }))
  .filter(({ score }) => score > 0)
  .sort((left, right) => right.score - left.score
    || Date.parse(String(right.article.publishedAt || right.article.updatedAt || '')) - Date.parse(String(left.article.publishedAt || left.article.updatedAt || '')))
  .map(({ article }) => article);
