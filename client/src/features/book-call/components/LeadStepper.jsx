'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/shared/ui/Button';
import ProgressBar from './ProgressBar';
import StepRenderer from './StepRenderer';
import { CONTACT_STEP } from '../constants/bookCall.constants';
import { validateContact, validateQuestionAnswer } from '../utils/validation';

const labels = {
  en: {
    contactTitle: 'Your contact details',
    contactHelp: 'This stays private and is only used to confirm and prepare your booking.',
    back: 'Back',
    continue: 'Continue',
    finish: 'Check fit',
    saving: 'Saving...',
    defaultHelp: 'Answer as clearly as you can. You can go back before finishing.',
  },
  ar: {
    contactTitle: 'بيانات التواصل',
    contactHelp: 'تبقى هذه المعلومات خاصة وتستخدم فقط لتأكيد الحجز والتحضير للمكالمة.',
    back: 'رجوع',
    continue: 'متابعة',
    finish: 'التحقق من الملاءمة',
    saving: 'جاري الحفظ...',
    defaultHelp: 'أجب بوضوح قدر الإمكان. يمكنك الرجوع قبل الإنهاء.',
  },
};

export default function LeadStepper({ questions, session, copy, locale = 'en', onQualified, onUnqualified }) {
  const ui = labels[locale] || labels.en;
  const totalSteps = questions.length + 1;
  const [stepIndex, setStepIndex] = useState(0);
  const [answerError, setAnswerError] = useState('');
  const [contactErrors, setContactErrors] = useState({});
  const [contact, setContact] = useState(session.contact || {});
  const [draftAnswers, setDraftAnswers] = useState(session.answers || {});

  useEffect(() => {
    setContact(session.contact || {});
  }, [session.contact]);

  useEffect(() => {
    setDraftAnswers(session.answers || {});
  }, [session.answers]);

  const isContactStep = stepIndex === questions.length;
  const contactStep = useMemo(
    () => ({
      ...CONTACT_STEP,
      title: ui.contactTitle,
      helpText: ui.contactHelp,
    }),
    [ui.contactHelp, ui.contactTitle]
  );
  const currentQuestion = isContactStep ? contactStep : questions[stepIndex];
  const currentAnswer = currentQuestion?.key ? draftAnswers[currentQuestion.key] : undefined;

  const handleContactChange = ({ target }) => {
    const { name, value } = target;
    setContact((previous) => ({ ...previous, [name]: value }));
    if (contactErrors[name]) {
      setContactErrors((previous) => ({ ...previous, [name]: '' }));
    }
  };

  const handleNext = async () => {
    if (!isContactStep) {
      const error = validateQuestionAnswer(currentQuestion, currentAnswer);
      if (error) {
        setAnswerError(error);
        return;
      }

      setAnswerError('');
      await session.saveAnswer({
        question: currentQuestion,
        answer: currentAnswer,
        currentStep: stepIndex + 1,
      });
      setStepIndex((previous) => Math.min(previous + 1, totalSteps - 1));
      return;
    }

    const nextErrors = validateContact(contact);
    if (Object.keys(nextErrors).length > 0) {
      setContactErrors(nextErrors);
      return;
    }

    setContactErrors({});
    await session.updateContact(contact);
    const result = await session.completeLead();

    if (result?.qualified) {
      onQualified(result);
      return;
    }

    onUnqualified(result);
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      return;
    }

    setAnswerError('');
    setStepIndex((previous) => Math.max(0, previous - 1));
  };

  return (
    <section className="min-h-[34rem]">
      <div className="space-y-7">
        <ProgressBar currentStep={stepIndex + 1} totalSteps={totalSteps} />

        <div className="space-y-3 border-b border-[#e3ecf5] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5d7393]">
            {copy?.qualificationIntroTitle}
          </p>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-[#0a2546] md:text-3xl">
            {currentQuestion.title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[#607693]">
            {currentQuestion.helpText || ui.defaultHelp}
          </p>
        </div>

        <StepRenderer
          mode={isContactStep ? 'contact' : 'question'}
          question={currentQuestion}
          value={currentAnswer}
          error={answerError}
          contact={contact}
          contactErrors={contactErrors}
          onAnswerChange={(value) => {
            setDraftAnswers((previous) => ({
              ...previous,
              [currentQuestion.key]: value,
            }));
            if (answerError) {
              setAnswerError('');
            }
          }}
          onContactChange={handleContactChange}
          locale={locale}
        />

        {!isContactStep && answerError ? <p className="text-sm font-medium text-red-600">{answerError}</p> : null}
        {session.error ? <p className="text-sm font-medium text-red-600">{session.error}</p> : null}

        <div className="flex flex-col gap-3 border-t border-[#e3ecf5] pt-4 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={stepIndex === 0 || session.isSaving}>
            {ui.back}
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={session.isSaving} className="min-w-[11rem]">
            {session.isSaving ? ui.saving : isContactStep ? ui.finish : ui.continue}
          </Button>
        </div>
      </div>
    </section>
  );
}
