'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/shared/ui/Button';
import ProgressBar from './ProgressBar';
import StepRenderer from './StepRenderer';
import { validateContact, validateQuestionAnswer } from '../utils/validation';

export default function LeadStepper({ questions, session, copy = {}, locale = 'en', flowSteps = [], flowVersion = 0, contactFields = null, onQualified, onUnqualified }) {
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
      key: 'contact_information',
      title: copy.contactStepTitle || 'Your contact details',
      helpText: copy.contactStepHelp || 'We use this to confirm your fit and send your meeting details.',
    }),
    [copy.contactStepHelp, copy.contactStepTitle]
  );
  const currentQuestion = isContactStep ? contactStep : questions[stepIndex];
  const currentAnswer = currentQuestion?.key ? draftAnswers[currentQuestion.key] : undefined;
  const currentFlowStep = !isContactStep && currentQuestion?.stepKey
    ? flowSteps.find((step) => step.key === currentQuestion.stepKey)
    : null;

  const handleContactChange = ({ target }) => {
    const { name, value } = target;
    setContact((previous) => ({ ...previous, [name]: value }));
    if (contactErrors[name]) {
      setContactErrors((previous) => ({ ...previous, [name]: '' }));
    }
  };

  const handleNext = async () => {
    if (!isContactStep) {
      const error = validateQuestionAnswer(currentQuestion, currentAnswer, copy);
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

    const nextErrors = validateContact(contact, copy, contactFields);
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
    <section className="flex min-h-[26rem] flex-col xl:min-h-0 xl:h-full">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1"><ProgressBar currentStep={stepIndex + 1} totalSteps={totalSteps} /></div>
          <span className="shrink-0 rounded-full border border-[#d8e3ef] bg-[#f8fbff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5d7393]" title={flowVersion ? `Question flow version ${flowVersion}` : undefined}>
            {locale.toUpperCase()}{flowVersion ? ` · v${flowVersion}` : ''}
          </span>
        </div>

        {!isContactStep && currentFlowStep ? (
          <div className="rounded-xl border border-[#dce6f1] bg-[#f8fbff] px-3.5 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0b5da8]">{currentFlowStep.title}</p>
            {currentFlowStep.description ? <p className="mt-1 text-xs leading-5 text-[#607693]">{currentFlowStep.description}</p> : null}
          </div>
        ) : null}

        {isContactStep ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5d7393]">{copy?.qualificationIntroTitle}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#0a2546] md:text-2xl">{currentQuestion.title}</h2>
          </div>
        ) : null}

        <div className={isContactStep ? 'xl:my-auto' : 'mx-auto w-full max-w-4xl xl:my-auto'}>
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
            copy={copy}
            locale={locale}
            contactFields={contactFields}
          />
        </div>

        {!isContactStep && answerError ? <p className="text-sm font-medium text-red-600">{answerError}</p> : null}
        {session.error ? <p className="text-sm font-medium text-red-600">{session.error}</p> : null}

        <div className="flex gap-3 border-t border-[#e3ecf5] pt-3 sm:justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={stepIndex === 0 || session.isSaving}>
            {copy.backLabel || 'Back'}
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={session.isSaving} className="min-w-0 flex-1 sm:min-w-[9rem] sm:flex-none">
            {session.isSaving ? (copy.savingLabel || 'Saving...') : isContactStep ? (copy.finishLabel || 'Check fit') : (copy.continueLabel || 'Continue')}
          </Button>
        </div>
      </div>
    </section>
  );
}
