# Test your own AdMob Banner Unit on an iPhone (no paid traffic)

Google allows a real AdMob **ad unit ID** to show production-style creatives in **TEST MODE** when the physical iPhone is registered as an AdMob test device. It is not safe to request unrestricted live ads or click them on your own device. Requests/impressions/clicks in test mode earn **no revenue**.

The app currently has:
- Your real iOS AdMob App ID: `ca-app-pub-7179160927714394~9893591797`
- Your real Home Banner ad unit: `ca-app-pub-7179160927714394/3004961847`
- A working Google demo banner as the **default** for all Debug builds.
- A new optional mode which uses **your own Home Banner unit** ONLY after the device's 32-character Google AdMob hashed test ID is supplied and opt-in is enabled.

## 1. Find the physical iPhone's Google hashed test-device ID

Launch the currently installed Debug app, open the Home tab so the sample banner loads, and inspect the **native Xcode device console** (not just Metro output).

Look for a message similar to:

```text
<Google> To get test ads on this device, set:
GADMobileAds.sharedInstance.requestConfiguration.testDeviceIdentifiers =
@[ @"2077ef9a63d2b398840261c8221a0c9b" ];
```

That sample ID is an example **only**. You need the 32-character ID logged for your own iPhone. If the message isn't visible, follow Google's [official iOS test-device guide](https://developers.google.com/admob/ios/test-ads) and use the Xcode console / AdMob test-device settings.

## 2. Opt in on your Mac

In the Hollow Knight Guide project, after pulling the GitHub changes, open (or create) `.env.local` and add:

```dotenv
EXPO_PUBLIC_ADMOB_TEST_OWN_UNIT=true
EXPO_PUBLIC_ADMOB_DEBUG_TEST_DEVICE_ID=YOUR_32_CHARACTER_HASH_FROM_XCODE
```

Replace the example with your real 32-character hex string; no quotes, spaces or angle brackets. `.env.local` is gitignored.

The app will **keep showing Google's demo banner** if the switch or test-device hash is missing or malformed. Once both are valid and the UMP consent check allows ad requests, Debug initializes AdMob with `testDeviceIdentifiers: [yourHash]` **before** requesting your ad unit.

If the app cannot gather required consent for the real unit, it does not request that unit. Configure and publish the AdMob **Privacy & messaging** message and your privacy policy as appropriate; do not bypass the consent guard.

## 3. Run the Debug build

The native App ID is already configured. These are JS-only changes so an additional native rebuild is normally unnecessary as long as the installed Debug client already includes AdMob:

```bash
git pull --rebase --autostash origin master
npx expo start --dev-client --clear
```

Reopen your app on the iPhone and navigate to **Home**. You may see a Google **Test mode** label and the application's **YOUR ADMOB UNIT · TEST MODE** label. Only consider the ad safe to click if Google confirms **Test mode** on the creative. If your unpublished app is not ready to serve ads, the banner may remain empty.

Turn OFF the mode by removing the environment variables or setting `EXPO_PUBLIC_ADMOB_TEST_OWN_UNIT=false`, then restarting Metro with `--clear`. All default Debug behaviour returns to the Google demo banner.

## 4. Distinguish this from actual paid adverts

There is **no revenue** from a test iPhone. This only verifies that your actual banner unit is wired correctly. Paid adverts in the eventual public Release build require Google app readiness/app-ads.txt verification, UK/EEA privacy setup, Apple App Store distribution, and production RevenueCat billing. Live adverts must not be tested via personal clicks or artificial impressions.

Sources:
- https://support.google.com/admob/answer/9691433
- https://support.google.com/admob/answer/3342099
- https://developers.google.com/admob/ios/test-ads
