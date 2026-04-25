'use client';

import Input from '@/shared/ui/Input';
import RadioGroup from '@/shared/ui/RadioGroup';
import Select from '@/shared/ui/Select';
import Textarea from '@/shared/ui/Textarea';

function CheckboxGroup({ question, value, onChange }) {
  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-700">{question.title}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {question.options.map((option) => {
          const checked = selectedValues.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#d6e1ee] bg-white px-4 py-3 text-sm text-[#15314f] transition hover:border-[#30a2c3]"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  if (checked) {
                    onChange(selectedValues.filter((item) => item !== option.value));
                    return;
                  }

                  onChange([...selectedValues, option.value]);
                }}
                className="h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const labels = {
  en: { choose: 'Choose one' },
  ar: { choose: 'اختر إجابة' },
};

export default function QuestionInput({ question, value, error, onChange, locale = 'en' }) {
  const ui = labels[locale] || labels.en;

  if (question.type === 'select') {
    return (
      <Select
        id={question.key}
        name={question.key}
        label={question.title}
        value={typeof value === 'string' ? value : ''}
        required={question.required}
        error={error}
        hint={question.helpText || undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{ui.choose}</option>
        {question.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (question.type === 'radio') {
    return (
      <div className="space-y-2">
        <RadioGroup
          id={question.key}
          name={question.key}
          label={question.title}
          value={typeof value === 'string' ? value : ''}
          options={question.options}
          required={question.required}
          error={error}
          onChange={(event) => onChange(event.target.value)}
        />
        {question.helpText ? <p className="text-sm text-[#627791]">{question.helpText}</p> : null}
      </div>
    );
  }

  if (question.type === 'checkbox') {
    return (
      <div className="space-y-2">
        <CheckboxGroup question={question} value={value} onChange={onChange} />
        {question.helpText ? <p className="text-sm text-[#627791]">{question.helpText}</p> : null}
        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <Textarea
        id={question.key}
        name={question.key}
        label={question.title}
        value={typeof value === 'string' ? value : ''}
        rows={5}
        required={question.required}
        error={error}
        hint={question.helpText || undefined}
        placeholder={question.placeholder || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <Input
      id={question.key}
      name={question.key}
      type={question.type === 'phone' ? 'tel' : question.type}
      label={question.title}
      value={typeof value === 'string' || typeof value === 'number' ? value : ''}
      required={question.required}
      error={error}
      hint={question.helpText || undefined}
      placeholder={question.placeholder || undefined}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
