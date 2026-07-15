'use client';

import Input from '@/shared/ui/Input';
import QuestionInput from './QuestionInput';

export default function StepRenderer({ mode, question, value, error, contact, contactErrors, onAnswerChange, onContactChange, copy = {}, locale = 'en', contactFields = null }) {
  if (mode === 'contact') {
    const field = (key, fallbackVisible = true) => ({ visible: fallbackVisible, required: false, ...(contactFields?.[key] || {}) });
    return (
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          id="contact-name"
          name="name"
          label={copy.contactNameLabel || 'Full name'}
          value={contact.name || ''}
          onChange={onContactChange}
          required
          error={contactErrors.name}
        />
        <Input
          id="contact-email"
          name="email"
          type="email"
          label={copy.contactEmailLabel || 'Email'}
          value={contact.email || ''}
          onChange={onContactChange}
          required
          error={contactErrors.email}
        />
        {field('phone').visible ? <Input
          id="contact-phone"
          name="phone"
          type="tel"
          label={copy.contactPhoneLabel || 'Phone'}
          value={contact.phone || ''}
          onChange={onContactChange}
          required={field('phone').required}
          error={contactErrors.phone}
        /> : null}
        {field('companyName').visible ? <Input
          id="contact-company"
          name="companyName"
          label={copy.contactCompanyLabel || 'Company name'}
          value={contact.companyName || ''}
          required={field('companyName').required}
          onChange={onContactChange}
          error={contactErrors.companyName}
        /> : null}
        {field('websiteUrl').visible ? <Input
          id="contact-website"
          name="websiteUrl"
          type="url"
          label={copy.contactWebsiteLabel || 'Website'}
          value={contact.websiteUrl || ''}
          onChange={onContactChange}
          required={field('websiteUrl').required}
          error={contactErrors.websiteUrl}
        /> : null}
      </div>
    );
  }

  return <QuestionInput question={question} value={value} error={error} onChange={onAnswerChange} copy={copy} locale={locale} />;
}
