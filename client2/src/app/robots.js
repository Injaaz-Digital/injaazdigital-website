import { SITE_URL } from '@/lib/config/site-config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL.replace(/\/+$/, '')}/sitemap.xml`,
  };
}
