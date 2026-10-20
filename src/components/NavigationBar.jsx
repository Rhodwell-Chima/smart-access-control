import { Link, useNavigate } from "react-router";
import { clearAuthSession, getAuthSession } from "../utils/auth";

export default function NavigationBar() {
  const navigate = useNavigate();
  const session = getAuthSession();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          Smart Access Control
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <div className="navbar-nav align-items-lg-center gap-lg-2">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
            <Link className="nav-link" to="/logs">
              Logs
            </Link>
            <Link className="nav-link" to="/users">
              Users
            </Link>
            <Link className="nav-link" to="/users/new">
              Add user
            </Link>
            <Link className="nav-link" to="/roles">
              Roles
            </Link>

            <div className="nav-item d-flex align-items-center gap-2 ms-lg-3 ps-lg-2 border-start border-secondary-subtle">
              <span className="text-secondary small fw-semibold d-none d-lg-inline">
                {session?.name ?? "Administrator"}
              </span>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
