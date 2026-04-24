import PropTypes from "prop-types";

export default function SelectInput({
  label,
  name,
  value,
  onChange,
  error,
  options = [],
  placeholder = "Select an option...",
  className = "col-md-6",
  renderExtra, // for Badge or anything below
}) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>

      <select
        id={name}
        name={name}
        className={`form-select ${error ? "is-invalid" : ""}`}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">Required</div>}

      {renderExtra && <div className="mt-1">{renderExtra()}</div>}
    </div>
  );
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  renderExtra: PropTypes.func,
};
