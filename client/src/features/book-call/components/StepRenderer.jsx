'use client';

import Input from '@/shared/ui/Input';
import QuestionInput from './QuestionInput';

export default function StepRenderer({ mode, question, value, error, contact, contactErrors, onAnswerChange, onContactChange }) {
  if (mode === 'contact') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="contact-name"
          name="name"
          label="Full name"
          value={contact.name || ''}
          onChange={onContactChange}
          required
          error={contactErrors.name}
          wrapperClassName="md:col-span-2"
        />
        <Input
          id="contact-email"
          name="email"
          type="email"
          label="Email"
          value={contact.email || ''}
          onChange={onContactChange}
          required
          error={contactErrors.email}
        />
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          label="Phone"
          value={contact.phone || ''}
          onChange={onContactChange}
          error={contactErrors.phone}
        />
        <Input
          id="contact-company"
          name="companyName"
          label="Company name"
          value={contact.companyName || ''}
          onChange={onContactChange}
        />
        <Input
          id="contact-website"
          name="websiteUrl"
          type="url"
          label="Website"
          value={contact.websiteUrl || ''}
          onChange={onContactChange}
          error={contactErrors.websiteUrl}
          wrapperClassName="md:col-span-2"
        />
      </div>
    );
  }

  return <QuestionInput question={question} value={value} error={error} onChange={onAnswerChange} />;
}
