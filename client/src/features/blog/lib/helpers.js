const toSafeHeadingId = (value, index) => {
  const normalized = (value || '')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .trim()
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '')
    .replace(/\s+/g, '-');

  return normalized.length > 0 ? `${normalized}-${index}` : `section-${index}`;
};

export const decorateRichText = (html) => {
  const headings = [];
  let index = 0;

  const decoratedHtml = (html || '').replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, rawText) => {
    const title = rawText.replace(/<[^>]+>/g, '').trim();
    const id = toSafeHeadingId(title, index);
    headings.push({ id, title, level: Number(level) });
    index += 1;
    return `<h${level}${attrs} id="${id}">${rawText}</h${level}>`;
  });

  return { html: decoratedHtml, headings };
};
