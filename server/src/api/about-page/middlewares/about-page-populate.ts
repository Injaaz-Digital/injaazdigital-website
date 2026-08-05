import { applyPopulate, pagePopulate } from '../../../content-system/populate';
export default () => async (ctx, next) => { applyPopulate(ctx, pagePopulate); await next(); };
