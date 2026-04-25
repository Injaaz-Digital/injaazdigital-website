import { fetchSingleType, fetchWithLocaleFallback } from '@/lib/strapi/queries';

const EN_FALLBACK = {
  pageTitle: 'Book a Strategy Call',
  pageSubtitle: 'Answer a few quick questions, then choose a time that works for you.',
  meetingName: 'Injaaz Digital Strategy Call',
  meetingDescription:
    'A focused call to understand your current digital system, clarify gaps, and identify the best next step.',
  durationLabel: '30 min',
  timezoneLabel: 'Africa/Casablanca',
  hostName: 'Injaaz Digital',
  hostRole: 'Digital growth partner',
  introEyebrow: 'Injaaz Digital',
  qualificationIntroTitle: 'A few details first',
  qualificationIntroDescription: 'Your answers help us prepare and keep the call focused.',
  bookingTitle: 'Choose a time',
  bookingDescription: 'Available times are filtered against our live calendar.',
  noSlotsTitle: 'No available times on this day',
  noSlotsDescription: 'Try another date or check again later.',
  loadingSlotsLabel: 'Loading available times',
  errorTitle: 'Availability is temporarily unavailable',
  errorDescription: 'Please retry. If this keeps happening, contact us directly.',
  retryLabel: 'Retry',
  confirmButtonLabel: 'Confirm meeting',
  selectedTimeLabel: 'Selected time',
  successTitle: 'Your strategy call is booked',
  successDescription: 'We saved your meeting and sent the calendar details.',
  openMeetLabel: 'Open Google Meet',
  backHomeLabel: 'Back to website',
  fallbackTitle: 'We need a little more context before booking',
  fallbackDescription:
    'Your answers were saved. This request does not meet the current booking threshold yet, but we can still review it manually.',
  fallbackCtaLabel: 'Back to website',
  fallbackCtaHref: '/',
};

const AR_FALLBACK = {
  pageTitle: 'احجز مكالمة استراتيجية',
  pageSubtitle: 'أجب عن بعض الأسئلة السريعة ثم اختر الوقت المناسب لك.',
  meetingName: 'مكالمة استراتيجية مع Injaaz Digital',
  meetingDescription: 'مكالمة مركزة لفهم نظامك الرقمي الحالي، تحديد الثغرات، واقتراح الخطوة المناسبة.',
  durationLabel: '30 دقيقة',
  timezoneLabel: 'توقيت الدار البيضاء',
  hostName: 'Injaaz Digital',
  hostRole: 'شريك نمو رقمي',
  introEyebrow: 'Injaaz Digital',
  qualificationIntroTitle: 'بعض التفاصيل أولا',
  qualificationIntroDescription: 'تساعدنا إجاباتك على التحضير وجعل المكالمة مركزة.',
  bookingTitle: 'اختر الوقت المناسب',
  bookingDescription: 'الأوقات المتاحة مفلترة حسب التقويم المباشر.',
  noSlotsTitle: 'لا توجد أوقات متاحة في هذا اليوم',
  noSlotsDescription: 'جرّب تاريخا آخر أو أعد المحاولة لاحقا.',
  loadingSlotsLabel: 'جاري تحميل الأوقات المتاحة',
  errorTitle: 'تعذر تحميل الأوقات مؤقتا',
  errorDescription: 'أعد المحاولة. إذا استمرت المشكلة، تواصل معنا مباشرة.',
  retryLabel: 'إعادة المحاولة',
  confirmButtonLabel: 'تأكيد الموعد',
  selectedTimeLabel: 'الوقت المختار',
  successTitle: 'تم حجز المكالمة بنجاح',
  successDescription: 'تم حفظ الموعد وإرسال تفاصيل التقويم.',
  openMeetLabel: 'فتح Google Meet',
  backHomeLabel: 'العودة إلى الموقع',
  fallbackTitle: 'نحتاج بعض السياق الإضافي قبل الحجز',
  fallbackDescription: 'تم حفظ إجاباتك. الطلب لا يطابق حد الحجز الحالي، ويمكننا مراجعته يدويا.',
  fallbackCtaLabel: 'العودة إلى الموقع',
  fallbackCtaHref: '/',
};

export const getBookingFallbackCopy = (locale = 'en') => (locale === 'ar' ? AR_FALLBACK : EN_FALLBACK);

const compactCopy = (value) =>
  Object.entries(value || {}).reduce((accumulator, [key, item]) => {
    if (item !== null && item !== undefined && item !== '') {
      accumulator[key] = item;
    }
    return accumulator;
  }, {});

export const fetchBookingPageSetting = async (locale = 'en') => {
  const fallback = getBookingFallbackCopy(locale);
  const result = await fetchWithLocaleFallback(
    (nextLocale) => fetchSingleType('booking-page-setting', nextLocale),
    locale,
    { acceptEmpty: true }
  );

  return {
    ...fallback,
    ...compactCopy(result.data),
  };
};
