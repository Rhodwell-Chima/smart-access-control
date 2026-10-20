const AUTH_SESSION_KEY = "smart-access-control-auth";

export function getAuthSession() {
  if (typeof window === "undefined") return null;

  const sources = [localStorage, sessionStorage];

  for (const store of sources) {
    try {
      const raw = store.getItem(AUTH_SESSION_KEY);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (parsed?.authenticated) {
        return parsed;
      }
    } catch {
      store.removeItem(AUTH_SESSION_KEY);
    }
  }

  return null;
}

export function isAuthenticated() {
  return Boolean(getAuthSession());
}

export function persistAuthSession(user, rememberMe) {
  const session = {
    authenticated: true,
    email: user?.email ?? "",
    name: user?.name ?? "Administrator",
    role: user?.role ?? "Administrator",
    mode: user?.demo ? "demo" : "real",
    rememberMe,
    signedInAt: new Date().toISOString(),
  };

  if (rememberMe) {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  } else {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    localStorage.removeItem(AUTH_SESSION_KEY);
  }

  return session;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
}
