import type { ZodIssue } from 'zod';

export class CmsError extends Error {
  readonly code: string;
  readonly context: Record<string, unknown>;

  constructor(message: string, code: string, context: Record<string, unknown> = {}, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CmsError';
    this.code = code;
    this.context = context;
  }
}

export class CmsValidationError extends CmsError {
  readonly issues: ZodIssue[];

  constructor(message: string, issues: ZodIssue[], context: Record<string, unknown> = {}) {
    super(message, 'CMS_VALIDATION_FAILED', context);
    this.name = 'CmsValidationError';
    this.issues = issues;
  }
}

export class CmsPageNotFoundError extends CmsError {
  constructor(pathname: string, locale: string) {
    super('CMS page was not found.', 'CMS_PAGE_NOT_FOUND', { pathname, locale });
    this.name = 'CmsPageNotFoundError';
  }
}
