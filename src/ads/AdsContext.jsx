import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";

import { usePurchases } from "../purchases/PurchasesContext";
import { ADS_AVAILABLE } from "./ads-config";

const AdsContext = createContext({
  ready: false,
  privacyOptionsRequired: false,
  showPrivacyOptions: async () => {},
});

let initializationPromise = null;

export function AdsProvider({ children }) {
  const { ready: purchasesReady, isPremium } = usePurchases();
  const [ready, setReady] = useState(false);
  const [privacyOptionsRequired, setPrivacyOptionsRequired] = useState(false);
  const [consentRevision, setConsentRevision] = useState(0);

  useEffect(() => {
    let active = true;

    // Actual or simulated Premium always sees zero adverts.
    // Invalid/missing production ad IDs also disable all ad requests.
    if (!ADS_AVAILABLE || !purchasesReady || isPremium) {
      setReady(false);
      return () => { active = false; };
    }

    setReady(false);

    async function startAds() {
      // Only Google's sample ads may be shown without a configured UMP form.
      // Live ads NEVER use this test-only consent fallback.
      let mayRequestAds = __DEV__;
      try {
        await AdsConsent.gatherConsent();
        const info = await AdsConsent.getConsentInfo();

        if (active) {
          setPrivacyOptionsRequired(info.privacyOptionsRequirementStatus === "REQUIRED");
        }
        mayRequestAds = __DEV__ || info.canRequestAds === true;
      } catch (error) {
        console.warn("AdMob consent check:", error?.message || error);
        if (!__DEV__) {
          // The UMP SDK can retain an eligible consent result from last launch.
          // Fail closed when that result is unavailable.
          try {
            const info = await AdsConsent.getConsentInfo();
            mayRequestAds = info.canRequestAds === true;
            if (active) {
              setPrivacyOptionsRequired(info.privacyOptionsRequirementStatus === "REQUIRED");
            }
          } catch (_) {
            mayRequestAds = false;
          }
        }
      }

      if (!active || !mayRequestAds) return;

      try {
        initializationPromise ??= mobileAds().initialize().catch((error) => {
          initializationPromise = null;
          throw error;
        });
        await initializationPromise;
        if (active) setReady(true);
      } catch (error) {
        if (active) console.warn("AdMob initialization failed:", error?.message || error);
      }
    }

    startAds();
    return () => { active = false; };
  }, [purchasesReady, isPremium, consentRevision]);

  const showPrivacyOptions = useCallback(async () => {
    try {
      await AdsConsent.showPrivacyOptionsForm();
      // Re-check the user's decision before another banner can request an ad.
      setConsentRevision((value) => value + 1);
    } catch (error) {
      console.warn("Unable to show ad privacy options:", error?.message || error);
    }
  }, []);

  const value = useMemo(() => ({
    ready: ADS_AVAILABLE && ready && !isPremium,
    privacyOptionsRequired,
    showPrivacyOptions,
  }), [ready, isPremium, privacyOptionsRequired, showPrivacyOptions]);

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export function useAds() {
  return useContext(AdsContext);
}
