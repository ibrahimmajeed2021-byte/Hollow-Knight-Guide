import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";
import savedIds from "../../admob.config.json";

// The registered iOS App ID and Banner Unit ID are stored in admob.config.json.
// EXPO_PUBLIC_* overrides remain supported for future replacements.
// These IDs are public identifiers, not account passwords.
const iosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || savedIds.iosAppId;
const androidAppId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID;
const iosBannerUnitId = process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID || savedIds.iosBannerUnitId;
const androidBannerUnitId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID;
const liveAdsRequested = process.env.EXPO_PUBLIC_ADMOB_ENABLE_LIVE_ADS === "true";

const platformAppId = Platform.OS === "ios" ? iosAppId : androidAppId;
const platformBannerId = Platform.OS === "ios" ? iosBannerUnitId : androidBannerUnitId;

const validAppId = /^ca-app-pub-\d{16}~\d{10}$/.test(platformAppId || "")
  && !platformAppId?.startsWith("ca-app-pub-3940256099942544~");
const validBannerId = /^ca-app-pub-\d{16}\/\d{10}$/.test(platformBannerId || "")
  && !platformBannerId?.startsWith("ca-app-pub-3940256099942544/");

// Never test your own ad unit on an iPhone with unrestricted live traffic.
// Google supports either a registered physical test device OR app-level Test
// mode for this exact installed app version in AdMob > Settings > Test apps.
// App-level Test mode MUST be turned on in the Google dashboard first; this
// flag cannot enable Google's test mode by itself.
const requestedOwnDebugUnit = process.env.EXPO_PUBLIC_ADMOB_TEST_OWN_UNIT === "true";
const confirmedAppTestMode = process.env.EXPO_PUBLIC_ADMOB_TEST_APP_MODE === "true";
const suppliedTestDeviceId = process.env.EXPO_PUBLIC_ADMOB_DEBUG_TEST_DEVICE_ID || "";
const validTestDeviceId = /^[a-f0-9]{32}$/i.test(suppliedTestDeviceId);

// Defaults to Google's demo ad unit unless explicitly opted in to testing
// your own unit, with either one of Google's supported safeguards configured.
export const DEBUG_OWN_UNIT_TEST = __DEV__
  && Platform.OS === "ios"
  && requestedOwnDebugUnit
  && validAppId
  && validBannerId
  && (validTestDeviceId || confirmedAppTestMode);

// The SDK-level test-device setting is only needed for device-based testing.
// App-level Test mode is enabled by Google based on app/version, not an ID.
export const DEBUG_TEST_DEVICE_ID = DEBUG_OWN_UNIT_TEST && validTestDeviceId
  ? suppliedTestDeviceId
  : null;
export const SHOW_LIVE_ADS = !__DEV__ && liveAdsRequested && validAppId && validBannerId;
export const ADS_AVAILABLE = Platform.OS !== "web" && (__DEV__ || SHOW_LIVE_ADS);
export const BANNER_UNIT_ID = __DEV__
  ? (DEBUG_OWN_UNIT_TEST ? platformBannerId : TestIds.BANNER)
  : platformBannerId;
