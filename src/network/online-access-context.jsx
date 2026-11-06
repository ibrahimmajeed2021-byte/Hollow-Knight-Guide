import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { usePurchases } from "../purchases/PurchasesContext";
import { shouldBlockGuide } from "./access-policy.mjs";

const ONLINE_CHECK_URL = "https://hollow-knight-guide-ibrahim.surge.sh/api/index.json";
const CHECK_INTERVAL_MS = 15000;
const REQUEST_TIMEOUT_MS = 6500;

const OnlineAccessContext = createContext({
  status: "checking",
  canUseOffline: false,
  blocked: false,
  checking: true,
  retry: async () => {},
});

// This verifies that the app can reach its actual guide service.
// Disabling Wi-Fi does not count as offline when mobile data still works.
// A failed server request is reported as "can't connect" rather than assuming
// the user deliberately disabled Wi-Fi.
export function OnlineAccessProvider({ children }) {
  const { isPremium, entitlementCacheReady } = usePurchases();
  const [status, setStatus] = useState("checking");
  const [checking, setChecking] = useState(true);
  const inFlight = useRef(false);
  const mounted = useRef(true);

  const retry = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setChecking(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(
        ONLINE_CHECK_URL + "?reachability=" + Date.now(),
        { method: "GET", cache: "no-store", signal: controller.signal },
      );
      if (mounted.current) setStatus(response.ok ? "online" : "unreachable");
    } catch {
      if (mounted.current) setStatus("unreachable");
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
      if (mounted.current) setChecking(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    // Start immediately; recheck when returning to the foreground.
    retry();
    const interval = setInterval(() => {
      if (AppState.currentState === "active" || Platform.OS === "web") retry();
    }, CHECK_INTERVAL_MS);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") retry();
    });
    return () => {
      mounted.current = false;
      clearInterval(interval);
      listener.remove();
    };
  }, [retry]);

  const verifiedPremium = entitlementCacheReady && isPremium;
  // The cache is read before deciding whether to lock a Premium subscriber.
  // A free user cannot browse cached guide data during a connection check.
  const blocked = shouldBlockGuide({
    onlineStatus: status,
    premium: verifiedPremium,
    entitlementCacheReady,
  });

  const value = useMemo(() => ({
    status,
    checking,
    canUseOffline: verifiedPremium,
    blocked,
    retry,
  }), [status, checking, verifiedPremium, blocked, retry]);
  return (
    <OnlineAccessContext.Provider value={value}>
      {children}
    </OnlineAccessContext.Provider>
  );
}

export function useOnlineAccess() {
  return useContext(OnlineAccessContext);
}
