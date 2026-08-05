import { fetchContentIndex } from '@/lib/strapi';
import { SITE_URL } from '@/lib/config/site-config';
import { BLOG_ARTICLE_POPULATE } from '@/features/cms/content/shared/populate';
import { sanitizeCmsRichText } from './rich-text';
import type { AppLocale } from '@/lib/i18n/routing';

const xml = (value: unknown) => String(value || '').replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] || character);
const cdata = (value: string) => value.replace(/]]>/g, ']]]]><![CDATA[>');

export async function buildBlogRss(locale: AppLocale) {
  const articles = await fetchContentIndex('articles', locale, { populate: BLOG_ARTICLE_POPULATE, sort: ['publishedAt:desc'], pagination: { pageSize: 30 } });
  const prefix = `${SITE_URL}/${locale}`;
  const items = articles.map((article: any) => {
    const url = `${prefix}/blog/${encodeURIComponent(article.slug)}`;
    const safeBody = sanitizeCmsRichText(article.body || '').html;
    return `<item><title>${xml(article.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(article.excerpt)}</description><content:encoded><![CDATA[${cdata(safeBody)}]]></content:encoded>${article.author?.name ? `<dc:creator>${xml(article.author.name)}</dc:creator>` : ''}${article.primaryCategory?.name || article.category ? `<category>${xml(article.primaryCategory?.name || article.category)}</category>` : ''}${article.publishedAt ? `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>` : ''}</item>`;
  }).join('');
  const title = locale === 'ar' ? 'رؤى إنجاز ديجيتال' : 'Injaaz Digital Insights';
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${xml(title)}</title><link>${xml(`${prefix}/blog`)}</link><description>${xml(title)}</description><language>${locale}</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
}
