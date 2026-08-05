import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn as cx } from '@/lib/utils';

const Textarea = forwardRef(function Textarea(
  {
    id,
    name,
    label,
    error,
    hint,
    rows = 4,
    required = false,
    className,
    wrapperClassName,
    ...rest
  },
  ref
) {
  const fieldId = id || name;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <label htmlFor={fieldId} className={cx('block space-y-2', wrapperClassName)}>
      {label ? (
        <span className="block text-sm font-semibold text-slate-700">
          {label}
          {required ? <span className="ms-1 text-red-600">*</span> : null}
        </span>
      ) : null}

      <textarea
        ref={ref}
        id={fieldId}
        name={name}
        rows={rows}
        className={cx(
          'block w-full rounded-xl corner-squircle border bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-[#30a2c3] focus:ring-[#d9f2f8]',
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />

      {hint && !error ? (
        <small id={`${fieldId}-hint`} className="block text-xs text-slate-500">
          {hint}
        </small>
      ) : null}

      {error ? (
        <small id={`${fieldId}-error`} className="block text-xs font-medium text-red-600">
          {error}
        </small>
      ) : null}
    </label>
  );
});

Textarea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  error: PropTypes.string,
  hint: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default Textarea;
