import { applyPopulate } from './populate';

type PopulateConfig = Record<string, unknown>;

export const createPopulateMiddleware = (populateConfig: PopulateConfig) => {
  return () => {
    return async (ctx, next) => {
      applyPopulate(ctx, populateConfig);
      await next();
    };
  };
};
