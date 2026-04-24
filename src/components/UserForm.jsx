import { useState, useEffect, useRef, useCallback } from "react";
import FormInput from "./FormInput";
import UIDInput from "./UIDInput";
import SelectInput from "./SelectInput";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_META = {
  ADMIN: { label: "Admin", badgeClass: "text-bg-primary" },
  USER: { label: "User", badgeClass: "text-bg-info" },
  GUEST: { label: "Guest", badgeClass: "text-bg-secondary" },
};

const STATUS_META = {
  AUTHORISED: { label: "Authorised", badgeClass: "text-bg-success" },
  UNAUTHORIZED: { label: "Unauthorized", badgeClass: "text-bg-warning" },
  BLACKLISTED: { label: "Blacklisted", badgeClass: "text-bg-danger" },
};

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  email: "",
  uid: "",
  role: "",
  status: "",
};

// Change this to your ESP32's IP address / hostname
// e.g. "ws://192.168.1.42/ws"  or  "ws://esp32.local/ws"
const ESP32_WS_URL = "ws://192.168.1.42/ws";

// ─── Scan states ─────────────────────────────────────────────────────────────
//   idle        → no scanning, manual input allowed
//   connecting  → WebSocket is opening
//   scanning    → connected, waiting for card tap
//   success     → card read, UID filled in
//   error       → connection failed or closed unexpectedly

// ─── Badge component ─────────────────────────────────────────────────────────

const Badge = ({ meta }) => {
  if (!meta) return null;
  return (
    <span className={`badge rounded-pill mt-2 ${meta.badgeClass}`}>
      {meta.label}
    </span>
  );
};

// ─── RFID Scan Button + status strip ─────────────────────────────────────────

const ScanStates = {
  idle: {
    btnClass: "btn btn-outline-secondary",
    btnLabel: "Scan card",
    icon: "📡",
    alertClass: null,
    alertMsg: null,
  },
  connecting: {
    btnClass: "btn btn-outline-secondary disabled",
    btnLabel: "Connecting…",
    icon: "⏳",
    alertClass: "alert alert-info py-2 small mb-0",
    alertMsg: "Connecting to reader…",
  },
  scanning: {
    btnClass: "btn btn-warning",
    btnLabel: "Cancel scan",
    icon: "🔄",
    alertClass: "alert alert-warning py-2 small mb-0",
    alertMsg: "Tap your RFID card on the reader now.",
  },
  success: {
    btnClass: "btn btn-outline-success",
    btnLabel: "Scan again",
    icon: "✅",
    alertClass: "alert alert-success py-2 small mb-0",
    alertMsg: "Card detected — UID filled in.",
  },
  error: {
    btnClass: "btn btn-outline-danger",
    btnLabel: "Retry scan",
    icon: "⚠️",
    alertClass: "alert alert-danger py-2 small mb-0",
    alertMsg: "Could not connect to reader. Check ESP32 is online.",
  },
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function UserForm({ onSubmit, onCancel, wsUrl = ESP32_WS_URL }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [scanState, setScanState] = useState("idle");

  const wsRef = useRef(null);

  // Tear down WebSocket cleanly
  const closeWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => () => closeWs(), [closeWs]);

  // ── Scan logic ──────────────────────────────────────────────────────────────

  const startScan = useCallback(() => {
    setScanState("connecting");
    closeWs();

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setScanState("scanning");
      // Tell the ESP32 to start listening for a card tap
      ws.send(JSON.stringify({ command: "scan" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Expected payload from ESP32: { "uid": "A1B2C3D4" }
        if (data.uid) {
          setForm((prev) => ({ ...prev, uid: data.uid }));
          setErrors((prev) => ({ ...prev, uid: false }));
          setScanState("success");
          closeWs();
        }
      } catch {
        // Non-JSON frames (e.g. debug logs) — ignore
      }
    };

    ws.onerror = () => {
      setScanState("error");
      closeWs();
    };

    ws.onclose = () => {
      // Only treat as error if we were still waiting
      setScanState((prev) =>
        prev === "scanning" || prev === "connecting" ? "error" : prev,
      );
    };
  }, [wsUrl, closeWs]);

  const cancelScan = useCallback(() => {
    closeWs();
    setScanState("idle");
  }, [closeWs]);

  const handleScanButton = () => {
    if (scanState === "scanning") {
      cancelScan();
    } else {
      startScan();
    }
  };

  // ── Form logic ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: false }));
    // If user types in UID manually, reset scan state to idle
    if (id === "uid") setScanState("idle");
  };

  const validate = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "uid",
      "role",
      "status",
    ];
    const newErrors = {};
    required.forEach((key) => {
      if (!form[key]) newErrors[key] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit
      ? onSubmit(form)
      : alert("Form submitted:\n" + JSON.stringify(form, null, 2));
  };

  const handleCancel = () => {
    cancelScan();
    setForm(INITIAL_STATE);
    setErrors({});
    onCancel?.();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const ui = ScanStates[scanState];
  const isScanning = scanState === "scanning";

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-1">User details</h5>
          <p className="text-secondary small mb-4">
            Fill in the fields below to register a new user.
          </p>

          {/* ── Personal info ── */}
          <p className="text-uppercase text-secondary small fw-semibold mb-3">
            Personal info
          </p>

          <div className="row g-3 mb-3">
            <FormInput
              label="First name"
              name="firstName"
              type="text"
              placeholder="e.g. Jane"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              className="col-md-6"
              required={true}
            />
            <FormInput
              label="Last name"
              name="lastName"
              type="text"
              placeholder="e.g. Smith"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              className="col-md-6"
              required={true}
            />{" "}
          </div>

          <div className="mb-3">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="jane.smith@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              className="col-12"
              required={true}
            />
          </div>

          {/* ── UID with RFID scan ── */}
          <UIDInput
            label="UID"
            name="uid"
            value={form.uid}
            onChange={handleChange}
            error={errors.uid}
            placeholder="Type manually or scan card →"
            readOnly={isScanning}
            onButtonClick={handleScanButton}
            buttonLabel={ui.btnLabel}
            buttonIcon={ui.icon}
            buttonClass={ui.btnClass}
            alertClass={ui.alertClass}
            alertMsg={ui.alertMsg}
          />

          <hr className="my-4" />

          {/* ── Access & permissions ── */}
          <p className="text-uppercase text-secondary small fw-semibold mb-3">
            Access &amp; permissions
          </p>

          <div className="row g-3">
            <SelectInput
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              error={errors.role}
              placeholder="Select a role…"
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "USER", label: "User" },
                { value: "GUEST", label: "Guest" },
              ]}
              renderExtra={() => <Badge meta={ROLE_META[form.role]} />}
            />

            <SelectInput
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              error={errors.status}
              placeholder="Select a status…"
              options={[
                { value: "AUTHORISED", label: "Authorised" },
                { value: "UNAUTHORIZED", label: "Unauthorized" },
                { value: "BLACKLISTED", label: "Blacklisted" },
              ]}
              renderExtra={() => <Badge meta={STATUS_META[form.status]} />}
            />
          </div>

          {/* ── Actions ── */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleSubmit}
            >
              Save user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
