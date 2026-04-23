import { createPopulateMiddleware } from '../../../content-system/middleware';
import { servicePagePopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(servicePagePopulate);
