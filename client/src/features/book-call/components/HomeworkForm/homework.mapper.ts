import type { AppLocale } from '@/lib/i18n/routing';
import type { HomeworkFormData } from './homework.types';
export const toSubmitPayload = (formData: HomeworkFormData, locale: AppLocale) => ({ ...formData, sourcePath: window.location.pathname, locale });
export const mapBackendErrors = (error: any) => { const details = error?.payload?.error?.details; const fieldErrors = details?.fieldErrors && typeof details.fieldErrors === 'object' ? details.fieldErrors : {}; const globalErrors = Array.isArray(details?.globalErrors) ? details.globalErrors : []; return { fieldErrors, submitMessage: globalErrors[0] || 'حدث خطأ أثناء إرسال المعلومات. المرجو المحاولة مرة أخرى.' }; };
