import { useState } from "react";
import SignInForm from "../components/auth/SignInForm";
import ThemeToggle from "../components/theme/ThemeToggle";
import { useNavigate } from "react-router";
import usePersistedTheme from "../utils/usePersistedTheme.js";
import "../signin.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [theme, setTheme] = usePersistedTheme("auto");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signing in as ${email}`);
    navigate("/home", { replace: true });
  };

  const handleThemeSelect = (value) => {
    setTheme(value);
    document.documentElement.setAttribute("data-bs-theme", value);
  };

  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary min-vh-100">
      <ThemeToggle theme={theme} onSelectTheme={handleThemeSelect} />

      <SignInForm
        email={email}
        password={password}
        rememberMe={rememberMe}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onChangeRememberMe={setRememberMe}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
