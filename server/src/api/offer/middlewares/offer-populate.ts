import { createPopulateMiddleware } from '../../../content-system/middleware';
import { offerPopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(offerPopulate);
