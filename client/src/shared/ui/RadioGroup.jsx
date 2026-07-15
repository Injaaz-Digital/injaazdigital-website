import PropTypes from 'prop-types';

function RadioGroup({ id, name, label, value, options, onChange, required = false, error, emphasis = false }) {
  const describedById = error ? `${id || name}-error` : undefined;

  return (
      <fieldset className={emphasis ? 'mx-auto w-full max-w-3xl space-y-6' : 'space-y-3'} aria-describedby={describedById}>
      <legend className={emphasis ? 'w-full text-center text-xl font-semibold tracking-[-0.025em] text-[#0a2546] md:text-2xl' : 'text-sm font-semibold text-slate-700'}>
        {label}
        {required ? <span className="ms-1 text-red-600">*</span> : null}
      </legend>

      <div className={emphasis ? 'grid grid-cols-2 gap-2.5 max-sm:grid-cols-1' : 'grid grid-cols-2 gap-3 max-sm:grid-cols-1'}>
        {options.map((option, index) => {
          const optionId = `${id || name}-${index}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={emphasis
                ? `flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl corner-squircle border px-4 py-3.5 transition ${value === option.value ? 'border-[#0b5da8] bg-[#eef7ff] shadow-[0_12px_30px_rgba(11,93,168,0.12)]' : 'border-slate-200 bg-white hover:border-[#30a2c3] hover:bg-[#f8fbff]'}`
                : 'flex cursor-pointer items-center gap-3 rounded-xl corner-squircle border border-slate-200 bg-white px-3 py-2.5 transition hover:border-[#30a2c3]'}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                required={required && index === 0}
                className={emphasis ? 'h-5 w-5 shrink-0 border-slate-300 text-[#0d5b80] focus:ring-[#30a2c3]' : 'h-4 w-4 border-slate-300 text-[#0d5b80] focus:ring-[#30a2c3]'}
              />
              <span className={emphasis ? 'text-base font-medium text-[#17314d]' : 'text-sm text-slate-700'}>{option.label}</span>
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
  emphasis: PropTypes.bool,
};

export default RadioGroup;
