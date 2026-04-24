import PropTypes from "prop-types";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  className = "col-md-6",
  required = true,
}) {
  const valid = required ? "is-invalid" : "";
  return (
    <div className={className}>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className={`form-control ${error ? valid : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {required ? <div className="invalid-feedback">Required</div> : ""}
    </div>
  );
}

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
};
