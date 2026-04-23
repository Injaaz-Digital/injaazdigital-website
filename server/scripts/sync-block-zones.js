'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'src', 'content-system', 'blocks.json');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

const uidToSchemaPath = (uid) => {
  const match = /^api::([^\.]+)\.([^\.]+)$/.exec(uid);
  if (!match) {
    return null;
  }

  const apiName = match[1];
  const typeName = match[2];

  return path.join(ROOT, 'src', 'api', apiName, 'content-types', typeName, 'schema.json');
};

const syncSchema = (uid, blockSetName) => {
  const schemaPath = uidToSchemaPath(uid);
  if (!schemaPath || !fs.existsSync(schemaPath)) {
    return { uid, status: 'missing-schema' };
  }

  const allowedBlocks = registry.blockSets[blockSetName];
  if (!Array.isArray(allowedBlocks)) {
    return { uid, status: 'missing-block-set' };
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const current = schema?.attributes?.blocks?.components;

  if (!Array.isArray(current)) {
    return { uid, status: 'no-dynamic-zone' };
  }

  const next = [...allowedBlocks];
  const changed = JSON.stringify(current) !== JSON.stringify(next);

  if (changed) {
    schema.attributes.blocks.components = next;
    fs.writeFileSync(schemaPath, `${JSON.stringify(schema, null, 2)}\n`, 'utf8');
  }

  return { uid, status: changed ? 'updated' : 'unchanged' };
};

const results = Object.entries(registry.contentTypeBlockSet).map(([uid, blockSetName]) => syncSchema(uid, blockSetName));

const hasFailure = results.some((result) => result.status === 'missing-schema' || result.status === 'missing-block-set');

results.forEach((result) => {
  console.log(`[sync-block-zones] ${result.uid}: ${result.status}`);
});

if (hasFailure) {
  process.exit(1);
}
