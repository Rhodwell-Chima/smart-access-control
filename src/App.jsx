import { Link } from "react-router";
import { useEffect, useState } from "react";
import NavigationBar from "./components/NavigationBar";
import AccessLogTable from "./components/AccessLogTable";
import Footer from "./components/Footer";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { adminApi } from "./utils/api";
import "./App.css";

function App() {
  const [metrics, setMetrics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState({ ok: false, checking: true });

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const [health, metricsResponse, logsResponse] = await Promise.all([
          adminApi.checkBackendHealth(),
          adminApi.getMetricsSummary(),
          adminApi.searchLogs({ page: 1, page_size: 6 }),
        ]);

        if (!active) return;

        setBackendStatus({
          ok: health.ok,
          checking: false,
          message: health.ok ? "Backend connected" : health.error,
        });

        if (health.ok) {
          setMetrics(metricsResponse);
          setRecentLogs(logsResponse.logs ?? []);
          setError("");
        } else {
          setError("The backend is currently unavailable. Please check the API server.");
        }
      } catch (requestError) {
        if (active) {
          setBackendStatus({ ok: false, checking: false, message: "Connection unavailable" });
          setError(requestError?.response?.data?.error ?? "Unable to load dashboard data.");
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const totalUsers = metrics?.users?.total ?? 0;
  const activeUsers = metrics?.users?.active ?? 0;
  const totalCards = metrics?.cards?.total ?? 0;
  const activeCards = metrics?.cards?.active ?? 0;
  const totalRoles = metrics?.infrastructure?.roles ?? 0;
  const totalAccessPoints = metrics?.infrastructure?.access_points ?? 0;
  const todayScans = metrics?.today?.total_scans ?? 0;
  const denialRate = metrics?.today?.denial_rate_pct ?? 0;

  const summaryCards = [
    {
      label: "Users",
      value: totalUsers,
      meta: `${activeUsers} active`,
      tone: "primary",
    },
    {
      label: "Cards",
      value: totalCards,
      meta: `${activeCards} active`,
      tone: "success",
    },
    {
      label: "Roles",
      value: totalRoles,
      meta: "Policies configured",
      tone: "info",
    },
    {
      label: "Access points",
      value: totalAccessPoints,
      meta: "Live entry nodes",
      tone: "warning",
    },
  ];

  const overviewCards = [
    {
      label: "Today's scans",
      value: todayScans,
      helper: "Access events processed",
    },
    {
      label: "Denial rate",
      value: `${denialRate}%`,
      helper: "Unauthorized attempts",
    },
    {
      label: "Platform status",
      value: backendStatus.checking ? "Checking" : backendStatus.ok ? "Connected" : "Offline",
      helper: backendStatus.message ?? "Waiting for backend",
    },
  ];

  return (
    <>
      <NavigationBar />
      <main className="dashboard-shell">
        <section className="dashboard-hero card-panel">
          <div className="dashboard-hero__content">
            <p className="eyebrow">Smart access control</p>
            <h1>Operations dashboard</h1>
            <p className="dashboard-lead">
              Monitor security posture, access permissions, and building activity from one control
              panel.
            </p>

            <div className="status-row">
              <span className={`status-pill ${backendStatus.ok ? "status-pill--ok" : "status-pill--warn"}`}>
                {backendStatus.checking ? "Checking backend…" : backendStatus.ok ? "System online" : "Backend offline"}
              </span>
              {backendStatus.message ? <span className="status-note">{backendStatus.message}</span> : null}
            </div>

            {error ? <div className="alert alert-warning dashboard-alert">{error}</div> : null}

            <div className="hero-actions">
              <Link className="btn btn-light" to="/users/new">
                Add user
              </Link>
              <Link className="btn btn-outline-light" to="/logs">
                View logs
              </Link>
            </div>
          </div>

          <div className="summary-grid">
            {summaryCards.map((item) => (
              <article key={item.label} className={`summary-card summary-card--${item.tone}`}>
                <span className="summary-card__label">{item.label}</span>
                <strong className="summary-card__value">{item.value}</strong>
                <small className="summary-card__meta">{item.meta}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="overview-grid">
          {overviewCards.map((card) => (
            <article key={card.label} className="overview-card card-panel">
              <span className="overview-card__label">{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.helper}</small>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel-card panel-card--wide card-panel">
            <div className="panel-card__header">
              <div>
                <p className="panel-kicker">Recent activity</p>
                <h2>Latest access logs</h2>
              </div>
              <Link className="panel-link" to="/logs">
                Open log search
              </Link>
            </div>
            <AccessLogTable logs={recentLogs} />
          </article>

          <aside className="panel-card card-panel">
            <div className="panel-card__header panel-card__header--stacked">
              <div>
                <p className="panel-kicker">Admin tools</p>
                <h2>Core workflows</h2>
              </div>
            </div>
            <div className="shortcut-list">
              <Link className="shortcut-card" to="/users/new">
                <span>Create user</span>
                <p>Register a user and assign a card to a policy.</p>
              </Link>
              <Link className="shortcut-card" to="/users">
                <span>Manage users</span>
                <p>Update identity details and toggle user access.</p>
              </Link>
              <Link className="shortcut-card" to="/roles">
                <span>Roles & access points</span>
                <p>Review access coverage and permission mapping.</p>
              </Link>
            </div>
          </aside>
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
    </>
  );
}

export default App;
