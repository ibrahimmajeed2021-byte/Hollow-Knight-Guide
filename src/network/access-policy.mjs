// A Free account needs a live connection to the guide service.
// Premium entitlement must be loaded from RevenueCat or its verified cache
// before making an access decision.
export function shouldBlockGuide({ onlineStatus, premium, entitlementCacheReady }) {
  // Offline or still checking the connection: keep content covered until
  // the locally verified entitlement is loaded. Otherwise a Free user could
  // briefly browse cached guide data during app startup.
  if (onlineStatus === "online") return false;
  if (entitlementCacheReady !== true) return true;
  return premium !== true;
}
