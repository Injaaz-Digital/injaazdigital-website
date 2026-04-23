import { createPopulateMiddleware } from '../../../content-system/middleware';
import { authorPopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(authorPopulate);
