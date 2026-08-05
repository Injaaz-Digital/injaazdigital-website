import assert from 'node:assert/strict';
import test from 'node:test';
import { sanitizeCmsRichText } from '../src/features/blog/server/rich-text';

test('rich text sanitizer removes executable HTML and keeps heading IDs', () => {
  const result = sanitizeCmsRichText('<h2>Hello World</h2><p onclick="alert(1)">Safe <a href="javascript:alert(1)">link</a></p><script>alert(1)</script>');
  assert.match(result.html, /id="hello-world-0"/);
  assert.doesNotMatch(result.html, /script|onclick|javascript:/i);
  assert.deepEqual(result.headings, [{ id: 'hello-world-0', title: 'Hello World', level: 2 }]);
});

test('external rich text links receive safe relationship attributes', () => {
  const result = sanitizeCmsRichText('<a href="https://example.com">External</a><a href="/about">Internal</a>');
  assert.match(result.html, /rel="noopener noreferrer nofollow"/);
  assert.match(result.html, /href="\/about"/);
});
