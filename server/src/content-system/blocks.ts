import blockRegistry from './blocks.json';

export type BlockSetName = keyof typeof blockRegistry.blockSets;

export const BLOCK_UID = blockRegistry.blocks;
export const BLOCK_SET = blockRegistry.blockSets;
export const CONTENT_TYPE_BLOCK_SET = blockRegistry.contentTypeBlockSet;

export const PAGE_BLOCKS = [...BLOCK_SET.page];
export const BLOG_PAGE_BLOCKS = [...BLOCK_SET.blog];

const FALLBACK_BLOCK_SET: BlockSetName = 'page';

export const getBlockSetForContentType = (uid: string): BlockSetName => {
  const setName = CONTENT_TYPE_BLOCK_SET[uid as keyof typeof CONTENT_TYPE_BLOCK_SET] as BlockSetName | undefined;
  return setName || FALLBACK_BLOCK_SET;
};

export const getAllowedBlocksForContentType = (uid: string): string[] => {
  const setName = getBlockSetForContentType(uid);
  return [...BLOCK_SET[setName]];
};

export const hasAllowedBlock = (uid: string, blockUid: string): boolean => {
  return getAllowedBlocksForContentType(uid).includes(blockUid);
};
