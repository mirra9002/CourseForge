export function isMobileDevice() {
  if (typeof window === 'undefined') return false

  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  )
  const smallViewport = window.matchMedia('(max-width: 900px)').matches
  const touchTablet = window.matchMedia('(pointer: coarse) and (max-width: 1180px)').matches

  return mobileUserAgent || smallViewport || touchTablet
}

// Keep the exceptions exact so new platform pages remain desktop-only.
export function isMobileAccessiblePath(pathname) {
  return pathname === '/' ||
    /^\/auth\/[01]\/?$/i.test(pathname) ||
    /^\/activate\/[^/]+\/[^/]+\/?$/i.test(pathname)
}

export function withDeviceAccess(loader) {
  return (args) => {
    const { pathname } = new URL(args.request.url)
    if (isMobileDevice() && !isMobileAccessiblePath(pathname)) return null
    return loader(args)
  }
}
