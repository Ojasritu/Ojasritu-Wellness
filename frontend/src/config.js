// Central frontend configuration
export function getGoogleClientId() {
  // 1) Vite build-time env
  const buildId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
  if (buildId) return buildId;

  // 2) Window-level runtime injection (supported by some hosts)
  try {
    const winId = window?.__env?.VITE_GOOGLE_CLIENT_ID;
    if (winId) return winId;
  } catch (e) { /* ignore */ }

  // 3) Meta tag injection (index.html can include <meta name="VITE_GOOGLE_CLIENT_ID" content="..."/>)
  const meta = document?.querySelector('meta[name="VITE_GOOGLE_CLIENT_ID"]')?.getAttribute('content');
  if (meta) return meta;

  return null;
}

export function isGoogleEnabled() {
  return Boolean(getGoogleClientId());
}

export default { getGoogleClientId, isGoogleEnabled };
