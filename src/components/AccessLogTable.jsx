const readableStatus = (status) => {
  if (!status && status !== 0) return "—";

  const normalized = String(status).trim().toUpperCase();
  const mapping = {
    AUTHORIZED: "Authorized",
    AUTHORISED: "Authorized",
    UNAUTHORIZED: "Unauthorized",
    DENIED: "Denied",
    BLACKLISTED: "Blacklisted",
    GRANTED: "Granted",
    REJECTED: "Rejected",
    SUCCESS: "Success",
    FAILURE: "Failure",
    FAILED: "Failed",
    ALLOWED: "Allowed",
    DISALLOWED: "Disallowed",
  };

  return mapping[normalized] ?? normalized.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const statusBadgeClass = (status) => {
  if (!status && status !== 0) return "status-badge status-badge--neutral";

  const normalized = String(status).trim().toUpperCase();

  if (["SUCCESS", "AUTHORIZED", "AUTHORISED", "GRANTED", "ALLOWED"].includes(normalized)) {
    return "status-badge status-badge--success";
  }

  if (["DENIED", "UNAUTHORIZED", "REJECTED", "FAILED", "FAILURE", "DISALLOWED", "BLACKLISTED"].includes(normalized)) {
    return "status-badge status-badge--danger";
  }

  if (["WARNING", "PENDING", "PROCESSING"].includes(normalized)) {
    return "status-badge status-badge--warning";
  }

  return "status-badge status-badge--neutral";
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
};

const getNestedValue = (source, keys) => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
};

export default function AccessLogTable({ logs = [] }) {
  return (
    <table className="table table-striped table-hover align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">DateTime</th>
          <th scope="col">Name</th>
          <th scope="col">Card ID</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => {
          const userName = [
            getNestedValue(log, ["first_name", "firstName"]),
            getNestedValue(log, ["last_name", "lastName"]),
            getNestedValue(log?.user, ["first_name", "firstName"]),
            getNestedValue(log?.user, ["last_name", "lastName"]),
            getNestedValue(log, ["name", "user_name", "full_name"]),
            getNestedValue(log?.user, ["name", "full_name"]),
          ]
            .filter(Boolean)
            .join(" ")
            .trim();

          const displayName = userName || getNestedValue(log, ["access_point_name"]) || "—";
          const cardId = getNestedValue(log, ["card_uid", "uid", "card_id", "cardUid"]) ?? "—";
          const statusValue = getNestedValue(log, ["result_code", "status", "authorization_status", "event_status", "result", "decision", "access_status"]) ?? "—";

          return (
            <tr key={log.id ?? `${cardId}-${log.scanned_at ?? index}`}>
              <td>{formatDateTime(getNestedValue(log, ["scanned_at", "timestamp", "created_at", "event_time", "time"]))}</td>
              <td>{displayName}</td>
              <td>{cardId}</td>
              <td>
                <span className={statusBadgeClass(statusValue)}>{readableStatus(statusValue)}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
