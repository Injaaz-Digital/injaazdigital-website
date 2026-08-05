import { getSitemapEntries } from '@/features/cms/content/sitemap/sitemap.repository';

export default async function sitemap() {
  return getSitemapEntries();
}
