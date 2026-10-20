export default function SignInForm({
  email,
  password,
  rememberMe,
  onChangeEmail,
  onChangePassword,
  onChangeRememberMe,
  onSubmit,
  loading,
  error,
}) {
  return (
    <main className="form-signin w-100 m-auto">
      <div className="login-card">
        <div className="login-brand" aria-label="Smart Access Control logo">
          <span className="login-brand__mark">S</span>
        </div>

        <div className="login-heading">
          <p className="login-eyebrow">Secure access</p>
          <h1>Welcome back</h1>
        </div>

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-check text-start login-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => onChangeRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>

          {error ? <div className="alert alert-danger login-alert">{error}</div> : null}

          <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="login-note">
            {loading ? "Validating credentials…" : "Use your administrator credentials to continue."}
          </p>
        </form>
      </div>
    </main>
  );
}
