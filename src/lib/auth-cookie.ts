const COOKIE_NAME = 'crowdraise_auth';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export function setAuthCookie(token: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

export function getStoredToken(): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

export function syncAuthCookie() {
  const token = getStoredToken();
  if (token) {
    setAuthCookie(token);
  } else {
    clearAuthCookie();
  }
}
