import CmsSiteClient from '@/features/cms/renderer/CmsSiteClient';
import { normalizeLocale } from '@/lib/i18n/locale';
import { getInitialLang } from '@/lib/i18n/locale.server';
import { getSiteSetting } from '@/features/cms/lib/cms-page';
import { loadCustomRouteMetadata } from '@/features/cms/lib/cms-route';
import BookCallPage from '@/features/book-call/components/BookCallPage';
import { fetchLeadQuestions } from '@/lib/strapi/queries';

export async function generateMetadata() {
  const initialLang = await getInitialLang();
  const isArabic = initialLang?.startsWith('ar');

  return loadCustomRouteMetadata(initialLang, {
    pathname: '/book-call',
    title: isArabic ? 'احجز مكالمة استراتيجية | إنجاز ديجيتال' : 'Book a Strategy Call | Injaaz Digital',
    description: isArabic
      ? 'احجز مكالمة قصيرة لمراجعة العرض، تحديد أهم فجوة تحويل، والخروج بخطوات عملية واضحة.'
      : 'Book a focused strategy call to review your offer, identify the biggest conversion gap, and leave with clear next steps.',
  });
}

export default async function Page() {
  const initialLang = await getInitialLang();
  const locale = normalizeLocale(initialLang);
  const [siteSetting, questions] = await Promise.all([getSiteSetting(initialLang), fetchLeadQuestions()]);
  const header = siteSetting.data?.header || null;

  return (
    <CmsSiteClient
      route="/book-call"
      initialLang={initialLang}
      cmsData={{ header }}
      cmsFallback={false}
      mainClassName="pt-[calc(var(--header-height)+2.25rem)] pb-8 md:pt-[calc(var(--header-height)+3rem)] md:pb-14"
      showFooter={false}
      showBlur={false}
    >
      <BookCallPage locale={locale} initialQuestions={questions} sourcePage="/book-call" />
    </CmsSiteClient>
  );
}
