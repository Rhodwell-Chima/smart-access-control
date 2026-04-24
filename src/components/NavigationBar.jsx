import { Link } from "react-router";

export default function NavigationBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
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
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav">
            <Link className="nav-link" aria-current="page" to="/logs">
              View
            </Link>

            <Link className="nav-link" aria-current="page" to="/add">
              Add
            </Link>
            <Link className="nav-link" to="/update">
              Update
            </Link>
            <Link className="nav-link" to="/delete">
              Delete
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
