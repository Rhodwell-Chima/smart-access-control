import { useEffect, useMemo, useState } from "react";
import FormInput from "./FormInput";
import { adminApi } from "../utils/api";

const EMPTY_EDIT_FORM = {
  first_name: "",
  last_name: "",
  email: "",
};

export default function UserAdminConsole({ title, description }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [statusMessage, setStatusMessage] = useState("");
  const [busyAction, setBusyAction] = useState("");

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const visibleUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return users;

    return users.filter((user) => {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.toLowerCase();
      const email = (user.email ?? "").toLowerCase();
      const id = String(user.id ?? "").toLowerCase();

      return fullName.includes(normalized) || email.includes(normalized) || id.includes(normalized);
    });
  }, [searchTerm, users]);

  const activeUserCount = users.filter((user) => user.is_active).length;
  const inactiveUserCount = users.length - activeUserCount;

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await adminApi.getUsers({ pageSize: 100 });
        if (!active) return;

        setUsers(response.users);
        if (response.users.length && !selectedUserId) {
          setSelectedUserId(response.users[0].id);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.error ?? "Could not load users from the API.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setEditForm(EMPTY_EDIT_FORM);
      return;
    }

    setEditForm({
      first_name: selectedUser.first_name ?? "",
      last_name: selectedUser.last_name ?? "",
      email: selectedUser.email ?? "",
    });
  }, [selectedUser]);

  const refreshUsers = async () => {
    const response = await adminApi.getUsers({ pageSize: 100 });
    setUsers(response.users);

    if (response.users.length === 0) {
      setSelectedUserId(null);
      return;
    }

    if (!response.users.some((user) => user.id === selectedUserId)) {
      setSelectedUserId(response.users[0].id);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
    setStatusMessage("");
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    setBusyAction("save");
    setStatusMessage("");

    try {
      const updated = await adminApi.updateUser(selectedUser.id, editForm);
      setUsers((current) =>
        current.map((user) => (user.id === selectedUser.id ? updated : user)),
      );
      setStatusMessage(`Updated ${updated.first_name} ${updated.last_name}.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? "Unable to update this user.");
    } finally {
      setBusyAction("");
    }
  };

  const handleToggleActive = async (user) => {
    setBusyAction(`toggle-${user.id}`);
    setStatusMessage("");

    try {
      if (user.is_active) {
        await adminApi.deactivateUser(user.id);
      } else {
        await adminApi.reactivateUser(user.id);
      }

      await refreshUsers();
      setStatusMessage(`${user.first_name} ${user.last_name} status updated.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? "Unable to update user status.");
    } finally {
      setBusyAction("");
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.first_name} ${user.last_name}?`);
    if (!confirmed) return;

    setBusyAction(`delete-${user.id}`);
    setStatusMessage("");

    try {
      await adminApi.deleteUser(user.id);
      await refreshUsers();
      setStatusMessage(`${user.first_name} ${user.last_name} deleted.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? "Unable to delete this user.");
    } finally {
      setBusyAction("");
    }
  };

  return (
    <section className="admin-shell">
      <div className="admin-shell__header">
        <div>
          <p className="admin-shell__eyebrow">Administrative users</p>
          <h2 className="admin-shell__title">{title}</h2>
          {description ? <p className="admin-shell__description">{description}</p> : null}
        </div>
        <button className="btn btn-outline-light" onClick={refreshUsers} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="admin-summary-strip">
        <div className="admin-summary-card">
          <span>Total users</span>
          <strong>{users.length}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Active</span>
          <strong>{activeUserCount}</strong>
        </div>
        <div className="admin-summary-card">
          <span>Inactive</span>
          <strong>{inactiveUserCount}</strong>
        </div>
      </div>

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {statusMessage ? <div className="alert alert-success">{statusMessage}</div> : null}

      <div className="admin-panel-grid">
        <div className="admin-panel-column">
          <div className="card-panel admin-card h-100">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <div>
                  <h5 className="card-title mb-1">Users</h5>
                  <p className="text-secondary small mb-0">
                    {visibleUsers.length} of {users.length} records visible.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 admin-search">
                  <label className="text-secondary small mb-0" htmlFor="user-search">
                    Search
                  </label>
                  <input
                    id="user-search"
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Name, email, or ID"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-secondary">
                          Loading users...
                        </td>
                      </tr>
                    ) : visibleUsers.length ? (
                      visibleUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={selectedUserId === user.id ? "table-active" : ""}
                          onClick={() => handleSelectUser(user)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <div className="fw-semibold">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-secondary small">ID {user.id}</div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.is_active ? "text-bg-success" : "text-bg-secondary"}`}>
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleSelectUser(user);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleToggleActive(user);
                                }}
                                disabled={busyAction === `toggle-${user.id}`}
                              >
                                {user.is_active ? "Deactivate" : "Reactivate"}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(user);
                                }}
                                disabled={busyAction === `delete-${user.id}`}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-secondary">
                          No users match the current search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-panel-column">
          <div className="card-panel admin-card h-100">
            <div className="card-body">
              <h5 className="card-title mb-1">Edit user</h5>
              <p className="text-secondary small mb-4">
                {selectedUser
                  ? `Editing ${selectedUser.first_name} ${selectedUser.last_name}`
                  : "Choose a user from the list to edit them."}
              </p>

              <div className="row g-3">
                <FormInput
                  label="First name"
                  name="first_name"
                  value={editForm.first_name}
                  onChange={handleChange}
                  className="col-12"
                  required={false}
                />
                <FormInput
                  label="Last name"
                  name="last_name"
                  value={editForm.last_name}
                  onChange={handleChange}
                  className="col-12"
                  required={false}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="col-12"
                  required={false}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setEditForm(EMPTY_EDIT_FORM)}
                  disabled={!selectedUser}
                >
                  Clear
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleSave}
                  disabled={!selectedUser || busyAction === "save"}
                >
                  {busyAction === "save" ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}