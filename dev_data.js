// Dynamically determine the server URL based on the current environment
const getServerURL = () => {
  // In production, the API is served from the same origin
  // In development, we need to specify the backend URL
  if (import.meta.env.PROD) {
    // Production: use the same origin (window.location.origin)
    return window.location.origin;
  }
  
  // Development: check for environment variable, otherwise default to localhost
  const url = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  console.log('Using API URL:', url);
  return url;
};

export const SERVER_URL = getServerURL();