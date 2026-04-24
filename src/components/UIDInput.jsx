import PropTypes from "prop-types";

export default function UIDInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  className = "col-12",
  readOnly = false,
  onButtonClick,
  buttonLabel,
  buttonIcon,
  buttonClass,
  alertClass,
  alertMsg,
}) {
  return (
    <div className={className}>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>

      <div className="input-group">
        <input
          type="text"
          id={name}
          name={name}
          className={`form-control font-monospace ${error ? "is-invalid" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />

        <button type="button" className={buttonClass} onClick={onButtonClick}>
          <span className="me-1">{buttonIcon}</span>
          {buttonLabel}
        </button>

        {error && <div className="invalid-feedback">Required</div>}
      </div>

      {alertClass && (
        <div className={`${alertClass} mt-2`} role="alert">
          {alertMsg}
        </div>
      )}
    </div>
  );
}

UIDInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  onButtonClick: PropTypes.func,
  buttonLabel: PropTypes.string,
  buttonIcon: PropTypes.node,
  buttonClass: PropTypes.string,
  alertClass: PropTypes.string,
  alertMsg: PropTypes.string,
};
