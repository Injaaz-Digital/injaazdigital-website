'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');
const { UIDS, SINGLE_TYPE_UIDS } = require('./seed-injaaz/registry');

const SEED_NAMESPACE = 'injaaz-bootstrap';
const SEED_VERSION = process.env.SEED_INJAAZ_BOOTSTRAP_VERSION || 'v1';
const FORCE_SEED = process.argv.includes('--force') || process.env.SEED_INJAAZ_FORCE === 'true';
const ACTIVE_LOCALES = ['en', 'ar'];

const nowIso = () => new Date().toISOString();

const toTimestamp = (value) => {
  const dateValue = value ? new Date(value).getTime() : 0;
  return Number.isFinite(dateValue) ? dateValue : 0;
};

const pickCanonicalSingleTypeDocument = (rows) => {
  const grouped = rows.reduce((accumulator, row) => {
    const key = row.documentId;
    if (!key) {
      return accumulator;
    }

    if (!accumulator[key]) {
      accumulator[key] = {
        documentId: key,
        locales: new Set(),
        hasDefaultLocale: false,
        latestUpdatedAt: 0,
      };
    }

    accumulator[key].locales.add(row.locale);
    accumulator[key].hasDefaultLocale = accumulator[key].hasDefaultLocale || row.locale === 'en';
    accumulator[key].latestUpdatedAt = Math.max(accumulator[key].latestUpdatedAt, toTimestamp(row.updatedAt));
    return accumulator;
  }, {});

  const candidates = Object.values(grouped);
  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((left, right) => {
    const localeCountDiff = right.locales.size - left.locales.size;
    if (localeCountDiff !== 0) {
      return localeCountDiff;
    }

    if (left.hasDefaultLocale !== right.hasDefaultLocale) {
      return right.hasDefaultLocale ? 1 : -1;
    }

    return right.latestUpdatedAt - left.latestUpdatedAt;
  });

  return candidates[0].documentId;
};

async function ensureSingleTypeCanonicalDocuments(strapi, uid) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['id', 'documentId', 'locale', 'updatedAt'],
  });

  const documentIds = [...new Set((rows || []).map((row) => row.documentId).filter(Boolean))];
  if (documentIds.length <= 1) {
    return;
  }

  const canonicalDocumentId = pickCanonicalSingleTypeDocument(rows);
  const obsoleteDocumentIds = documentIds.filter((documentId) => documentId !== canonicalDocumentId);

  for (const documentId of obsoleteDocumentIds) {
    const localesForDocument = [...new Set(rows.filter((row) => row.documentId === documentId).map((row) => row.locale))];

    for (const locale of localesForDocument) {
      await strapi.documents(uid).delete({
        documentId,
        locale,
      });
    }
  }
}

async function ensureLocales(strapi) {
  try {
    const localeQuery = strapi.db.query('plugin::i18n.locale');
    const existing = await localeQuery.findMany({
      where: {
        code: {
          $in: ACTIVE_LOCALES,
        },
      },
    });

    const existingCodes = new Set((existing || []).map((entry) => entry.code));

    if (!existingCodes.has('en')) {
      await localeQuery.create({
        data: {
          name: 'English (en)',
          code: 'en',
          isDefault: true,
        },
      });
    }

    if (!existingCodes.has('ar')) {
      await localeQuery.create({
        data: {
          name: 'Arabic (ar)',
          code: 'ar',
          isDefault: false,
        },
      });
    }
  } catch (error) {
    strapi.log.warn(`Locale setup skipped: ${error.message}`);
  }
}

async function ensurePublicReadPermissions(strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  if (!publicRole?.id) {
    return;
  }

  const actions = [
    `${UIDS.siteSetting}.find`,
    `${UIDS.homePage}.find`,
    `${UIDS.growthEnginePage}.find`,
    `${UIDS.webStudioPage}.find`,
    `${UIDS.aboutPage}.find`,
    `${UIDS.blogPage}.find`,
    `${UIDS.page}.find`,
    `${UIDS.page}.findOne`,
    `${UIDS.article}.find`,
    `${UIDS.article}.findOne`,
    `${UIDS.author}.find`,
    `${UIDS.author}.findOne`,
    `${UIDS.tag}.find`,
    `${UIDS.tag}.findOne`,
  ];

  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');

  for (const action of actions) {
    const existing = await permissionQuery.findOne({
      where: {
        action,
        role: publicRole.id,
      },
    });

    if (existing?.id) {
      if (!existing.enabled) {
        await permissionQuery.update({
          where: { id: existing.id },
          data: { enabled: true },
        });
      }
      continue;
    }

    await permissionQuery.create({
      data: {
        action,
        role: publicRole.id,
        enabled: true,
      },
    });
  }
}

async function runSeed(strapi) {
  const lockKey = `${SEED_NAMESPACE}.${SEED_VERSION}.completed`;
  const seedStore = strapi.store({
    type: 'core',
    name: 'seed',
    environment: strapi.config.environment,
  });

  const existingLock = await seedStore.get({ key: lockKey });

  if (existingLock && !FORCE_SEED) {
    strapi.log.info(`Seed ${SEED_NAMESPACE}@${SEED_VERSION} already completed. Use --force to rerun.`);
    return;
  }

  await ensureLocales(strapi);

  for (const singleTypeUid of SINGLE_TYPE_UIDS) {
    await ensureSingleTypeCanonicalDocuments(strapi, singleTypeUid);
  }

  await ensurePublicReadPermissions(strapi);

  await seedStore.set({
    key: lockKey,
    value: {
      namespace: SEED_NAMESPACE,
      version: SEED_VERSION,
      locales: ACTIVE_LOCALES,
      completedAt: nowIso(),
      forced: FORCE_SEED,
    },
  });

  strapi.log.info(`Seed ${SEED_NAMESPACE}@${SEED_VERSION} completed.`);
}

async function run() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    await runSeed(app);
  } finally {
    await app.destroy();
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('[seed:injaaz] failed:', error);
    process.exit(1);
  });
