import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateReadingTime, plainTextFromHtml } from '../src/features/blog/server/reading-time';
import { rankRelatedArticles } from '../src/features/blog/server/recommendations';
import { buildMonthDays, formatLocalDateValue } from '../src/features/book-call/components/BookingCalendar/calendar-date';

test('reading time uses sanitized text and honors a positive override', () => {
  assert.equal(plainTextFromHtml('<h2>Hello</h2><script>bad()</script><p>world</p>'), 'Hello world');
  assert.equal(estimateReadingTime('<p>short article</p>'), 1);
  assert.equal(estimateReadingTime('<p>short article</p>', 9), 9);
});

test('related ranking prioritizes manually selected and shared-pillar articles', () => {
  const base: any = { title: 'Current', slug: 'current', locale: 'en', body: '', headings: [], tags: [{ name: 'CRM', slug: 'crm' }], relatedPosts: [{ title: 'Manual', slug: 'manual' }], contentPillar: { name: 'Growth', slug: 'growth' }, readingTimeMinutes: 1 };
  const candidates: any[] = [
    { ...base, title: 'Tag', slug: 'tag', relatedPosts: [] },
    { ...base, title: 'Manual', slug: 'manual', tags: [], contentPillar: null, relatedPosts: [] },
  ];
  assert.deepEqual(rankRelatedArticles(base, candidates).map((article) => article.slug), ['manual', 'tag']);
});

test('calendar month grid is stable and contains six complete weeks', () => {
  const days = buildMonthDays(new Date(2026, 6, 1));
  assert.equal(days.length, 42);
  assert.equal(formatLocalDateValue(new Date(2026, 6, 17)), '2026-07-17');
  assert.equal(days.filter((day) => day.inMonth).length, 31);
});
