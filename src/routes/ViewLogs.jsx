import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import AccessLogTable from "../components/AccessLogTable";
import Footer from "../components/Footer";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import Pagination from "../components/Pagination";
import { adminApi } from "../utils/api";

export default function ViewLogs() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [accessPointFilter, setAccessPointFilter] = useState("all");
  const [accessPoints, setAccessPoints] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let active = true;

    const loadAccessPoints = async () => {
      try {
        const response = await adminApi.getAccessPoints();
        if (!active) return;
        setAccessPoints(response.accessPoints ?? []);
      } catch {
        if (active) setAccessPoints([]);
      }
    };

    loadAccessPoints();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchLogs = async () => {
      setLoading(true);
      setError("");

      const params = {
        page,
        page_size: pageSize,
        ...(searchTerm.trim() ? { card_uid: searchTerm.trim() } : {}),
        ...(accessPointFilter !== "all" ? { access_point_id: Number(accessPointFilter) } : {}),
        ...(startDate ? { date_from: startDate } : {}),
        ...(endDate ? { date_to: endDate } : {}),
      };

      try {
        const response = await adminApi.searchLogs(params);
        if (!active) return;

        const safePageCount = Math.max(1, Number(response.pages ?? 1) || 1);
        setLogs(response.logs ?? []);
        setTotalPages(safePageCount);
        setPage((currentPage) => Math.min(currentPage, safePageCount));
      } catch (requestError) {
        if (active) {
          setError(requestError?.response?.data?.error ?? "Unable to load access logs.");
          setLogs([]);
          setTotalPages(1);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLogs();

    return () => {
      active = false;
    };
  }, [page, pageSize, searchTerm, accessPointFilter, startDate, endDate]);

  const clearFilters = () => {
    setSearchTerm("");
    setAccessPointFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />
      <main className="flex-grow-1 m-3">
        <section className="admin-shell">
          <div className="admin-shell__header">
            <div>
              <p className="admin-shell__eyebrow">Security audit</p>
              <h1 className="admin-shell__title">View logs</h1>
              <p className="admin-shell__description mb-0">
                Review recent access events and paginate through the system audit trail.
              </p>
            </div>
            <div className="chip chip--muted">Page {page}</div>
          </div>

          <div className="admin-summary-strip">
            <div className="admin-summary-card">
              <span>Loaded</span>
              <strong>{logs.length}</strong>
            </div>
            <div className="admin-summary-card">
              <span>Page size</span>
              <strong>{pageSize}</strong>
            </div>
            <div className="admin-summary-card">
              <span>Current page</span>
              <strong>{page}</strong>
            </div>
            <div className="admin-summary-card">
              <span>Total pages</span>
              <strong>{totalPages}</strong>
            </div>
          </div>

          {error ? <div className="alert alert-danger mx-auto">{error}</div> : null}
          {loading ? <div className="text-center text-secondary mb-3">Loading logs…</div> : null}

          <div className="card-panel admin-card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
                  <label className="text-secondary small mb-0" htmlFor="logs-search">Card UID</label>
                  <input
                    id="logs-search"
                    type="search"
                    className="form-control form-control-sm logs-search"
                    placeholder="Search by card UID"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <label className="text-secondary small mb-0" htmlFor="access-point-filter">Access point</label>
                    <select
                      id="access-point-filter"
                      className="form-select form-select-sm logs-filter"
                      value={accessPointFilter}
                      onChange={(event) => setAccessPointFilter(event.target.value)}
                    >
                      <option value="all">All access points</option>
                      {accessPoints.map((point) => (
                        <option key={point.id} value={String(point.id)}>
                          {point.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="text-secondary small mb-0" htmlFor="start-date">From</label>
                    <input
                      id="start-date"
                      type="date"
                      className="form-control form-control-sm logs-date-input"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label className="text-secondary small mb-0" htmlFor="end-date">To</label>
                    <input
                      id="end-date"
                      type="date"
                      className="form-control form-control-sm logs-date-input"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </div>

                  <button type="button" className="btn btn-outline-light btn-sm" onClick={clearFilters}>
                    Clear
                  </button>
                </div>
              </div>

              <AccessLogTable logs={logs} />

              {!loading && logs.length === 0 ? (
                <div className="text-center text-secondary py-4">No logs match the current filters.</div>
              ) : null}

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </div>
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
