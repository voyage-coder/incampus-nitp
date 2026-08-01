/**
 * Resolves upload paths returned by the backend (filename or uploads/ path)
 * into a browser-loadable URL.
 *
 * Local dev: relative /uploads/... (Vite proxy → backend)
 * Production: https://your-api.onrender.com/uploads/...
 */
export function resolveUploadUrl(path) {
  if (!path) return null;
  const value = String(path).trim();
  if (!value) return null;
  // Backend may already return a full URL
  if (value.startsWith('http://') || value.startsWith('https://')) return value;

  let uploadPath = value;
  if (!uploadPath.startsWith('/uploads/')) {
    uploadPath = uploadPath.startsWith('uploads/')
      ? `/${uploadPath}`
      : `/uploads/${uploadPath}`;
  }

  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return apiBase ? `${apiBase}${uploadPath}` : uploadPath;
}

/**
 * Store only the filename in forms/DB payloads; accept full URLs when editing.
 */
export function uploadPathForStorage(path) {
  if (!path) return null;
  const value = String(path).trim();
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    const match = value.match(/\/uploads\/([^/?#]+)/);
    return match?.[1] || value;
  }
  return value.replace(/^\/?uploads\//, '');
}
