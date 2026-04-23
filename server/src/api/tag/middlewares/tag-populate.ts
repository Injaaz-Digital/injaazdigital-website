import { createPopulateMiddleware } from '../../../content-system/middleware';
import { tagPopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(tagPopulate);
