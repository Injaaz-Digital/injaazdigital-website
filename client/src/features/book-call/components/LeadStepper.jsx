'use client';

import { useEffect, useState } from 'react';
import Button from '@/shared/ui/Button';
import ProgressBar from './ProgressBar';
import StepRenderer from './StepRenderer';
import { CONTACT_STEP } from '../constants/bookCall.constants';
import { validateContact, validateQuestionAnswer } from '../utils/validation';

export default function LeadStepper({ questions, session, onQualified, onUnqualified }) {
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
  const currentQuestion = isContactStep ? CONTACT_STEP : questions[stepIndex];
  const currentAnswer = currentQuestion?.key ? draftAnswers[currentQuestion.key] : undefined;
  const stepTitles = [...questions.map((question) => question.title), CONTACT_STEP.title];

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
    <section className="rounded-[2rem] border border-[#d9e6f2] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,249,254,0.96)_100%)] p-6 shadow-[0_28px_80px_rgba(8,41,89,0.10)] md:p-8">
      <div className="space-y-6">
        <div className="space-y-4 rounded-[1.5rem] border border-[#e2ebf4] bg-white/80 p-4 md:p-5">
          <ProgressBar currentStep={stepIndex + 1} totalSteps={totalSteps} />
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {stepTitles.map((title, index) => {
              const state = index === stepIndex ? 'current' : index < stepIndex ? 'done' : 'upcoming';
              return (
                <div
                  key={`${title}-${index}`}
                  className={`rounded-2xl border px-3 py-3 text-sm transition ${
                    state === 'current'
                      ? 'border-[#0b5da8] bg-[#edf6ff] text-[#0a2546]'
                      : state === 'done'
                        ? 'border-[#dbe8f3] bg-[#f7fbff] text-[#47627e]'
                        : 'border-[#edf2f7] bg-white text-[#7a8ea8]'
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.16em]">Step {index + 1}</p>
                  <p className="mt-1 line-clamp-2 font-medium">{title}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 border-b border-[#e3ecf5] pb-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#5d7393]">
            Step {stepIndex + 1} of {totalSteps}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#0a2546]">{currentQuestion.title}</h2>
          <p className="max-w-2xl text-sm text-[#607693]">
            {currentQuestion.helpText || (isContactStep ? 'This stays private and is only used to confirm and prepare your booking.' : 'Answer as clearly as you can. You can update any step before finishing.')}
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
        />

        {!isContactStep && answerError ? <p className="text-sm font-medium text-red-600">{answerError}</p> : null}
        {session.error ? <p className="text-sm font-medium text-red-600">{session.error}</p> : null}

        <div className="flex flex-col gap-3 border-t border-[#e3ecf5] pt-4 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={stepIndex === 0 || session.isSaving}>
            Back
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={session.isSaving} className="min-w-[11rem]">
            {session.isSaving ? 'Saving...' : isContactStep ? 'Finish and check fit' : 'Save and continue'}
          </Button>
        </div>
      </div>
    </section>
  );
}
