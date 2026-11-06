// A Free account needs a live connection to the guide service.
// Premium entitlement must be loaded from RevenueCat or its verified cache
// before making an access decision.
export function shouldBlockGuide({ onlineStatus, premium, entitlementCacheReady }) {
  return entitlementCacheReady === true &&
    premium !== true &&
    onlineStatus !== "online";
}
