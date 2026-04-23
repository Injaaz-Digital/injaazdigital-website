import { createPopulateMiddleware } from '../../../content-system/middleware';
import { marketingPagePopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(marketingPagePopulate);
