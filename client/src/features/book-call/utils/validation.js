const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^[\d\s+()\-]{7,25}$/;

export const isAnswerEmpty = (answer) => {
  if (Array.isArray(answer)) {
    return answer.length === 0;
  }

  return String(answer ?? '').trim() === '';
};

export const validateQuestionAnswer = (question, answer) => {
  if (!question?.required) {
    return '';
  }

  if (isAnswerEmpty(answer)) {
    return 'This step needs an answer before you continue.';
  }

  if (question.type === 'email' && !EMAIL_REGEX.test(String(answer || '').trim())) {
    return 'Please enter a valid email address.';
  }

  if (question.type === 'phone' && !PHONE_REGEX.test(String(answer || '').trim())) {
    return 'Please enter a valid phone number.';
  }

  return '';
};

export const validateContact = (contact) => {
  const errors = {};

  if (!String(contact.name || '').trim()) {
    errors.name = 'Your name is required.';
  }

  if (!String(contact.email || '').trim()) {
    errors.email = 'Your email is required.';
  } else if (!EMAIL_REGEX.test(String(contact.email || '').trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (contact.phone && !PHONE_REGEX.test(String(contact.phone).trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (contact.websiteUrl) {
    try {
      const candidate = /^https?:\/\//i.test(contact.websiteUrl) ? contact.websiteUrl : `https://${contact.websiteUrl}`;
      new URL(candidate);
    } catch {
      errors.websiteUrl = 'Please enter a valid website URL.';
    }
  }

  return errors;
};
