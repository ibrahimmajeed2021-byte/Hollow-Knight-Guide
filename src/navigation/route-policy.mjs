// A single navigation policy for header actions and the native tab bar.
// Subpages (Settings, Premium, planner, details, photos, etc.) share a
// pinned top-right Close button and no underlying tab navigation.
export const PRIMARY_GUIDE_ROUTES = Object.freeze([
  "/", "/bosses", "/charms", "/quests", "/music", "/progress",
]);

export function isPrimaryGuideRoute(pathname) {
  const route = typeof pathname === "string"
    ? (pathname.replace(/\/+$/, "") || "/")
    : "/";
  return PRIMARY_GUIDE_ROUTES.includes(route);
}

export function isSecondaryGuideRoute(pathname) {
  return !isPrimaryGuideRoute(pathname);
}

export function closeDestination(canGoBack) {
  return canGoBack ? "back" : "home";
}
