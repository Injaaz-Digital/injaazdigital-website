import { createPopulateMiddleware } from '../../../content-system/middleware';
import { siteSettingPopulate } from '../../../content-system/populate';

export default createPopulateMiddleware(siteSettingPopulate);
