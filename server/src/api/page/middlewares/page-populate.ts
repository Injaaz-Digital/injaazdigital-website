import { createPopulateMiddleware } from '../../../content-system/middleware';
import { pagePopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(pagePopulate);
