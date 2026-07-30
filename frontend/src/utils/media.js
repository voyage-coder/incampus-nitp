/**
 * Resolves upload paths returned by the backend (filename or uploads/ path)
 * into a browser-loadable URL via the Vite proxy.
 */
export function resolveUploadUrl(path) {
  if (!path) return null;
  const value = String(path).trim();
  if (!value) return null;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/uploads/')) return value;
  if (value.startsWith('uploads/')) return `/${value}`;
  return `/uploads/${value}`;
}
