# Test your own AdMob Banner Unit on an iPhone (no paid traffic)

Google allows a real AdMob **ad unit ID** to show production-style creatives in **TEST MODE** when either your physical iPhone is registered as a test device **or** the exact installed app version is added under **AdMob > Settings > Test apps**. Do not request unrestricted live ads or click them on your own device. Requests/impressions/clicks in test mode earn **no revenue**.

The app currently has:
- Your real iOS AdMob App ID: `ca-app-pub-3058832476599990~1514809839`
- Your real Home Banner ad unit: `ca-app-pub-3058832476599990/3832842252`
- A working Google demo banner as the **default** for all Debug builds.
- Optional mode using **your own Home Banner unit** with explicit opt-in plus either Google app-level Test mode (simpler; no device ID), or your iPhone's 32-character hashed test-device ID.

## 1. Easiest: Use AdMob's app-level Test mode (no iPhone ID)

1. Sign in at https://admob.google.com.
2. Go to **Settings > Test apps > Add test app**.
3. Select **Hollow Knight Guide**.
4. Enter the **installed app's actual version**, normally `1.1.0` according to the current `app.json`. **The app version must match the build on your iPhone**; rebuilding may be necessary if the installed native app was generated with a different version.
5. Toggle **Test mode ON** and save/confirm the app version.
6. Wait for the test status to take effect before trying your real ad unit. If unsure, keep Google's demo banner on.

Then, in your project's git-ignored `.env.local`, add:

```dotenv
EXPO_PUBLIC_ADMOB_TEST_OWN_UNIT=true
EXPO_PUBLIC_ADMOB_TEST_APP_MODE=true
```

Do **not** set `EXPO_PUBLIC_ADMOB_TEST_APP_MODE=true` until Google's dashboard has confirmed Test mode is ON for the matching installed version. Setting it in Expo does not enable Google's server-side protection. The chosen app version is temporarily demonetized by Google. Your own real AdMob banner is only requested if UMP says ad requests are permitted.

## 2. Alternative: Find the iPhone's hashed test-device ID (optional)

Launch the currently installed Debug app, open the Home tab so the sample banner loads, and inspect the **native Xcode device console** (not just Metro output).

Look for a message similar to:

```text
<Google> To get test ads on this device, set:
GADMobileAds.sharedInstance.requestConfiguration.testDeviceIdentifiers =
@[ @"2077ef9a63d2b398840261c8221a0c9b" ];
```

That sample ID is an example **only**. You need the 32-character ID logged for your own iPhone. If the message isn't visible, follow Google's [official iOS test-device guide](https://developers.google.com/admob/ios/test-ads) and use the Xcode console / AdMob test-device settings.

## 3. Opt in on your Mac (only if using the device-ID method)

In the Hollow Knight Guide project, after pulling the GitHub changes, open (or create) `.env.local` and add:

```dotenv
EXPO_PUBLIC_ADMOB_TEST_OWN_UNIT=true
EXPO_PUBLIC_ADMOB_DEBUG_TEST_DEVICE_ID=YOUR_32_CHARACTER_HASH_FROM_XCODE
```

Replace the example with your real 32-character hex string; no quotes, spaces or angle brackets. `.env.local` is gitignored.

With the **device-ID method**, the SDK applies `testDeviceIdentifiers: [yourHash]` before requesting your ad unit. With the **app-level method**, Google applies Test mode server-side for the selected app version; Expo does not supply a device hash. The app defaults to Google's demo banner unless explicit opt-in and at least one testing method is configured.

If the app cannot gather required consent for the real unit, it does not request that unit. Configure and publish the AdMob **Privacy & messaging** message and your privacy policy as appropriate; do not bypass the consent guard.

## 4. Run the Debug build

The native App ID is already configured. These are JS-only changes so an additional native rebuild is normally unnecessary as long as the installed Debug client already includes AdMob:

```bash
git pull --rebase --autostash origin master
npx expo start --dev-client --clear
```

Reopen your app on the iPhone and navigate to **Home**. You may see a Google **Test mode** label and the application's **YOUR ADMOB UNIT · TEST MODE** label. Only consider the ad safe to click if Google confirms **Test mode** on the creative. If your unpublished app is not ready to serve ads, the banner may remain empty.

Turn OFF the mode by removing the environment variables or setting `EXPO_PUBLIC_ADMOB_TEST_OWN_UNIT=false`, then restarting Metro with `--clear`. All default Debug behaviour returns to the Google demo banner. **If you switch off AdMob's app-level Test mode, turn off this local mode first; never test your own ad unit without Google test protection.**

## 5. Distinguish this from actual paid adverts

There is **no revenue** from a test iPhone. This only verifies that your actual banner unit is wired correctly. Paid adverts in the eventual public Release build require Google app readiness/app-ads.txt verification, UK/EEA privacy setup, Apple App Store distribution, and production RevenueCat billing. Live adverts must not be tested via personal clicks or artificial impressions.

Sources:
- https://support.google.com/admob/answer/17080939
- https://support.google.com/admob/answer/9691433
- https://support.google.com/admob/answer/3342099
- https://developers.google.com/admob/ios/test-ads
