import { factories } from '@strapi/strapi';
import { articlePopulate } from '../../../content-system/populate';
import { rankArticleSearch } from '../services/article-search';

const value = (input: unknown) => typeof input === 'string' ? input.trim() : '';
const positiveInt = (input: unknown, fallback: number, max: number) => {
  const parsed = Number.parseInt(String(input ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
};

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async search(ctx) {
    const query = value(ctx.query.q);
    if (query.length < 2) return ctx.badRequest('Search query must contain at least two characters.');
    const locale = value(ctx.query.locale) === 'ar' ? 'ar' : 'en';
    const page = positiveInt(ctx.query.page, 1, 10000);
    const pageSize = positiveInt(ctx.query.pageSize, 12, 24);
    const category = value(ctx.query.category);
    const tag = value(ctx.query.tag);
    const andFilters: any[] = [{ locale: { $eq: locale } }];
    if (category) andFilters.push({ primaryCategory: { slug: { $eq: category } } });
    if (tag) andFilters.push({ tags: { slug: { $eq: tag } } });
    const articles = await strapi.documents('api::article.article').findMany({
      status: 'published', locale, filters: { $and: andFilters }, populate: articlePopulate as any,
      limit: 500,
    } as any);
    const ranked = rankArticleSearch(articles as any[], query);
    const total = ranked.length;
    const start = (page - 1) * pageSize;
    ctx.body = {
      data: ranked.slice(start, start + pageSize),
      meta: { page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)), total },
    };
  },
}));
