# Test adverts and Free Mode — Hollow Knight Guide

This guide covers **Google demo banner testing in Debug**. Debug builds never request real adverts and earn no revenue. Release adverts can now be enabled only through explicit production configuration and consent checks; see [ADMOB_PRODUCTION_SETUP.md](./ADMOB_PRODUCTION_SETUP.md). The Music screen and player are unchanged.

## 1. Install (VS Code terminal)

Open the Hollow Knight Guide root folder:

```bash
git pull origin master
npx expo install react-native-google-mobile-ads
```

The base `app.json` retains Google's **official demo App IDs** as placeholders. Expo's `app.config.js` now overrides the iOS App ID with the real, public identifier in `admob.config.json` on native rebuild, while keeping the banner's ad-unit ID as Google's **test ad unit** for every Debug build:
- iOS demo App ID: `ca-app-pub-3940256099942544~1458002511`
- Android demo App ID: `ca-app-pub-3940256099942544~3347511713`

The banner uses the package's `TestIds.BANNER`, never a live ad unit.

The AdMob package uses **native code** and the plugin modifies the generated Xcode project. If you previously built the iOS folder before adding the plugin, regenerate the native project to apply the plugin and rebuild:

```bash
npx expo prebuild --platform ios
npx expo run:ios --device
```

**Do not use `--configuration Release`** to test RevenueCat's Test Store API key.

If the Debug app asks for a JavaScript server or shows `No script URL provided`, start Metro from VS Code in another terminal:

```bash
npx expo start --dev-client
```

Keep Metro running while testing on your iPhone. Confirm any native prebuild changes are safe before using `--clean`; `--clean` regenerates the native folder and may erase local native modifications.

After verifying the build, **commit the updated dependency lockfile** so future clones/installations include AdMob:

```bash
git add package.json package-lock.json
git commit -m "Install AdMob native dependency"
git push origin master
```

## 2. Switch between Premium and Free for UI testing

Open **Settings > Explore Premium** in your Debug build.

- Turn **Preview Free Mode** ON to temporarily behave like a Free customer.
- The special themes and extra game-selector tracks become locked.
- Go to the Home tab and scroll to the test banner.
- Turn **Preview Free Mode** OFF to use your actual RevenueCat entitlement again.

This is a **local simulation only**, does not revoke or refund any Test Store purchase, and is compiled out of Release builds.

RevenueCat's Test Store monthly/yearly subscriptions expire automatically on an accelerated schedule. A lifetime test purchase persists; don't delete the app merely to test a free user unless you've backed up your journal/progress.

## 3. What the code does

- `src/purchases/PurchasesContext.jsx`: Debug-only Free preview, keeping real `customerInfo` intact.
- `src/app/premium.jsx`: Free Mode switch.
- `src/ads/AdsContext.jsx`: gathers consent before SDK initialization. The demo-only fallback is restricted to Debug; live ad requests require valid UMP consent eligibility. It also exposes privacy options when required.
- `src/ads/AdBanner.jsx`: Google demo banner in Debug; uses a real unit only in explicitly configured Release builds (free only; disappears for Premium).
- `src/app/_layout.jsx`: wires AdsProvider below PurchasesProvider.
- `src/app/(tabs)/index.jsx`: places a test banner near the bottom of the Home screen.
- `admob.config.json`: contains the registered public real iOS App ID and banner unit ID.
- `app.config.js`: applies the registered real iOS App ID at native build time and keeps an Android demo App ID until Android is set up. Debug still displays test banners only.

## 4. Before actual monetization

The opt-in production integration and full release requirements are now documented in [ADMOB_PRODUCTION_SETUP.md](./ADMOB_PRODUCTION_SETUP.md). Until those steps are complete, **do not activate or ship live ads**. To display real adverts, you must first:
1. Create a Google AdMob account and register your **iOS app** (and Android separately if you later build it).
2. Obtain your own **AdMob App ID** (uses `~`) and **Banner Ad Unit ID** (uses `/`).
3. Set the public ID environment variables and explicit release toggle described in [ADMOB_PRODUCTION_SETUP.md](./ADMOB_PRODUCTION_SETUP.md). Regenerate native code and rebuild after changing App IDs.
4. Complete **Google UMP consent** for UK/EEA/Switzerland users before ad initialization and configure a consent message in AdMob. AdMob's production setup must NOT use the Debug-only fallback.
5. If you collect IDFA for tracking/personalized ads, set a tracking-usage description, request iOS ATT permission, and honor the user's choice. Configure SKAdNetwork IDs as needed.
6. Update your privacy policy, App Store privacy declarations, age/content rating, and any relevant Google Play declarations.
7. Test with Google's demo units or register your device as a test device before using your own ad unit. Don't click live ads while testing.
8. Confirm that **Premium users see no ads** before release, including users whose subscription renews, expires, or is refunded.
9. Only then set `EXPO_PUBLIC_ADMOB_ENABLE_LIVE_ADS=true` for the Release build; the code already supports production ads but intentionally defaults to disabled.

Official documentation:
- https://docs.page/invertase/react-native-google-mobile-ads/installation/expo
- https://docs.page/invertase/react-native-google-mobile-ads/consent-basics
- https://docs.page/invertase/react-native-google-mobile-ads/first-ad
- https://developers.google.com/admob/ios/test-ads
- https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
