import sanitizeHtml from 'sanitize-html';
import { DomUtils, parseDocument } from 'htmlparser2';
import type { ChildNode, Element } from 'domhandler';

export type RichTextHeading = { id: string; title: string; level: 2 | 3 };

const slugify = (value: string, index: number) => {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  return slug ? `${slug}-${index}` : `section-${index}`;
};

const isElement = (node: ChildNode): node is Element => node.type === 'tag';

const addSafeHeadingIds = (html: string) => {
  const document = parseDocument(html);
  const headings: RichTextHeading[] = [];
  const walk = (nodes: ChildNode[]) => {
    for (const node of nodes) {
      if (!isElement(node)) continue;
      if (node.name === 'h2' || node.name === 'h3') {
        const title = DomUtils.textContent(node).trim();
        const id = slugify(title, headings.length);
        node.attribs.id = id;
        headings.push({ id, title, level: node.name === 'h2' ? 2 : 3 });
      }
      if (node.children.length) walk(node.children);
    }
  };
  walk(document.children);
  return { html: DomUtils.getInnerHTML(document), headings };
};

export const sanitizeCmsRichText = (input: unknown) => {
  const source = typeof input === 'string' ? input : '';
  const sanitized = sanitizeHtml(source, {
    allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'blockquote', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'code', 'pre', 'figure', 'figcaption', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      h2: ['id'], h3: ['id'], h4: ['id'],
      th: ['scope'], td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href || '');
        return { tagName, attribs: { ...attribs, ...(external ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {}) } };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    },
  });
  return addSafeHeadingIds(sanitized);
};
