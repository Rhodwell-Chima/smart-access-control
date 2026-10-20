import { useEffect, useState } from "react";
import SignInForm from "../components/auth/SignInForm";
import ThemeToggle from "../components/theme/ThemeToggle";
import { useNavigate } from "react-router";
import usePersistedTheme from "../utils/usePersistedTheme.js";
import { adminApi } from "../utils/api";
import { getAuthSession, persistAuthSession } from "../utils/auth";
import "../signin.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [theme, setTheme] = usePersistedTheme("auto");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedSession = getAuthSession();
    if (storedSession?.authenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await adminApi.login({ email, password });
      persistAuthSession(result.user ?? { email }, rememberMe);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError?.message ?? "Unable to sign in at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (value) => {
    setTheme(value);
    document.documentElement.setAttribute("data-bs-theme", value);
  };

  return (
    <div className="login-page">
      <ThemeToggle theme={theme} onSelectTheme={handleThemeSelect} />

      <SignInForm
        email={email}
        password={password}
        rememberMe={rememberMe}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onChangeRememberMe={setRememberMe}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
