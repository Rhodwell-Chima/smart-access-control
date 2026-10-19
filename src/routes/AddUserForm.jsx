import { Fragment, useState } from "react";
import { useNavigate } from "react-router";
import UserForm from "../components/UserForm";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { adminApi } from "../utils/api";

export default function AddUserForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formValues) => {
    setSubmitError("");
    setSubmitting(true);

    try {
      const roleIds = Array.isArray(formValues.role_ids)
        ? formValues.role_ids
        : formValues.role
          ? [Number(formValues.role)]
          : [];

      if (!roleIds.length) {
        throw new Error("Please select at least one role.");
      }

      const payload = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        email: formValues.email,
        card_uid: formValues.uid,
        role_ids: roleIds,
      };

      await adminApi.createUser(payload);
      navigate("/users", { replace: true });
    } catch (requestError) {
      setSubmitError(
        requestError?.response?.data?.error ?? requestError?.message ?? "Unable to create this user.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Fragment>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1 m-3">
          <section className="admin-shell">
            <div className="admin-shell__header">
              <div>
                <p className="admin-shell__eyebrow">User onboarding</p>
                <h1 className="admin-shell__title">Create user</h1>
                <p className="admin-shell__description mb-0">
                  Register a new user profile and assign the initial role access needed for the system.
                </p>
              </div>
              <button className="btn btn-outline-light" type="button" onClick={() => navigate("/users")}>
                Back to users
              </button>
            </div>

            {submitError ? <div className="alert alert-danger mx-auto">{submitError}</div> : null}
            <UserForm onSubmit={handleSubmit} onCancel={() => navigate("/users")} />
            {submitting ? <div className="text-center text-secondary small mt-3">Creating user…</div> : null}
          </section>
        </main>
        <Footer
          companyName="Smart Access Control"
          socialLinks={[
            {
              label: "Instagram",
              url: "https://instagram.com",
              icon: BsInstagram,
            },
            {
              label: "Facebook",
              url: "https://facebook.com",
              icon: BsFacebook,
            },
          ]}
        />
      </div>
    </Fragment>
  );
}
