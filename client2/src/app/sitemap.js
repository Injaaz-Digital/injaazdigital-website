import { getSitemapEntries } from '@/features/cms/lib/cms-page';

export default async function sitemap() {
  return getSitemapEntries();
}
