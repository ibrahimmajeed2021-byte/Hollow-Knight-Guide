import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI from "react-native-purchases-ui";

// Both subscriptions and the lifetime purchase grant the same entitlement.
export const PREMIUM_ENTITLEMENT = "hollow_knight_guide_pro";

// PUBLIC RevenueCat SDK key for development with Test Store.
// Set EXPO_PUBLIC_REVENUECAT_API_KEY to the platform's production public SDK
// key when you switch to App Store / Google Play purchases.
const API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ||
  "test_WRaCfHJEiihXEjkKFzDNwJPvSBA";

let sdkConfigured = false;
const PurchasesContext = createContext(null);

function describeError(error) {
  return error?.message || "Something went wrong. Please try again.";
}

function hasPremium(info) {
  return Boolean(info?.entitlements?.active?.[PREMIUM_ENTITLEMENT]);
}

export function PurchasesProvider({ children }) {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

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
      const result = await RevenueCatUI.presentPaywallIfNeeded({
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
  }, [busy, offerings]);

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

  const value = useMemo(() => ({
    ready,
    busy,
    error,
    clearError: () => setError(null),
    customerInfo,
    offerings,
    isPremium: hasPremium(customerInfo),
    refreshCustomerInfo,
    refreshOfferings,
    purchasePackage,
    restorePurchases,
    presentPaywall,
    presentCustomerCenter,
  }), [
    ready, busy, error, customerInfo, offerings, refreshCustomerInfo,
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
