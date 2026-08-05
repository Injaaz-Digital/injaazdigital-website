'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import Textarea from '@/shared/ui/Textarea';
import RadioGroup from '@/shared/ui/RadioGroup';
import { getLocaleDirection, normalizeLocale } from '@/lib/i18n/locale';
import { createLeadSubmission } from '@/lib/strapi';
import { INITIAL_HOMEWORK_DATA } from './HomeworkForm/homework.types';
import { focusHomeworkField, getErrorsForStep } from './HomeworkForm/homework.schema';
import { mapBackendErrors, toSubmitPayload } from './HomeworkForm/homework.mapper';

const STEPS = ['التواصل', 'النشاط', 'التحديات', 'الأهداف', 'المشروع', 'الميزانية'];

const BUDGET_OPTIONS = [
  { value: '5000-10000', label: '5K-10K' },
  { value: '10000-20000', label: '10K-20K' },
  { value: '20000-35000', label: '20K-35K' },
  { value: '35000+', label: '+35K' },
  { value: 'غير محدد بعد', label: 'للمناقشة' },
];

function HomeworkForm({ locale = 'en', onSubmitSuccess }) {
  const normalizedLocale = normalizeLocale(locale);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_HOMEWORK_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (fieldName) => {
    if (!errors[fieldName]) {
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const validateActiveStep = () => {
    const stepErrors = getErrorsForStep(activeStep, formData);
    setErrors(stepErrors);

    const [firstError] = Object.keys(stepErrors);
    if (firstError) {
      requestAnimationFrame(() => focusHomeworkField(firstError));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateActiveStep()) {
      return;
    }

    setActiveStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData(INITIAL_HOMEWORK_DATA);
    setErrors({});
    setActiveStep(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateActiveStep() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await createLeadSubmission(toSubmitPayload(formData, normalizedLocale));

      onSubmitSuccess?.(formData);
      setActiveStep(STEPS.length);
    } catch (error) {
      const { fieldErrors, submitMessage } = mapBackendErrors(error);
      const [firstFieldError] = Object.keys(fieldErrors);

      if (firstFieldError) {
        requestAnimationFrame(() => focusHomeworkField(firstFieldError));
      }

      setErrors({
        ...fieldErrors,
        submit: submitMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <>
          <Input
            id="fullName"
            name="fullName"
            label="الاسم الكامل"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            error={errors.fullName}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={handleInputChange}
            required
            error={errors.email}
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="رقم الهاتف"
            value={formData.phone}
            onChange={handleInputChange}
            required
            error={errors.phone}
          />

          <Input
            id="companyName"
            name="companyName"
            label="اسم الشركة/العلامة (اختياري)"
            value={formData.companyName}
            onChange={handleInputChange}
          />

          <Input
            id="website"
            name="website"
            type="url"
            label="الموقع الحالي (اختياري)"
            placeholder="https://www.example.com"
            value={formData.website}
            onChange={handleInputChange}
          />
        </>
      );
    }

    if (activeStep === 1) {
      return (
        <>
          <Textarea
            id="service"
            name="service"
            label="شنو هي الخدمة الرئيسية اللي كتقدم؟"
            value={formData.service}
            onChange={handleInputChange}
            required
            error={errors.service}
          />

          <Textarea
            id="audience"
            name="audience"
            label="شكون هوما الكليان اللي كتستهدف؟"
            value={formData.audience}
            onChange={handleInputChange}
            required
            error={errors.audience}
          />

          <Select
            id="experience"
            name="experience"
            label="شحال مدة باش بديتي هاد الخدمة/البيزنس؟"
            value={formData.experience}
            onChange={handleInputChange}
            required
            error={errors.experience}
          >
            <option value="">-- اختر المدة --</option>
            <option value="أقل من سنة">أقل من سنة</option>
            <option value="1-3 سنوات">1-3 سنوات</option>
            <option value="3-5 سنوات">3-5 سنوات</option>
            <option value="أكثر من 5 سنوات">أكثر من 5 سنوات</option>
          </Select>
        </>
      );
    }

    if (activeStep === 2) {
      return (
        <>
          <Textarea
            id="current_dislikes"
            name="current_dislikes"
            label="شنو ما عاجباكش فالموقع الحالي؟ (إذا كان)"
            value={formData.current_dislikes}
            onChange={handleInputChange}
          />

          <Textarea
            id="challenge"
            name="challenge"
            label="شنو أكبر تحدي فالتواجد الرقمي / جلب العملاء؟"
            value={formData.challenge}
            onChange={handleInputChange}
            required
            error={errors.challenge}
          />

          <Select
            id="prev_investment"
            name="prev_investment"
            label="واش ديجا استثمرتي فحلول رقمية مشابهة؟"
            value={formData.prev_investment}
            onChange={handleInputChange}
            required
            error={errors.prev_investment}
          >
            <option value="">-- اختر --</option>
            <option value="نعم">نعم</option>
            <option value="لا">لا</option>
          </Select>
        </>
      );
    }

    if (activeStep === 3) {
      return (
        <>
          <Textarea
            id="goal"
            name="goal"
            label="شنو الهدف رقم #1 من هاد المنصة الجديدة؟"
            placeholder="مثال: زيادة المواعيد..."
            value={formData.goal}
            onChange={handleInputChange}
            required
            error={errors.goal}
          />

          <Textarea
            id="success_metric"
            name="success_metric"
            label="كيفاش غتعرف بلي المشروع نجح؟ (مقياس النجاح)"
            value={formData.success_metric}
            onChange={handleInputChange}
            required
            error={errors.success_metric}
          />

          <Textarea
            id="vision"
            name="vision"
            label="فين كتشوف البيزنس ديالك من هنا لـ 1-3 سنين؟"
            value={formData.vision}
            onChange={handleInputChange}
            required
            error={errors.vision}
          />
        </>
      );
    }

    if (activeStep === 4) {
      return (
        <>
          <Select
            id="platform_type"
            name="platform_type"
            label="شنو النوع ديال المنصة اللي كتقلب عليها؟"
            value={formData.platform_type}
            onChange={handleInputChange}
            required
            error={errors.platform_type}
          >
            <option value="">-- اختر النوع --</option>
            <option value="موقع تعريفي بسيط">موقع تعريفي بسيط</option>
            <option value="موقع مع مدونة">موقع مع مدونة</option>
            <option value="منصة حجز مواعيد">منصة حجز مواعيد</option>
            <option value="متجر خدمات/دورات">متجر خدمات/دورات</option>
            <option value="منطقة أعضاء خاصة">منطقة أعضاء خاصة</option>
            <option value="آخر">آخر (للمناقشة)</option>
          </Select>

          <Textarea
            id="features"
            name="features"
            label="واش كاين شي خصائص (Features) ضرورية؟"
            placeholder="مثال: دفع أونلاين..."
            value={formData.features}
            onChange={handleInputChange}
          />

          <Textarea
            id="examples"
            name="examples"
            label="أمثلة لمواقع/منصات كتعجبوك؟ (اختياري)"
            placeholder="ضع الروابط هنا..."
            value={formData.examples}
            onChange={handleInputChange}
          />
        </>
      );
    }

    return (
      <>
        <RadioGroup
          id="budget"
          name="budget"
          label="نطاق الميزانية المخصص للمشروع؟ (بالدرهم)"
          value={formData.budget}
          options={BUDGET_OPTIONS}
          onChange={handleInputChange}
          required
          error={errors.budget}
        />

        <Select
          id="timeline"
          name="timeline"
          label="درجة الاستعجال للمشروع؟"
          value={formData.timeline}
          onChange={handleInputChange}
          required
          error={errors.timeline}
        >
          <option value="">-- اختر --</option>
          <option value="عاجل جدا (-1 شهر)">عاجل جدا (-1 شهر)</option>
          <option value="مستعجل (1-2 شهر)">مستعجل (1-2 شهر)</option>
          <option value="غير مستعجل (+3 أشهر)">غير مستعجل (+3 أشهر)</option>
          <option value="مرن">مرن</option>
        </Select>

        <Select
          id="decision_maker"
          name="decision_maker"
          label="هل أنت صاحب القرار الوحيد؟"
          value={formData.decision_maker}
          onChange={handleInputChange}
          required
          error={errors.decision_maker}
        >
          <option value="">-- اختر --</option>
          <option value="نعم">نعم</option>
          <option value="لا، مشترك">لا، مشترك</option>
        </Select>
      </>
    );
  };

  const isComplete = activeStep === STEPS.length;
  const isLastStep = activeStep === STEPS.length - 1;

  return (
    <section id="contact-form" dir={getLocaleDirection(normalizedLocale)} lang={normalizedLocale} className="px-4 py-16 sm:px-6">
      <div className="panel-surface mx-auto max-w-4xl rounded-3xl p-6 md:p-10">
        <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">لنبدأ بمشروعك</h2>
        <p className="mt-3 text-center text-sm text-slate-500 md:text-base">
          بعض الأسئلة السريعة تساعدنا نفهم احتياجاتك بشكل أفضل.
        </p>

        {!isComplete ? (
          <ol className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {STEPS.map((stepName, index) => {
              const active = index === activeStep;
              const done = index < activeStep;

              return (
                <li key={stepName} className="flex flex-col items-center gap-2 text-center">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      active || done
                        ? 'bg-[linear-gradient(275.3deg,#28AEC3_-29.82%,#084299_126.4%)] text-white'
                        : 'border border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-xs ${active ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>
                    {stepName}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : null}

        {isComplete ? (
          <div className="mx-auto mt-10 max-w-xl text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="mt-5 text-2xl font-bold text-slate-900">شكراً جزيلاً!</h3>
            <p className="mt-3 text-slate-600">
              لقد استلمنا معلوماتك بنجاح. فريقنا سيقوم بالمراجعة وسيتواصل معك قريباً.
            </p>

            <div className="mt-7">
              <Button type="button" variant="outline" icon={null} onClick={handleReset}>
                إرسال طلب جديد
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {renderStepContent()}

            {errors.submit ? <p className="text-center text-sm font-medium text-red-600">{errors.submit}</p> : null}

            <div
              className={`mt-8 flex items-center border-t border-slate-200 pt-6 ${
                activeStep === 0 ? 'justify-end' : 'justify-between'
              }`}
            >
              {activeStep > 0 ? (
                <Button type="button" variant="outline" icon={null} onClick={handleBack}>
                  السابق
                </Button>
              ) : null}

              <Button
                type={isLastStep ? 'submit' : 'button'}
                onClick={isLastStep ? undefined : handleNext}
                disabled={isSubmitting}
                icon={isLastStep ? null : 'arrow'}
              >
                {isLastStep ? (isSubmitting ? 'جاري الإرسال...' : 'إرسال المعلومات') : 'التالي'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

HomeworkForm.propTypes = {
  locale: PropTypes.oneOf(['en', 'ar']),
  onSubmitSuccess: PropTypes.func,
};

export default HomeworkForm;
