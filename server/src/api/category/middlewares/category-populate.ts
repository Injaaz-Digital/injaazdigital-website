import { applyPopulate, categoryPopulate } from '../../../content-system/populate';
export default () => async (ctx, next) => { applyPopulate(ctx, categoryPopulate); await next(); };
