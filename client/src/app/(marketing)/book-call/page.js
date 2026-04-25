import CmsSiteClient from '@/features/cms/renderer/CmsSiteClient';
import { normalizeLocale } from '@/lib/i18n/locale';
import { getInitialLang } from '@/lib/i18n/locale.server';
import { getSiteSetting } from '@/features/cms/lib/cms-page';
import { loadCustomRouteMetadata } from '@/features/cms/lib/cms-route';
import BookCallPage from '@/features/book-call/components/BookCallPage';
import { fetchBookingPageSetting } from '@/features/book-call/services/booking.service';
import { fetchLeadQuestions } from '@/features/book-call/services/lead.service';

export async function generateMetadata() {
  const initialLang = await getInitialLang();
  const isArabic = initialLang?.startsWith('ar');
  const locale = normalizeLocale(initialLang);
  const bookingCopy = await fetchBookingPageSetting(locale);

  return loadCustomRouteMetadata(initialLang, {
    pathname: '/book-call',
    title: `${bookingCopy.pageTitle} | ${isArabic ? 'إنجاز ديجيتال' : 'Injaaz Digital'}`,
    description: bookingCopy.pageSubtitle || bookingCopy.meetingDescription,
  });
}

export default async function Page() {
  const initialLang = await getInitialLang();
  const locale = normalizeLocale(initialLang);
  const [siteSetting, questions, bookingCopy] = await Promise.all([
    getSiteSetting(initialLang),
    fetchLeadQuestions(locale),
    fetchBookingPageSetting(locale),
  ]);
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
      <BookCallPage
        locale={locale}
        initialQuestions={questions}
        bookingCopy={bookingCopy}
        sourcePage="/book-call"
      />
    </CmsSiteClient>
  );
}
