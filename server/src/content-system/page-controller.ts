type PageEntry = { blocks?: Array<Record<string, unknown>> };

export const enrichBookCallSteppers = async (strapi: any, value: unknown) => {
  const entries = Array.isArray(value) ? value : value ? [value] : [];
  await Promise.all(entries.map(async (entry: PageEntry) => {
    const blocks = Array.isArray(entry?.blocks) ? entry.blocks : [];
    await Promise.all(blocks.map(async (block: any) => {
      if (block?.__component !== 'blocks.book-call') return;
      // One migration window: preserve an existing plugin relation only when the
      // new external flow key has not been assigned yet.
      if (!block.questionFlowKey && block.id) {
        const component = await strapi.db.query('blocks.book-call').findOne({
          where: { id: block.id },
          populate: { stepper: true },
        });
        block.questionFlowKey = component?.stepper?.key || '';
      }
      delete block.stepper;
    }));
  }));
  return value;
};
