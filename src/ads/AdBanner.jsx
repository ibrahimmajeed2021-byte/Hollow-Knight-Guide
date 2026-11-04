import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

import { AppText } from "../components/hollow/app-text";
import { usePurchases } from "../purchases/PurchasesContext";
import { useAds } from "./AdsContext";
import { ADS_AVAILABLE, BANNER_UNIT_ID, SHOW_LIVE_ADS } from "./ads-config";

export function AdBanner() {
  const { isPremium } = usePurchases();
  const { ready } = useAds();
  const [failed, setFailed] = useState(false);

  // No ads for Premium users, web, or an unconfigured Release build.
  if (!ADS_AVAILABLE || isPremium || !ready || Platform.OS === "web" || failed) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <AppText style={styles.label}>
        {SHOW_LIVE_ADS ? "ADVERTISEMENT" : "TEST ADVERTISEMENT"}
      </AppText>
      <BannerAd
        unitId={BANNER_UNIT_ID}
        size={BannerAdSize.BANNER}
        // Start with non-personalized ads. UMP consent is checked in AdsContext
        // before this component is ever mounted.
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) console.warn("AdMob banner failed:", error?.message || error);
          setFailed(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    minHeight: 72,
  },
  label: {
    fontSize: 11,
    opacity: 0.65,
    letterSpacing: 1,
  },
});
