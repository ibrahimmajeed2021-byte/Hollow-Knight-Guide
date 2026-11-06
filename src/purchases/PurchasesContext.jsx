import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

// Both subscriptions and the lifetime purchase grant the same entitlement.
export const PREMIUM_ENTITLEMENT = "hollow_knight_guide_pro";
const OFFLINE_PREMIUM_KEY = "hollow-knight-guide:premium-last-verified";

// Store the most recent successful verification. A subscription cannot be
// extended past its known expiry without contacting the store again; lifetime
// purchases have no expiration date. RevenueCat remains the authority online.
function cachedEntitlementActive(value) {
  if (!value?.active) return false;
  if (value.expiresAt == null) return true;
  const expiry = Date.parse(value.expiresAt);
  return Number.isFinite(expiry) && expiry > Date.now();
}

// The public Test Store key is only valid in Debug builds.
// Release builds must use a real store key (appl_ / goog_) or disable purchases.
const TEST_STORE_API_KEY = "test_WRaCfHJEiihXEjkKFzDNwJPvSBA";
const storeApiKey = Platform.OS === "ios"
  ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
  : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
const API_KEY = __DEV__ ? storeApiKey || TEST_STORE_API_KEY : storeApiKey;

let sdkConfigured = false;
const PurchasesContext = createContext(null);

function describeError(error) {
  return error?.message || "Something went wrong. Please try again.";
}

function hasPremium(info) {
  const entitlement = info?.entitlements?.active?.[PREMIUM_ENTITLEMENT];
  if (!entitlement) return false;
  if (entitlement.expirationDate) {
    const expiry = Date.parse(entitlement.expirationDate);
    return Number.isFinite(expiry) && expiry > Date.now();
  }
  return true;
}

export function PurchasesProvider({ children }) {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [lastVerifiedPremium, setLastVerifiedPremium] = useState(null);
  const [entitlementCacheReady, setEntitlementCacheReady] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // Development-only preview: never changes the real RevenueCat entitlement.
  const [previewFree, setPreviewFree] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(OFFLINE_PREMIUM_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        try {
          const saved = JSON.parse(raw);
          if (cachedEntitlementActive(saved)) setLastVerifiedPremium(saved);
        } catch { /* Ignore damaged cache; never grant unverified access. */ }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setEntitlementCacheReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (customerInfo == null) return;
    const entitlement = customerInfo.entitlements?.active?.[PREMIUM_ENTITLEMENT];
    const verified = hasPremium(customerInfo);
    const saved = verified
      ? { active: true, expiresAt: entitlement?.expirationDate ?? null }
      : { active: false, expiresAt: null };
    setLastVerifiedPremium(verified ? saved : null);
    AsyncStorage.setItem(OFFLINE_PREMIUM_KEY, JSON.stringify(saved)).catch(() => {});
  }, [customerInfo]);

  const refreshCustomerInfo = useCallback(async () => {
    if (!sdkConfigured) return null;
    const info = await Purchases.getCustomerInfo();
    setCustomerInfo(info);
    return info;
  }, []);

  const refreshOfferings = useCallback(async () => {
    if (!sdkConfigured) return null;
    const next = await Purchases.getOfferings();
    setOfferings(next);
    return next;
  }, []);

  useEffect(() => {
    let mounted = true;
    let listenerAdded = false;

    const handleInfo = (info) => {
      if (mounted) setCustomerInfo(info);
    };

    if (Platform.OS === "web") {
      setError("In-app purchases require an iOS or Android app build.");
      setReady(true);
      return () => { mounted = false; };
    }

    if (!API_KEY || (!__DEV__ && API_KEY.startsWith("test_"))) {
      // RevenueCat intentionally crashes Release builds configured with test_ keys.
      // Do not initialize the SDK until a real store key is supplied.
      setError(
        "Purchases are disabled in this Release build. To test purchases, install a Debug build using npx expo run:ios --device. Production builds need an App Store or Google Play public SDK key."
      );
      setReady(true);
      return () => { mounted = false; };
    }

    try {
      if (!sdkConfigured) {
        Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
        Purchases.configure({ apiKey: API_KEY });
        sdkConfigured = true;
      }

      Purchases.addCustomerInfoUpdateListener(handleInfo);
      listenerAdded = true;

      // A failure loading products must not stop the entitlement check.
      Promise.allSettled([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]).then(([infoResult, offeringResult]) => {
        if (!mounted) return;
        if (infoResult.status === "fulfilled") {
          setCustomerInfo(infoResult.value);
        }
        if (offeringResult.status === "fulfilled") {
          setOfferings(offeringResult.value);
        }
        if (infoResult.status === "rejected" || offeringResult.status === "rejected") {
          setError(describeError(
            infoResult.status === "rejected"
              ? infoResult.reason
              : offeringResult.reason
          ));
        }
        setReady(true);
      });
    } catch (cause) {
      setError(describeError(cause));
      setReady(true);
    }

    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active" && sdkConfigured) {
        Purchases.getCustomerInfo()
          .then((info) => { if (mounted) setCustomerInfo(info); })
          .catch(() => {});
      }
    });

    return () => {
      mounted = false;
      appStateListener.remove();
      if (listenerAdded) Purchases.removeCustomerInfoUpdateListener(handleInfo);
    };
  }, []);

  const purchasePackage = useCallback(async (selectedPackage) => {
    if (!sdkConfigured || !selectedPackage || busy) return false;
    setBusy(true);
    setError(null);
    try {
      const result = await Purchases.purchasePackage(selectedPackage);
      setCustomerInfo(result.customerInfo);
      return hasPremium(result.customerInfo);
    } catch (cause) {
      if (!cause?.userCancelled) setError(describeError(cause));
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy]);

  const restorePurchases = useCallback(async () => {
    if (!sdkConfigured || busy) return false;
    setBusy(true);
    setError(null);
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      if (!hasPremium(info)) {
        setError("No active Premium purchase was found for this account.");
      }
      return hasPremium(info);
    } catch (cause) {
      setError(describeError(cause));
      return false;
    } finally {
      setBusy(false);
    }
  }, [busy]);

  const presentPaywall = useCallback(async () => {
    if (!sdkConfigured || busy) return;
    if (!offerings?.current) {
      setError("Set up a Current offering in RevenueCat before opening the paywall.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = __DEV__ && previewFree
        ? await RevenueCatUI.presentPaywall({
            offering: offerings.current,
            displayCloseButton: true,
          })
        : await RevenueCatUI.presentPaywallIfNeeded({
            requiredEntitlementIdentifier: PREMIUM_ENTITLEMENT,
            offering: offerings.current,
            displayCloseButton: true,
          });
      if (result === RevenueCatUI.PAYWALL_RESULT.ERROR) {
        setError("Unable to display the RevenueCat paywall. Check its dashboard setup.");
      }
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setBusy(false);
    }
  }, [busy, offerings, previewFree]);

  const presentCustomerCenter = useCallback(async () => {
    if (!sdkConfigured || busy) return;
    setBusy(true);
    setError(null);
    try {
      await RevenueCatUI.presentCustomerCenter();
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setBusy(false);
    }
  }, [busy]);

  const actualPremium = hasPremium(customerInfo) ||
    (customerInfo == null && cachedEntitlementActive(lastVerifiedPremium));

  const value = useMemo(() => ({
    ready,
    entitlementCacheReady,
    busy,
    error,
    clearError: () => setError(null),
    customerInfo,
    offerings,
    actualIsPremium: actualPremium,
    isPremium: actualPremium && !(__DEV__ && previewFree),
    previewFree: __DEV__ ? previewFree : false,
    setPreviewFree: (enabled) => { if (__DEV__) setPreviewFree(Boolean(enabled)); },
    refreshCustomerInfo,
    refreshOfferings,
    purchasePackage,
    restorePurchases,
    presentPaywall,
    presentCustomerCenter,
  }), [
    ready, entitlementCacheReady, actualPremium, busy, error, customerInfo, offerings, previewFree, refreshCustomerInfo,
    refreshOfferings, purchasePackage, restorePurchases,
    presentPaywall, presentCustomerCenter,
  ]);

  return (
    <PurchasesContext.Provider value={value}>
      {children}
    </PurchasesContext.Provider>
  );
}

export function usePurchases() {
  const context = useContext(PurchasesContext);
  if (!context) throw new Error("usePurchases must be used inside PurchasesProvider.");
  return context;
}
