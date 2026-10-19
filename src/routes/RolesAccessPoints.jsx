import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import FormInput from "../components/FormInput";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { adminApi } from "../utils/api";

const EMPTY_ROLE_FORM = {
  name: "",
  description: "",
};

export default function RolesAccessPoints() {
  const [roles, setRoles] = useState([]);
  const [accessPoints, setAccessPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE_FORM);
  const [selectedAccessPointIds, setSelectedAccessPointIds] = useState([]);
  const [busyAction, setBusyAction] = useState("");

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  const filteredRoles = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return roles;

    return roles.filter((role) => {
      const name = (role.name ?? "").toLowerCase();
      const description = (role.description ?? "").toLowerCase();
      const id = String(role.id ?? "").toLowerCase();

      return name.includes(normalized) || description.includes(normalized) || id.includes(normalized);
    });
  }, [roles, searchTerm]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError("");
      setStatusMessage("");

      try {
        const [rolesResponse, accessPointsResponse] = await Promise.all([
          adminApi.getRoles({ pageSize: 100 }),
          adminApi.getAccessPoints(),
        ]);

        if (!active) return;

        setRoles(rolesResponse.roles);
        setAccessPoints(accessPointsResponse.accessPoints);
        if (rolesResponse.roles.length) {
          setSelectedRoleId(rolesResponse.roles[0].id);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.error ?? "Unable to load roles and access points.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRole) {
      setRoleForm(EMPTY_ROLE_FORM);
      setSelectedAccessPointIds([]);
      return;
    }

    setRoleForm({
      name: selectedRole.name ?? "",
      description: selectedRole.description ?? "",
    });
    setSelectedAccessPointIds((selectedRole.access_points ?? []).map((point) => point.id));
  }, [selectedRole]);

  const refreshData = async () => {
    const [rolesResponse, accessPointsResponse] = await Promise.all([
      adminApi.getRoles({ pageSize: 100 }),
      adminApi.getAccessPoints(),
    ]);

    setRoles(rolesResponse.roles);
    setAccessPoints(accessPointsResponse.accessPoints);

    if (!rolesResponse.roles.length) {
      setSelectedRoleId(null);
      return;
    }

    if (!rolesResponse.roles.some((role) => role.id === selectedRoleId)) {
      setSelectedRoleId(rolesResponse.roles[0].id);
    }
  };

  const handleRoleChange = (event) => {
    const { name, value } = event.target;
    setRoleForm((current) => ({ ...current, [name]: value }));
  };

  const handleAccessPointToggle = (accessPointId) => {
    setSelectedAccessPointIds((current) =>
      current.includes(accessPointId)
        ? current.filter((id) => id !== accessPointId)
        : [...current, accessPointId],
    );
  };

  const handleCreateRole = async (event) => {
    event.preventDefault();
    setBusyAction("create");
    setError("");
    setStatusMessage("");

    try {
      const createdRole = await adminApi.createRole({
        name: roleForm.name.trim(),
        description: roleForm.description.trim(),
      });

      if (selectedAccessPointIds.length) {
        await adminApi.attachRoleAccessPoints(createdRole.id, selectedAccessPointIds);
      }

      await refreshData();
      setSelectedRoleId(createdRole.id);
      setStatusMessage(`Created role ${createdRole.name}.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? "Unable to create this role.");
    } finally {
      setBusyAction("");
    }
  };

  const handleUpdateRole = async (event) => {
    event.preventDefault();
    if (!selectedRole) return;

    setBusyAction("update");
    setError("");
    setStatusMessage("");

    try {
      const currentAccessPointIds = new Set((selectedRole.access_points ?? []).map((point) => point.id));
      const nextAccessPointIds = new Set(selectedAccessPointIds);
      const attachIds = [...nextAccessPointIds].filter((id) => !currentAccessPointIds.has(id));
      const detachIds = [...currentAccessPointIds].filter((id) => !nextAccessPointIds.has(id));

      const updatedRole = await adminApi.updateRole(selectedRole.id, {
        name: roleForm.name.trim(),
        description: roleForm.description.trim(),
      });

      if (attachIds.length) {
        await adminApi.attachRoleAccessPoints(selectedRole.id, attachIds);
      }

      if (detachIds.length) {
        await adminApi.detachRoleAccessPoints(selectedRole.id, detachIds);
      }

      await refreshData();
      setSelectedRoleId(updatedRole.id);
      setStatusMessage(`Updated role ${updatedRole.name}.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? "Unable to update this role.");
    } finally {
      setBusyAction("");
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    const confirmed = window.confirm(`Delete role ${selectedRole.name}?`);
    if (!confirmed) return;

    setBusyAction("delete");
    setError("");
    setStatusMessage("");

    try {
      await adminApi.deleteRole(selectedRole.id);
      await refreshData();
      setStatusMessage(`Deleted role ${selectedRole.name}.`);
    } catch (requestError) {
      setError(requestError?.response?.data?.error ?? "Unable to delete this role.");
    } finally {
      setBusyAction("");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <main className="flex-grow-1 m-3">
        <section className="admin-shell">
          <div className="admin-shell__header">
            <div>
              <p className="admin-shell__eyebrow">Security structure</p>
              <h1 className="admin-shell__title">Roles & access points</h1>
              <p className="admin-shell__description mb-0">
                Create and manage roles, then attach or remove access points from each policy.
              </p>
            </div>
            <button className="btn btn-outline-light" type="button" onClick={refreshData}>
              Refresh
            </button>
          </div>

          <div className="admin-summary-strip">
            <div className="admin-summary-card">
              <span>Roles</span>
              <strong>{roles.length}</strong>
            </div>
            <div className="admin-summary-card">
              <span>Access points</span>
              <strong>{accessPoints.length}</strong>
            </div>
            <div className="admin-summary-card">
              <span>Selected role</span>
              <strong>{selectedRole ? `#${selectedRole.id}` : "None"}</strong>
            </div>
            <div className="admin-summary-card">
              <span>Linked points</span>
              <strong>{selectedRole?.access_points?.length ?? 0}</strong>
            </div>
          </div>

          {error ? <div className="alert alert-danger">{error}</div> : null}
          {statusMessage ? <div className="alert alert-success">{statusMessage}</div> : null}

          <div className="roles-access-grid">
            <section className="card-panel admin-card h-100">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                  <div>
                    <h5 className="card-title mb-1">Roles</h5>
                    <p className="text-secondary small mb-0">
                      {loading ? "Loading roles..." : `${filteredRoles.length} roles available`}
                    </p>
                  </div>
                  <div className="admin-search">
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search roles"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                </div>

                <div className="role-list">
                  {filteredRoles.length ? (
                    filteredRoles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        className={`role-card ${selectedRoleId === role.id ? "role-card--active" : ""}`}
                        onClick={() => setSelectedRoleId(role.id)}
                      >
                        <div className="d-flex justify-content-between gap-3 align-items-start">
                          <div>
                            <strong>{role.name}</strong>
                            <p>{role.description || "No description provided."}</p>
                          </div>
                          <span className="badge text-bg-dark">v{role.version ?? "-"}</span>
                        </div>
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          {(role.access_points ?? []).length ? (
                            role.access_points.map((point) => (
                              <span key={`${role.id}-${point.id ?? point.name}`} className="chip">
                                {point.name ?? point}
                              </span>
                            ))
                          ) : (
                            <span className="chip chip--muted">No access points assigned</span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-5 text-secondary">
                      {loading ? "Loading roles..." : "No roles match the current search."}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="card-panel admin-card h-100">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-2">
                  <div>
                    <h5 className="card-title mb-1">
                      {selectedRole ? `Edit ${selectedRole.name}` : "Create a role"}
                    </h5>
                    <p className="text-secondary small mb-0">
                      {selectedRole
                        ? "Update the role metadata and adjust its assigned access points."
                        : "Define a new role, then assign its initial access point coverage."}
                    </p>
                  </div>
                  {selectedRole ? (
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleDeleteRole}
                      disabled={busyAction === "delete"}
                    >
                      {busyAction === "delete" ? "Deleting…" : "Delete role"}
                    </button>
                  ) : null}
                </div>

                <form onSubmit={selectedRole ? handleUpdateRole : handleCreateRole}>
                  <div className="row g-3 mb-3">
                    <FormInput
                      label="Role name"
                      name="name"
                      value={roleForm.name}
                      onChange={handleRoleChange}
                      placeholder="e.g. Security staff"
                      className="col-12"
                      required={true}
                      disabled={loading}
                    />
                    <FormInput
                      label="Description"
                      name="description"
                      value={roleForm.description}
                      onChange={handleRoleChange}
                      placeholder="Short description of the policy"
                      className="col-12"
                      required={false}
                      disabled={loading}
                    />
                  </div>

                  <div className="role-assignments-panel">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-uppercase text-secondary small fw-semibold mb-0">
                        Access point coverage
                      </h6>
                      <span className="badge text-bg-dark">{selectedAccessPointIds.length} selected</span>
                    </div>

                    <div className="access-point-checkbox-grid">
                      {accessPoints.length ? (
                        accessPoints.map((point) => {
                          const isSelected = selectedAccessPointIds.includes(point.id);

                          return (
                            <label
                              key={point.id ?? point.device_id ?? point.name}
                              className={`access-point-choice ${isSelected ? "access-point-choice--active" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleAccessPointToggle(point.id)}
                                disabled={loading}
                              />
                              <span>
                                <strong>{point.name}</strong>
                                <small>{point.device_id}</small>
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <div className="text-secondary">No access points available.</div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-4">
                    <button className="btn btn-light" type="submit" disabled={loading || busyAction === "create" || busyAction === "update"}>
                      {selectedRole ? (busyAction === "update" ? "Saving…" : "Save changes") : (busyAction === "create" ? "Creating…" : "Create role")}
                    </button>
                    <button
                      className="btn btn-outline-light"
                      type="button"
                      onClick={() => {
                        setSelectedRoleId(null);
                        setRoleForm(EMPTY_ROLE_FORM);
                        setSelectedAccessPointIds([]);
                        setStatusMessage("");
                      }}
                      disabled={loading}
                    >
                      New role
                    </button>
                  </div>
                </form>

                <hr className="my-4" />

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                  <div>
                    <h5 className="card-title mb-1">Access-point catalog</h5>
                    <p className="text-secondary small mb-0">
                      The backend exposes access points for selection, but not a create endpoint yet.
                    </p>
                  </div>
                  <span className="badge text-bg-dark">{accessPoints.length} records</span>
                </div>

                <div className="access-point-grid">
                  {accessPoints.length ? (
                    accessPoints.map((point) => (
                      <div key={point.id ?? point.device_id ?? point.name} className="access-point-card">
                        <strong>{point.name}</strong>
                        <span>{point.location_note || point.device_id || "No location note"}</span>
                        <small>{point.last_heartbeat ? `Heartbeat ${point.last_heartbeat}` : "No heartbeat yet"}</small>
                      </div>
                    ))
                  ) : (
                    <div className="text-secondary">No access points available.</div>
                  )}
                </div>
              </div>
            </section>
          </div>
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
  );
}