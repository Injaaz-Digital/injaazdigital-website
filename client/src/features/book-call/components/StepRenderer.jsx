'use client';

import Input from '@/shared/ui/Input';
import QuestionInput from './QuestionInput';

const contactLabels = {
  en: {
    name: 'Full name',
    email: 'Email',
    phone: 'Phone',
    companyName: 'Company name',
    websiteUrl: 'Website',
  },
  ar: {
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    companyName: 'اسم الشركة',
    websiteUrl: 'الموقع الإلكتروني',
  },
};

export default function StepRenderer({ mode, question, value, error, contact, contactErrors, onAnswerChange, onContactChange, locale = 'en' }) {
  const labels = contactLabels[locale] || contactLabels.en;

  if (mode === 'contact') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="contact-name"
          name="name"
          label={labels.name}
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
          label={labels.email}
          value={contact.email || ''}
          onChange={onContactChange}
          required
          error={contactErrors.email}
        />
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          label={labels.phone}
          value={contact.phone || ''}
          onChange={onContactChange}
          error={contactErrors.phone}
        />
        <Input
          id="contact-company"
          name="companyName"
          label={labels.companyName}
          value={contact.companyName || ''}
          onChange={onContactChange}
        />
        <Input
          id="contact-website"
          name="websiteUrl"
          type="url"
          label={labels.websiteUrl}
          value={contact.websiteUrl || ''}
          onChange={onContactChange}
          error={contactErrors.websiteUrl}
          wrapperClassName="md:col-span-2"
        />
      </div>
    );
  }

  return <QuestionInput question={question} value={value} error={error} onChange={onAnswerChange} locale={locale} />;
}
