import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

// Expo inlines EXPO_PUBLIC_* values into the JavaScript bundle at build time.
// These AdMob identifiers are PUBLIC identifiers, not account passwords.
const iosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID;
const androidAppId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID;
const iosBannerUnitId = process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID;
const androidBannerUnitId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID;
const liveAdsRequested = process.env.EXPO_PUBLIC_ADMOB_ENABLE_LIVE_ADS === "true";

const platformAppId = Platform.OS === "ios" ? iosAppId : androidAppId;
const platformBannerId = Platform.OS === "ios" ? iosBannerUnitId : androidBannerUnitId;

const validAppId = /^ca-app-pub-\d{16}~\d{10}$/.test(platformAppId || "")
  && !platformAppId?.startsWith("ca-app-pub-3940256099942544~");
const validBannerId = /^ca-app-pub-\d{16}\/\d{10}$/.test(platformBannerId || "")
  && !platformBannerId?.startsWith("ca-app-pub-3940256099942544/");

// Debug ALWAYS uses Google's test banner even if real IDs are configured.
// Release displays live ads only when explicitly enabled with both valid IDs.
export const SHOW_LIVE_ADS = !__DEV__ && liveAdsRequested && validAppId && validBannerId;
export const ADS_AVAILABLE = Platform.OS !== "web" && (__DEV__ || SHOW_LIVE_ADS);
export const BANNER_UNIT_ID = __DEV__ ? TestIds.BANNER : platformBannerId;
