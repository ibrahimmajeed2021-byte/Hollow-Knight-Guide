# Real AdMob adverts — Hollow Knight Guide

This project now supports **Google demo banners in Debug** and **opt-in, non-personalized real banners in Release**. No real ad request is made unless IDs and the explicit release toggle have been provided.

## 1. Registered iOS AdMob IDs

The replacement iOS app and Home Banner have been created in the user's new AdMob account. Their public identifiers are committed to the repository in `admob.config.json`:

- **App ID**: `ca-app-pub-3058832476599990~1514809839`
- **Home Banner ad unit ID**: `ca-app-pub-3058832476599990/3832842252`

The App ID is used by the native iOS Google Mobile Ads SDK. The Banner ad unit is used for the Home screen's ad request. **Do not interchange them.** Debug builds continue using Google's official test ad unit.

No AdMob account password, payment information, or secret is stored in source code. The public IDs were supplied by the app owner.

## 2. Configure privacy BEFORE attempting live ads

In AdMob go to **Privacy & messaging > European regulations**, add this app and create/publish an appropriate consent message. Google requires a certified CMP / IAB TCF implementation for personalized ad serving in the UK/EEA/Switzerland, and consent can be necessary even for non-personalized ads or local storage.

The app uses Google's **User Messaging Platform (UMP)** through `AdsConsent.gatherConsent()` before AdMob SDK initialization. In Release builds it only requests an ad when UMP reports `canRequestAds === true`. Errors or unknown consent status fail closed. If Google's `privacyOptionsRequirementStatus` is `REQUIRED`, Settings shows **Manage ad privacy choices** so users can update their choices.

- `app.config.js` sets `delayAppMeasurementInit: true` and the corresponding iOS Info.plist setting.
- The current banner uses `requestNonPersonalizedAdsOnly: true`. This does **not** remove the need for consent or a proper privacy policy.
- If you later implement personalized tracking with IDFA, add the correct ATT usage text and permission flow, and honor the user's choice.
- Review the privacy policy, App Store privacy answers, age rating, ad content policies and optional SKAdNetwork configuration before submission.

## 3. Enable live adverts only after release readiness

**The iOS App ID and Home Banner ID are already in `admob.config.json`; no further ID copying is required.** Expo reads this shared file for native configuration and for the banner in JavaScript. In a future Release build, once Google app verification, GDPR/UK consent, RevenueCat production billing, and intellectual-property requirements are complete, explicitly opt in to live ads.

For a local build, put the following in your git-ignored `.env.local` (or export it into the terminal before building). For EAS, set it in your production environment instead:

```dotenv
EXPO_PUBLIC_ADMOB_ENABLE_LIVE_ADS=true
```

**Do not set this flag yet.** The default is safe: live ads are disabled.

The optional `EXPO_PUBLIC_ADMOB_IOS_APP_ID` and `EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID` environment variables still allow you to override the registered IDs later. The optional Android variables are `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID` and `EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID`; first create a separate Android app and unit in AdMob.

How it works:
- **Debug** (`__DEV__ === true`): always uses Google's safe demo ad unit, even if real IDs are present.
- **Release**: requests real ads only when `EXPO_PUBLIC_ADMOB_ENABLE_LIVE_ADS=true` **and** the platform's valid real App ID **and** valid real Banner ad unit ID are present.
- If anything is missing, adverts are disabled instead of accidentally requesting live ads with demo IDs.
- If RevenueCat reports active Premium, the banner never mounts.
- App IDs are applied at native build time by `app.config.js` and require prebuild/rebuild when changed.
- `src/ads/ads-config.js` selects the banner unit for the JavaScript bundle.

**IMPORTANT**: There is also a separate RevenueCat release requirement. A Test Store `test_` SDK key cannot be used for App Store Release purchases. Before shipping, configure real App Store Connect in-app purchases plus an `appl_` public RevenueCat SDK key (`EXPO_PUBLIC_REVENUECAT_IOS_API_KEY`). Do not attempt to publish with Test Store billing.

## 4. Verify the native App ID before building

Run in the project root with the intended production environment variables loaded:

```bash
npx expo config --type public
npx expo prebuild --platform ios
plutil -extract GADApplicationIdentifier raw -o - ios/HollowKnightGuide/Info.plist
```

The final command must print `ca-app-pub-3058832476599990~1514809839`, **not** Google's demo App ID, before you make a Release build.

When your App Store billing and privacy flows are ready, a local iPhone Release build can be created with:

```bash
npx expo run:ios --configuration Release --device
```

**Do not use this Release command just to test RevenueCat's Test Store.** Keep using `npx expo run:ios --device` plus Metro for current development.

## 5. Publication and app-ads.txt

Adding an **unpublished** app to AdMob is useful for setup, but it does not guarantee live impressions or revenue.

Before full serving:
1. Publish the iOS app to the App Store and link the listing in AdMob.
2. Add your developer website URL to the App Store listing.
3. Serve Google's personalized `app-ads.txt` snippet at the root of that website (for example `https://example.com/app-ads.txt`).
4. Complete AdMob's app-ads.txt verification and app-readiness review.
5. Confirm live ad requests and policy/consent compliance after approval.

**Rights:** Before publicly monetizing an unofficial Hollow Knight / Silksong guide, ensure you have permission or a valid license to distribute any third-party music, game artwork, logos, screenshots, or other copyrighted content contained in the app. Also confirm applicable publisher fan-content policies and app-store IP rules.

## 6. Current implementation

- `admob.config.json`: public registered iOS App ID and Home Banner ad unit ID (single source of truth).
- `app.config.js`: applies the registered native iOS App ID and delays measurement.
- `src/ads/ads-config.js`: chooses Debug demo vs Release live units, validates format and opt-in.
- `src/ads/AdsContext.jsx`: UMP consent, Premium gating, SDK initialization and privacy options.
- `src/ads/AdBanner.jsx`: Home banner (test in Debug, real in configured Release, none for Premium).
- `src/app/settings.jsx`: user-accessible privacy choices when required.
- Home banner placement and the music player have not been changed.

Official references:
- https://support.google.com/admob/answer/9989980
- https://support.google.com/admob/answer/14538460
- https://support.google.com/admob/answer/7666519
- https://docs.page/invertase/react-native-google-mobile-ads/installation/expo
- https://docs.page/invertase/react-native-google-mobile-ads/european-user-consent
- https://docs.expo.dev/workflow/configuration/
