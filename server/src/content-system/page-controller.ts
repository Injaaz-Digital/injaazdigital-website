type PageEntry = { blocks?: Array<Record<string, unknown>> };

export const enrichBookCallSteppers = async (_strapi: any, value: unknown) => {
  const entries = Array.isArray(value) ? value : value ? [value] : [];
  await Promise.all(entries.map(async (entry: PageEntry) => {
    const blocks = Array.isArray(entry?.blocks) ? entry.blocks : [];
    blocks.forEach((block: any) => {
      if (block?.__component !== 'blocks.book-call') return;
      // Flow selection belongs to the registered website integration, not CMS.
      delete block.questionFlowKey;
      delete block.stepper;
    });
  }));
  return value;
};
