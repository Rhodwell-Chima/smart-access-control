import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import SelectInput from "./SelectInput";
import { adminApi } from "../utils/api";

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  uid: "",
  role: "",
};

export default function UserForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    let active = true;

    const loadRoles = async () => {
      try {
        const response = await adminApi.getRoles({ pageSize: 100 });
        if (!active) return;
        setRoleOptions(Array.isArray(response.roles) ? response.roles : []);
      } catch {
        if (active) setRoleOptions([]);
      }
    };

    loadRoles();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm((previous) => ({ ...previous, [id]: value }));
    if (errors[id]) {
      setErrors((previous) => ({ ...previous, [id]: false }));
    }
  };

  const validate = () => {
    const required = ["firstName", "lastName", "email", "uid", "role"];
    const nextErrors = {};

    required.forEach((key) => {
      if (!form[key]) {
        nextErrors[key] = true;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      uid: form.uid,
      role: form.role,
      role_ids: form.role ? [Number(form.role)] : [],
    };

    if (onSubmit) {
      onSubmit(payload);
      return;
    }

    alert("Form submitted:\n" + JSON.stringify(payload, null, 2));
  };

  const handleCancel = () => {
    setForm(INITIAL_STATE);
    setErrors({});
    onCancel?.();
  };

  return (
    <div className="container py-4">
      <div className="card-panel admin-card user-form-card">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h5 className="card-title mb-1">User details</h5>
              <p className="text-secondary small mb-0">
                Fill in the fields below to register a new user.
              </p>
            </div>
            <span className="chip chip--muted">New account</span>
          </div>

          <p className="text-uppercase text-secondary small fw-semibold mb-3">
            Personal info
          </p>

          <div className="row g-3 mb-3">
            <FormInput
              label="First name"
              name="firstName"
              type="text"
              placeholder="e.g. Jane"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              className="col-md-6"
              required={true}
            />
            <FormInput
              label="Last name"
              name="lastName"
              type="text"
              placeholder="e.g. Smith"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              className="col-md-6"
              required={true}
            />
          </div>

          <div className="mb-3">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="jane.smith@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              className="col-12"
              required={true}
            />
          </div>

          <div className="mb-3">
            <FormInput
              label="Card UID"
              name="uid"
              type="text"
              placeholder="Enter the card UID"
              value={form.uid}
              onChange={handleChange}
              error={errors.uid}
              className="col-12"
              required={true}
            />
          </div>

          <hr className="my-4" />

          <p className="text-uppercase text-secondary small fw-semibold mb-3">
            Access &amp; permissions
          </p>

          <div className="row g-3">
            <SelectInput
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              error={errors.role}
              placeholder="Select a role…"
              options={
                roleOptions.length
                  ? roleOptions.map((role) => ({
                      value: String(role.id),
                      label: role.name,
                    }))
                  : [{ value: "", label: "No roles available" }]
              }
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleSubmit}
            >
              Save user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
