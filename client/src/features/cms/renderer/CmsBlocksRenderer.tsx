import { Fragment } from 'react';
import { CMS_BLOCK_REGISTRY } from '../blocks/registry';
import { cmsBlockSchema } from '../blocks/schemas/block.schemas';
import type { CmsBlockUid, CmsLocale } from '../domain/cms.types';
import { cmsLogger } from '../server/cms-logger';

type Props = { blocks?: unknown[]; locale: CmsLocale; route?: string; allowedComponents?: readonly CmsBlockUid[] };

export default function CmsBlocksRenderer({ blocks = [], locale, route, allowedComponents }: Props) {
  const allowed = allowedComponents ? new Set(allowedComponents) : null;
  return <>{blocks.map((rawBlock, index) => {
    const parsed = cmsBlockSchema.safeParse(rawBlock);
    if (!parsed.success) {
      const candidate = rawBlock as { __component?: string; id?: string | number } | null;
      cmsLogger.warn('Invalid optional CMS block skipped.', { route, locale, blockUid: candidate?.__component, blockId: candidate?.id, issues: parsed.error.issues.map(({ path, code }) => ({ path, code })) });
      return process.env.NODE_ENV === 'development' ? <aside key={`invalid-${index}`} className="m-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">Invalid CMS block: {candidate?.__component || 'unknown'}</aside> : null;
    }
    if (allowed && !allowed.has(parsed.data.__component)) return null;
    const render = CMS_BLOCK_REGISTRY[parsed.data.__component];
    return <Fragment key={`${parsed.data.__component}-${parsed.data.id ?? index}`}>{render({ block: parsed.data, index, locale, route })}</Fragment>;
  })}</>;
}
