import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api/v2").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function normalizeListPayload(data, preferredKeys = []) {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  const candidateArrays = [
    data.results,
    data.logs,
    data.users,
    data.roles,
    data.access_points,
    data.items,
    data.data,
    data.objects,
  ];

  for (const candidate of candidateArrays) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (data.results && typeof data.results === "object") {
    for (const key of preferredKeys) {
      if (Array.isArray(data.results[key])) return data.results[key];
    }

    const nested = Object.values(data.results).find(Array.isArray);
    if (nested) return nested;
  }

  for (const key of preferredKeys) {
    if (Array.isArray(data[key])) return data[key];
  }

  return [];
}

function parsePaginationMeta(data = {}, fallbackPage = 1, fallbackPageSize = 10) {
  const totalValue = Number(data.count ?? data.total ?? 0);
  const total = Number.isFinite(totalValue) ? totalValue : 0;

  const pageValue = Number(data.page ?? data.current_page ?? data.current ?? fallbackPage);
  const page = Number.isFinite(pageValue) ? pageValue : fallbackPage;

  const pageSizeValue = Number(data.page_size ?? data.pageSize ?? fallbackPageSize);
  const pageSize = Number.isFinite(pageSizeValue) ? pageSizeValue : fallbackPageSize;

  const derivedPages = Number(data.pages ?? data.total_pages ?? Math.ceil(total / pageSize));
  const pages = Number.isFinite(derivedPages) && derivedPages > 0 ? derivedPages : 1;

  return {
    total,
    page,
    pageSize,
    pages,
  };
}

export const adminApi = {
  normalizeListPayload,

  async checkBackendHealth() {
    try {
      const response = await api.get("/dashboard/health/");
      return {
        ok: true,
        data: response.data ?? {},
      };
    } catch (error) {
      return {
        ok: false,
        error: error?.response?.data?.error ?? error.message,
      };
    }
  },

  async login({ email, password } = {}) {
    const normalizedEmail = String(email ?? "").trim();
    const normalizedPassword = String(password ?? "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error("Email and password are required.");
    }

    if (normalizedEmail.toLowerCase() !== "regaclipbeats@gmail.com") {
      throw new Error("Unauthorized access.");
    }

    if (normalizedPassword !== "12345678") {
      throw new Error("Invalid email or password.");
    }

    return {
      ok: true,
      demo: true,
      user: {
        email: normalizedEmail,
        name: "Regclip Beats",
        role: "Administrator",
      },
      token: "hardcoded-admin-session",
      data: {},
    };
  },

  async getSystemHealth() {
    const response = await api.get("/dashboard/health/");
    return response.data ?? {};
  },

  async getMetricsSummary() {
    const response = await api.get("/metrics/summary/");
    return response.data ?? {};
  },

  async getUsers({ page = 1, pageSize = 25 } = {}) {
    const response = await api.get("/users/browse/", {
      params: { page, page_size: pageSize },
    });

    const payload = response.data ?? {};
    const users = normalizeListPayload(payload, ["users"]);
    const meta = parsePaginationMeta(payload, page, pageSize);

    return {
      data: payload,
      users,
      total: meta.total,
      page: meta.page,
      pages: meta.pages,
      pageSize: meta.pageSize,
    };
  },

  async getUser(userId) {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  },

  async createUser(payload) {
    const response = await api.post("/users/create/", payload);
    return response.data;
  },

  async updateUser(userId, payload) {
    const response = await api.patch(`/users/${userId}/`, payload);
    return response.data;
  },

  async deactivateUser(userId) {
    const response = await api.post("/users/deactivate/", { user_id: userId });
    return response.data;
  },

  async reactivateUser(userId) {
    const response = await api.post("/users/reactivate/", { user_id: userId });
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}/delete/`);
    return response.data;
  },

  async getUserCards(userId) {
    const response = await api.get(`/users/${userId}/cards/`);
    return response.data ?? {};
  },

  async createCard(payload) {
    const response = await api.post("/cards/create/", payload);
    return response.data;
  },

  async activateCard(cardUid) {
    const response = await api.post("/cards/activate/", { card_uid: cardUid });
    return response.data;
  },

  async deactivateCard(cardUid) {
    const response = await api.post("/cards/deactivate/", { card_uid: cardUid });
    return response.data;
  },

  async checkCardAuth(payload) {
    const response = await api.post("/auth/check/", payload);
    return response.data;
  },

  async assignRoleToCard(payload) {
    const response = await api.post("/cards/assign-role/", payload);
    return response.data;
  },

  async revokeCard(payload) {
    const response = await api.post("/cards/revoke/", payload);
    return response.data;
  },

  async getCardDetail(cardUid) {
    const response = await api.get(`/cards/${cardUid}/`);
    return response.data;
  },

  async getCardAccessSummary(cardUid) {
    const response = await api.get(`/cards/${cardUid}/access-summary/`);
    return response.data;
  },

  async getRoles({ page = 1, pageSize = 100 } = {}) {
    const response = await api.get("/roles/", {
      params: { page, page_size: pageSize },
    });

    const payload = response.data ?? {};
    const roles = normalizeListPayload(payload, ["roles"]);
    const meta = parsePaginationMeta(payload, page, pageSize);

    return {
      data: payload,
      roles,
      total: meta.total,
      page: meta.page,
      pages: meta.pages,
      pageSize: meta.pageSize,
    };
  },

  async getRoleSummary(roleId) {
    const response = await api.get(`/roles/${roleId}/summary/`);
    return response.data;
  },

  async createRole(payload) {
    const response = await api.post("/roles/create/", payload);
    return response.data;
  },

  async updateRole(roleId, payload) {
    const response = await api.patch(`/roles/${roleId}/`, payload);
    return response.data;
  },

  async deleteRole(roleId) {
    const response = await api.delete(`/roles/${roleId}/delete/`);
    return response.data;
  },

  async attachRoleAccessPoints(roleId, accessPointIds) {
    const response = await api.post(`/roles/${roleId}/access-points/`, {
      access_point_ids: accessPointIds,
    });
    return response.data;
  },

  async detachRoleAccessPoints(roleId, accessPointIds) {
    const response = await api.delete(`/roles/${roleId}/access-points/remove/`, {
      data: {
        access_point_ids: accessPointIds,
      },
    });
    return response.data;
  },

  async getAccessPoints() {
    const response = await api.get("/access-points/list/");
    const payload = response.data ?? {};
    const accessPoints = normalizeListPayload(payload, ["access_points"]);

    return {
      data: payload,
      accessPoints,
    };
  },

  async getAccessPointHeartbeat(payload) {
    const response = await api.post("/access-points/heartbeat/", payload);
    return response.data;
  },

  async getWhoIsInside(accessPointId) {
    const response = await api.get(`/access-points/${accessPointId}/who-is-inside/`);
    return response.data;
  },

  async searchLogs(params = {}) {
    const response = await api.get("/logs/", { params });
    const payload = response.data ?? {};
    const logs = normalizeListPayload(payload, ["results"]);

    const totalValue = Number(payload.count ?? payload.total ?? logs.length ?? 0);
    const total = Number.isFinite(totalValue) ? totalValue : 0;

    const pageSizeValue = Number(params.page_size ?? 10);
    const pageSize = Number.isFinite(pageSizeValue) ? pageSizeValue : 10;

    const pageValue = Number(params.page ?? payload.page ?? 1);
    const page = Number.isFinite(pageValue) ? pageValue : 1;

    const pagesValue = Number(payload.pages ?? Math.max(1, Math.ceil(total / pageSize)));
    const pages = Number.isFinite(pagesValue) && pagesValue > 0 ? pagesValue : 1;

    return {
      data: payload,
      logs,
      total,
      page,
      pages,
    };
  },

  async exportLogs(params = {}) {
    const response = await api.get("/logs/export/", {
      params,
      responseType: "blob",
    });
    return response;
  },

  async getDeniedAttemptsReport(params = {}) {
    const response = await api.get("/dashboard/denied/", { params });
    return response.data ?? {};
  },

  async bulkOnboard(payload) {
    const response = await api.post("/admin/bulk-onboard/", payload);
    return response.data;
  },

  async upsertHoliday(payload) {
    const response = await api.post("/admin/holidays/", payload);
    return response.data;
  },
};

export default api;