import PropTypes from 'prop-types';

function RadioGroup({ id, name, label, value, options, onChange, required = false, error }) {
  const describedById = error ? `${id || name}-error` : undefined;

  return (
    <fieldset className="space-y-3" aria-describedby={describedById}>
      <legend className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ms-1 text-red-600">*</span> : null}
      </legend>

      <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
        {options.map((option, index) => {
          const optionId = `${id || name}-${index}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-[#30a2c3]"
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                required={required && index === 0}
                className="h-4 w-4 border-slate-300 text-[#0d5b80] focus:ring-[#30a2c3]"
              />
              <span className="text-sm text-slate-700">{option.label}</span>
            </label>
          );
        })}
      </div>

      {error ? (
        <small id={describedById} className="block text-xs font-medium text-red-600">
          {error}
        </small>
      ) : null}
    </fieldset>
  );
}

RadioGroup.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default RadioGroup;
