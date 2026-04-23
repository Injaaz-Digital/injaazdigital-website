import { createPopulateMiddleware } from '../../../content-system/middleware';
import { aboutPagePopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(aboutPagePopulate);
