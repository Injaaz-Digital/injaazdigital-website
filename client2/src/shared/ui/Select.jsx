import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from '@/lib/utils/cx';

const Select = forwardRef(function Select(
  {
    id,
    name,
    label,
    error,
    hint,
    required = false,
    className,
    wrapperClassName,
    children,
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

      <select
        ref={ref}
        id={fieldId}
        name={name}
        className={cx(
          'block w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-[#30a2c3] focus:ring-[#d9f2f8]',
          className
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      >
        {children}
      </select>

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

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Select;
