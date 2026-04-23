import { createPopulateMiddleware } from '../../../content-system/middleware';
import { blogPagePopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(blogPagePopulate);
