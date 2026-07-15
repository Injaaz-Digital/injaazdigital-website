import PropTypes from 'prop-types';
import BookCallPage from '@/features/book-call/components/BookCallPage';

export default function BookCallBlock({ block, locale, route }) {
  if (!block?.pageTitle && !block?.meetingName) {
    return null;
  }

  return (
    <section>
      <BookCallPage
        locale={locale}
        initialQuestions={block.initialQuestions || []}
        bookingCopy={block}
        stepperKey={block.stepperKey}
        stepperVersion={block.stepperVersion}
        contactFields={block.contactFields}
        sourcePage={block.sourcePage || route || '/book-call'}
      />
    </section>
  );
}

BookCallBlock.propTypes = {
  block: PropTypes.shape({
    pageTitle: PropTypes.string,
    meetingName: PropTypes.string,
    sourcePage: PropTypes.string,
    initialQuestions: PropTypes.array,
    stepperKey: PropTypes.string,
    stepperVersion: PropTypes.number,
    contactFields: PropTypes.object,
  }).isRequired,
  locale: PropTypes.oneOf(['en', 'ar']).isRequired,
  route: PropTypes.string,
};
