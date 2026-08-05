import { buildBlogRss } from '@/features/blog/server/rss';
export async function GET() { return new Response(await buildBlogRss('en'), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } }); }
