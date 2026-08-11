export const normalizeBookCallFlowKey = (value) => (typeof value === 'string' ? value.trim() : '');

export const getBookCallFlowRequestKeys = (blocks) => [
  ...new Set(
    (Array.isArray(blocks) ? blocks : [])
      .filter((block) => block?.__component === 'blocks.book-call')
      .map((block) => normalizeBookCallFlowKey(block.questionFlowKey))
  ),
];
