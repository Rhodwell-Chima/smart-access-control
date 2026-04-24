export default function SignInForm({
  email,
  password,
  rememberMe,
  onChangeEmail,
  onChangePassword,
  onChangeRememberMe,
  onSubmit,
}) {
  return (
    <main className="form-signin w-100 m-auto">
      <form onSubmit={onSubmit}>
        <img
          className="mb-4"
          src="/docs/5.3/assets/brand/bootstrap-logo.svg"
          alt="Smart Access Control"
          width="72"
          height="57"
        />

        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

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

        <div className="form-check text-start my-3">
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

        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>

        <p className="mt-5 mb-3 text-body-secondary">© 2026</p>
      </form>
    </main>
  );
}
