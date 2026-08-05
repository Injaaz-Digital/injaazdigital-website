import type { HomeworkErrors, HomeworkFormData } from './homework.types';
const EMAIL = /\S+@\S+\.\S+/;
export const getErrorsForStep = (step: number, data: HomeworkFormData): HomeworkErrors => {
  const errors: HomeworkErrors = {};
  if (step === 0) { if (!data.fullName) errors.fullName = 'الاسم الكامل مطلوب'; if (!data.email) errors.email = 'البريد الإلكتروني مطلوب'; else if (!EMAIL.test(data.email)) errors.email = 'صيغة البريد الإلكتروني غير صحيحة'; if (!data.phone) errors.phone = 'رقم الهاتف مطلوب'; }
  if (step === 1) { if (!data.service) errors.service = 'وصف الخدمة مطلوب'; if (!data.audience) errors.audience = 'تحديد الجمهور المستهدف مطلوب'; if (!data.experience) errors.experience = 'اختيار مدة الخبرة مطلوب'; }
  if (step === 2) { if (!data.challenge) errors.challenge = 'وصف التحدي مطلوب'; if (!data.prev_investment) errors.prev_investment = 'الاختيار مطلوب'; }
  if (step === 3) { if (!data.goal) errors.goal = 'تحديد الهدف مطلوب'; if (!data.success_metric) errors.success_metric = 'تحديد مقياس النجاح مطلوب'; if (!data.vision) errors.vision = 'وصف الرؤية مطلوب'; }
  if (step === 4 && !data.platform_type) errors.platform_type = 'اختيار نوع المنصة مطلوب';
  if (step === 5) { if (!data.budget) errors.budget = 'اختيار نطاق الميزانية مطلوب'; if (!data.timeline) errors.timeline = 'اختيار درجة الاستعجال مطلوبة'; if (!data.decision_maker) errors.decision_maker = 'الاختيار مطلوب'; }
  return errors;
};
export const focusHomeworkField = (fieldName: string) => { const target = document.getElementById(fieldName) || document.querySelector<HTMLElement>(`[name="${fieldName}"]`); if (!target) return; target.scrollIntoView({ behavior: 'smooth', block: 'center' }); window.setTimeout(() => target.focus({ preventScroll: true }), 240); };
