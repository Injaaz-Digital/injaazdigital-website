import type { FooterLinkData } from './footer.types';
export const normalizeEmailAddress = (value?: string) => String(value || '').trim().replace(/^mailto:/i, '');
const SOCIAL_MATCHERS = [{ key: 'instagram', pattern: /instagram/i }, { key: 'linkedin', pattern: /linkedin/i }, { key: 'youtube', pattern: /youtube|youtu\.be/i }, { key: 'facebook', pattern: /facebook|fb\.com/i }, { key: 'x', pattern: /twitter|x\.com/i }, { key: 'tiktok', pattern: /tiktok/i }, { key: 'whatsapp', pattern: /whatsapp|wa\.me/i }];
export const getSocialIconKey = (item: FooterLinkData) => SOCIAL_MATCHERS.find(({ pattern }) => pattern.test(`${item.label} ${item.url}`))?.key || 'link';
