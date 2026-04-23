import { applyPopulate, articlePopulate } from '../../../content-system/populate';

export default () => {
  return async (ctx, next) => {
    applyPopulate(ctx, articlePopulate);

    const query = { ...(ctx.query ?? {}) };
    if (!query.sort) {
      query.sort = ['featured:desc', 'publishedAt:desc', 'updatedAt:desc'];
      ctx.query = query;
    }

    await next();
  };
};
