import { useState } from "./react";
import SignInForm from "./SignInForm";
import ThemeToggle from "./ThemeToggle";

export default function SignIn() {
  const [theme, setTheme] = useState("auto");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Signing in as ${email}`);
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
