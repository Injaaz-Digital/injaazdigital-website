import { SITE_URL, toAbsoluteSiteUrl } from '@/lib/config/site-config';
import { normalizeMedia } from '@/lib/strapi';
import { plainTextFromHtml } from '@/features/blog/server/reading-time';

const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

export default function StructuredData({ route, data }) {
  const graph = [
    { '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: 'Injaaz Digital', url: SITE_URL },
    { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: 'Injaaz Digital', url: SITE_URL, publisher: { '@id': `${SITE_URL}#organization` } },
  ];
  if (data?.type === 'blog-post' && data.article?.title) {
    const article = data.article;
    const image = normalizeMedia(article.seo?.shareImage || article.coverImage, { fallbackAlt: article.title });
    const canonical = toAbsoluteSiteUrl(route);
    graph.push({ '@type': 'BlogPosting', '@id': `${canonical}#article`, headline: article.title, description: article.excerpt || undefined, image: image?.url ? [image.url] : undefined, datePublished: article.publishedAt || undefined, dateModified: article.updatedAt || undefined, mainEntityOfPage: canonical, articleSection: article.primaryCategory?.name || article.category || undefined, keywords: article.tags?.map((tag) => tag.name).join(', ') || undefined, wordCount: plainTextFromHtml(article.body || '').split(/\s+/u).filter(Boolean).length, timeRequired: `PT${article.readingTimeMinutes || article.readTime || 1}M`, author: article.author?.name ? { '@type': 'Person', name: article.author.name, url: article.author.slug ? toAbsoluteSiteUrl(`/blog/author/${article.author.slug}`) : undefined, image: normalizeMedia(article.author.avatar)?.url || undefined } : { '@id': `${SITE_URL}#organization` }, publisher: { '@id': `${SITE_URL}#organization` } });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Blog', item: toAbsoluteSiteUrl('/blog') }, { '@type': 'ListItem', position: 2, name: article.title, item: canonical }] });
  }
  if (data?.type === 'blog-list' && Array.isArray(data.articles)) graph.push({ '@type': data.taxonomy ? 'CollectionPage' : 'ItemList', name: data.page?.title || 'Insights', url: toAbsoluteSiteUrl(route), itemListElement: data.articles.map((article, index) => ({ '@type': 'ListItem', position: index + 1, name: article.title, url: toAbsoluteSiteUrl(`/blog/${article.slug}`) })) });
  const blocks = data?.type === 'blog-list' ? data.page?.blocks : data?.blocks;
  const faq = Array.isArray(blocks) ? blocks.find((block) => block?.__component === 'blocks.faq') : null;
  const faqItems = Array.isArray(faq?.items) ? faq.items.filter((item) => item?.question && item?.answer) : [];
  if (faqItems.length) graph.push({ '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson({ '@context': 'https://schema.org', '@graph': graph }) }} />;
}
