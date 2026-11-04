// Expo reads app.json first, then applies this dynamic configuration.
// Without any environment variables the current working demo build is unchanged.
const DEMO_IOS_APP_ID = "ca-app-pub-3940256099942544~1458002511";
const DEMO_ANDROID_APP_ID = "ca-app-pub-3940256099942544~3347511713";

const appIdPattern = /^ca-app-pub-\d{16}~\d{10}$/;

function chooseAppId(value, demoId) {
  return value && appIdPattern.test(value) && value !== demoId ? value : demoId;
}

module.exports = ({ config }) => {
  const iosAppId = chooseAppId(
    process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID,
    DEMO_IOS_APP_ID
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
