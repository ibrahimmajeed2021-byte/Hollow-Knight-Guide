// Reduce unnecessary network wakeups without weakening Free offline gating.
// Free must detect a lost guide-service connection promptly; a verified
// Premium entitlement can use bundled data offline and needs fewer checks.
export const FREE_CHECK_INTERVAL_MS = 15_000;
export const PREMIUM_CHECK_INTERVAL_MS = 90_000;

export function reachabilityIntervalMs(verifiedPremium) {
  return verifiedPremium ? PREMIUM_CHECK_INTERVAL_MS : FREE_CHECK_INTERVAL_MS;
}
