import { SERVER_URL } from '../dev_data.js';

function errorText(data) {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.map(errorText).filter(Boolean).join('; ');
  if (data && typeof data === 'object') return Object.entries(data)
    .map(([key, value]) => `${key === 'detail' ? '' : `${key}: `}${errorText(value)}`).join('\n');
  return '';
}

function cookieValue(name) {
  const prefix = `${name}=`;
  const cookie = document.cookie.split('; ').find(value => value.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
}

async function csrfToken() {
  const response = await fetch(`${SERVER_URL}/api/users/auth/csrf/`, { credentials: 'include' });
  if (!response.ok) throw new Error('Could not prepare a secure save. Refresh the page and try again.');

  // During a rolling deployment the previous backend returns 204 and only sets
  // csrftoken; the new backend also returns the token as JSON.
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  const token = data?.csrfToken || cookieValue('csrftoken');
  if (!token) throw new Error('The browser did not save the CSRF cookie. Open the site through its primary HTTPS domain and try again.');
  return token;
}

export async function api(path, { body, headers, ...options } = {}, retried = false) {
  let csrf;
  if (options.method && !['GET', 'HEAD', 'OPTIONS'].includes(options.method)) {
    csrf = await csrfToken();
  }
  const response = await fetch(`${SERVER_URL}${path}`, {
    credentials: 'include', ...options,
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(csrf ? { 'X-CSRFToken': csrf } : {}), ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (response.status === 401 && !retried) {
    const refresh = await fetch(`${SERVER_URL}/api/users/auth/refresh/`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(csrf ? { 'X-CSRFToken': csrf } : {}) }, body: '{}',
    });
    if (refresh.ok) return api(path, { body, headers, ...options }, true);
  }
  if (!response.ok) {
    const error = new Error(errorText(data) || `Server error (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export function mediaSource(source) {
  if (/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(source || '')) {
    return `${SERVER_URL}/api/media/${source}/content/`;
  }
  return source?.startsWith('/api/media/') ? `${SERVER_URL}${source}` : source;
}

export async function uploadMedia(file, onProgress) {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
  const isImage = file.type.startsWith('image/');
  if (!allowed.includes(file.type)) throw new Error('Select a JPG, PNG, GIF, WebP, MP4, or WebM file.');
  if (!file.size || file.size > (isImage ? 20 : 500) * 1024 ** 2) {
    throw new Error('The maximum size is 20 MB for an image and 500 MB for a video.');
  }
  const upload = await api('/api/media/upload-url/', { method: 'POST', body: {
    filename: file.name, content_type: file.type, file_size: file.size, media_type: isImage ? 'image' : 'video',
  } });
  await new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', upload.upload_url);
    request.timeout = 30 * 60 * 1000;
    Object.entries(upload.headers).forEach(([key, value]) => request.setRequestHeader(key, value));
    request.upload.onprogress = event => event.lengthComputable && onProgress(Math.round(event.loaded / event.total * 100));
    request.onload = () => request.status >= 200 && request.status < 300 ? resolve() : reject(new Error(`R2 upload failed (${request.status}).`));
    request.onerror = () => reject(new Error('Could not upload the file. Check your connection and the R2 bucket CORS settings.'));
    request.ontimeout = () => reject(new Error('The upload took too long. Try again.'));
    request.send(file);
  });
  await api(`/api/media/${upload.media_id}/confirm/`, { method: 'POST', body: {} });
  return { id: upload.media_id, type: isImage ? 'image' : 'video', url: `/api/media/${upload.media_id}/content/` };
}
