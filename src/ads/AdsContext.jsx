import { createContext, useContext, useEffect, useMemo, useState } from "react";
import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";
import { usePurchases } from "../purchases/PurchasesContext";

// Only use Google demo ads in Debug builds for now. Production is deliberately
// disabled until real AdMob app/unit IDs and privacy requirements are configured.
const AdsContext = createContext({ ready: false });

let initializationPromise = null;

export function AdsProvider({ children }) {
  const { ready: purchasesReady, isPremium } = usePurchases();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (!__DEV__ || !purchasesReady || isPremium) {
      setReady(false);
      return () => { active = false; };
    }

    async function startTestAds() {
      try {
        // Consent must be gathered before initializing Mobile Ads.
        // During initial testing Google's demo app IDs may not have a UMP form.
        const result = await AdsConsent.gatherConsent();
        if (!result.canRequestAds) return;
      } catch (error) {
        // Demo ad units only: permit test ad initialization if the demo app
        // cannot serve a consent form. This is NOT safe for production ads.
        console.warn("Test AdMob consent unavailable:", error?.message);
      }

      try {
        initializationPromise ??= mobileAds().initialize().catch((error) => {
          initializationPromise = null;
          throw error;
        });
        await initializationPromise;
        if (active) setReady(true);
      } catch (error) {
        if (active) console.warn("Unable to initialize test AdMob:", error?.message);
      }
    }

    startTestAds();
    return () => { active = false; };
  }, [purchasesReady, isPremium]);

  const value = useMemo(() => ({
    ready: __DEV__ && ready && !isPremium,
  }), [ready, isPremium]);

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAds() {
  return useContext(AdsContext);
}
