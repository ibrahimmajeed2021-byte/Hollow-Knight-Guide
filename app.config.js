// Expo reads app.json first, then applies this dynamic configuration.
// Real iOS IDs are public and shared with the JavaScript banner configuration.
// Debug builds still use Google's TEST BANNER UNIT and never serve live ads.
const savedIds = require("./admob.config.json");
const DEMO_ANDROID_APP_ID = "ca-app-pub-3940256099942544~3347511713";

const appIdPattern = /^ca-app-pub-\d{16}~\d{10}$/;

function chooseAppId(value, fallbackId) {
  return value && appIdPattern.test(value) ? value : fallbackId;
}

module.exports = ({ config }) => {
  const iosAppId = chooseAppId(
    process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID,
    savedIds.iosAppId
  );
  const androidAppId = chooseAppId(
    process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID,
    DEMO_ANDROID_APP_ID
  );

  const plugins = (config.plugins || []).map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === "react-native-google-mobile-ads") {
      return [
        "react-native-google-mobile-ads",
        {
          ...plugin[1],
          iosAppId,
          androidAppId,
          // Prevent AdMob app measurement starting before the consent flow.
          delayAppMeasurementInit: true,
        },
      ];
    }
    return plugin;
  });

  return {
    ...config,
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        // Matches the Expo plugin's value; avoids the previous launch crash.
        GADApplicationIdentifier: iosAppId,
        GADDelayAppMeasurementInit: true,
      },
    },
    plugins,
  };
};
