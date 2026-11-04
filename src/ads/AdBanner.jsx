import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

import { useAds } from "./AdsContext";
import { usePurchases } from "../purchases/PurchasesContext";
import { AppText } from "../components/hollow/app-text";

// Official Google demo units. Never use these in a production release.
const TEST_BANNER_ID = TestIds.BANNER;

export function AdBanner() {
  const { isPremium } = usePurchases();
  const { ready } = useAds();
  const [failed, setFailed] = useState(false);

  // No ads for Premium. Production ads are disabled until a real AdMob
  // account, consent message and native app IDs have been configured.
  if (!__DEV__ || isPremium || !ready || Platform.OS === "web") return null;

  return (
    <View style={styles.wrapper}>
      <AppText style={styles.label}>TEST ADVERTISEMENT</AppText>
      {failed ? (
        <AppText style={styles.status}>Test ad could not load. Check the Metro logs.</AppText>
      ) : (
        <BannerAd
          unitId={TEST_BANNER_ID}
          size={BannerAdSize.BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdFailedToLoad={(error) => {
            console.warn("AdMob demo banner failed:", error?.message);
            setFailed(true);
          }}
        />
      )}
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
  status: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
});
