const stripTrailingSlash = (url) => url.replace(/\/+$/, '');

const stripApiSuffix = (url) => url.replace(/\/api\/?$/, '');

// Requests in the app already append "/api", so SERVER_URL should be the backend origin.
const getServerURL = () => {
  const configuredUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    return stripApiSuffix(stripTrailingSlash(configuredUrl));
  }

  return import.meta.env.PROD
    ? window.location.origin
    : 'http://127.0.0.1:8000';
};

export const SERVER_URL = getServerURL();
