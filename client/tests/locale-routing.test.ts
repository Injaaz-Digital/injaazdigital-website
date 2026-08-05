import assert from 'node:assert/strict';
import test from 'node:test';
import { localeFromPathname, localizePathname, preferredLocale, stripLocalePrefix } from '../src/lib/i18n/routing';

test('locale routing identifies and replaces URL prefixes', () => {
  assert.equal(localeFromPathname('/ar/blog/post'), 'ar');
  assert.equal(localeFromPathname('/english'), null);
  assert.equal(stripLocalePrefix('/en'), '/');
  assert.equal(localizePathname('/ar/blog/post', 'en'), '/en/blog/post');
  assert.equal(localizePathname('/', 'ar'), '/ar');
});

test('locale preference prioritizes a valid cookie', () => {
  assert.equal(preferredLocale('en', 'ar-MA,ar;q=0.9'), 'en');
  assert.equal(preferredLocale('ar', 'en-US'), 'ar');
});

test('locale preference respects weighted Accept-Language values', () => {
  assert.equal(preferredLocale(null, 'en-US;q=0.7, ar-MA;q=0.9'), 'ar');
  assert.equal(preferredLocale(null, 'en-US, ar;q=0.5'), 'en');
  assert.equal(preferredLocale(null, 'fr-FR, en;q=0.8'), 'en');
  assert.equal(preferredLocale(null, null), 'en');
});
