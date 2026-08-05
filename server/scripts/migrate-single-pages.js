'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const DRY_RUN = process.argv.includes('--dry-run');
const KEEP_SOURCE = process.argv.includes('--keep-source');
const LOCALES = ['en', 'ar'];
const PAGE_UID = 'api::page.page';
const PAGES = [
  { slug: 'home', targetUid: 'api::home-page.home-page' },
  { slug: 'about', targetUid: 'api::about-page.about-page' },
];

const pageData = (source) => ({
  title: source.title,
  blocks: source.blocks || [],
  seo: source.seo || null,
});

async function findSource(strapi, slug, locale, populate) {
  const rows = await strapi.documents(PAGE_UID).findMany({
    locale,
    status: 'draft',
    filters: { slug: { $eq: slug } },
    populate,
    limit: 1,
  });
  return rows[0] || null;
}

async function migrateTarget(strapi, targetUid, localizedSources) {
  const targetRows = await strapi.db.query(targetUid).findMany({
    select: ['documentId', 'locale', 'updatedAt'],
    orderBy: { updatedAt: 'desc' },
  });
  let documentId = targetRows.find((row) => row.locale === 'en')?.documentId || targetRows[0]?.documentId;

  for (const locale of LOCALES) {
    const source = localizedSources[locale];
    if (!source) continue;
    if (DRY_RUN) continue;

    if (!documentId) {
      const created = await strapi.documents(targetUid).create({
        locale,
        status: 'draft',
        data: pageData(source),
      });
      documentId = created.documentId;
    } else {
      await strapi.documents(targetUid).update({
        documentId,
        locale,
        status: 'draft',
        data: pageData(source),
      });
    }

    if (source.publishedAt) {
      await strapi.documents(targetUid).publish({ documentId, locale });
    }
  }
}

async function run() {
  const context = await compileStrapi();
  const strapi = await createStrapi(context).load();
  try {
    const { pagePopulate } = require('../dist/src/content-system/populate');
    for (const definition of PAGES) {
      const localizedSources = {};
      for (const locale of LOCALES) {
        localizedSources[locale] = await findSource(strapi, definition.slug, locale, pagePopulate);
      }

      const foundLocales = LOCALES.filter((locale) => localizedSources[locale]);
      console.log(JSON.stringify({ event: 'single-page-migration', slug: definition.slug, targetUid: definition.targetUid, locales: foundLocales, dryRun: DRY_RUN }));
      if (!foundLocales.length) continue;

      await migrateTarget(strapi, definition.targetUid, localizedSources);
      if (!DRY_RUN && !KEEP_SOURCE) {
        const documentIds = new Set(foundLocales.map((locale) => localizedSources[locale].documentId).filter(Boolean));
        for (const documentId of documentIds) {
          await strapi.documents(PAGE_UID).delete({ documentId });
        }
      }
    }
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
