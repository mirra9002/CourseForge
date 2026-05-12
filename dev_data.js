// All fetch calls in the app append "/api/...", so SERVER_URL must be the
// origin-only prefix — never including the "/api" segment itself.
//
// Resolution order:
//   1. VITE_API_BASE_URL is a relative path (e.g. "/api")
//      → strip the "/api" suffix → SERVER_URL = ""
//      → fetch: `${SERVER_URL}/api/courses` → "/api/courses"  ✓
//   2. VITE_API_BASE_URL is an absolute URL (e.g. "https://backend.example.com/api")
//      → strip trailing slash + "/api" suffix → SERVER_URL = "https://backend.example.com"
//      → fetch: `${SERVER_URL}/api/courses` → "https://backend.example.com/api/courses"  ✓
//   3. Production, no env var → SERVER_URL = ""  (same-domain reverse proxy)
//      → fetch: `${SERVER_URL}/api/courses` → "/api/courses"  ✓
//   4. Development, no env var → SERVER_URL = "http://127.0.0.1:8000"
//      → fetch: `${SERVER_URL}/api/courses` → "http://127.0.0.1:8000/api/courses"  ✓
const getServerURL = () => {
  const configuredUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    // Relative path (e.g. "/api" or "/api/") — strip the "/api" suffix so
    // that fetch calls which already append "/api/..." stay correct.
    if (configuredUrl.startsWith('/')) {
      return configuredUrl.replace(/\/api\/?$/, '');
    }
    // Absolute URL — strip trailing slash and any "/api" suffix.
    return configuredUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  }

  // Production with no explicit env var: use same-domain relative paths so
  // the reverse proxy routes "/api/*" to the backend without CORS issues.
  if (import.meta.env.PROD) {
    return '';
  }

  // Local development: hit the backend directly.
  return 'http://127.0.0.1:8000';
};

export const SERVER_URL = getServerURL();

export const GOOGLE_OAUTH_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ||
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '';
