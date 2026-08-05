type Candidate = { documentId?: string; slug?: string; title?: string; excerpt?: string; body?: string; locale?: string; primaryCategory?: { slug?: string }; tags?: Array<{ slug?: string }> };
export type InternalLinkSuggestion = { targetType: 'article'; targetId: string; title: string; url: string; suggestedAnchor: string; reason: string; score: number; generatedAt: string };
const tokens = (value: unknown) => new Set(String(value || '').toLocaleLowerCase().normalize('NFKC').match(/[\p{L}\p{N}]{4,}/gu) || []);
const overlap = (left: Set<string>, right: Set<string>) => { let score = 0; left.forEach((token) => { if (right.has(token)) score += 1; }); return score; };
const existingLinks = (html: string) => new Set([...String(html || '').matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1].replace(/^https?:\/\/[^/]+/, '')));
export const buildInternalLinkSuggestions = (current: Candidate, candidates: Candidate[], generatedAt = new Date().toISOString()): InternalLinkSuggestion[] => {
  const sourceTokens = tokens(`${current.title} ${current.excerpt} ${current.body}`); const linked = existingLinks(current.body || ''); const currentTags = new Set((current.tags || []).map((tag) => tag.slug));
  return candidates.filter((candidate) => candidate.documentId && candidate.slug && candidate.title && candidate.documentId !== current.documentId && candidate.locale === current.locale && !linked.has(`/blog/${candidate.slug}`)).map((candidate) => {
    let score = overlap(sourceTokens, tokens(`${candidate.title} ${candidate.excerpt}`)); const reasons = [];
    if (candidate.primaryCategory?.slug && candidate.primaryCategory.slug === current.primaryCategory?.slug) { score += 5; reasons.push('shared category'); }
    const sharedTags = (candidate.tags || []).filter((tag) => tag.slug && currentTags.has(tag.slug)).length; if (sharedTags) { score += sharedTags * 3; reasons.push('shared tags'); }
    return { targetType: 'article' as const, targetId: candidate.documentId!, title: candidate.title!, url: `/blog/${candidate.slug}`, suggestedAnchor: candidate.title!, reason: reasons.join(', ') || 'topic overlap', score, generatedAt };
  }).filter((item) => item.score > 1).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 10);
};
