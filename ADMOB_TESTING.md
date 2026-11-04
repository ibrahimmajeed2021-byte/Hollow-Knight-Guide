# Test adverts and Free Mode — Hollow Knight Guide

This integration shows **one Google test banner on the Home screen** in a **Debug** build when the current user's effective access is Free. The Music screen and player are unchanged. No real adverts run, no ad revenue is earned, and Release builds intentionally do **not** request ads yet.

## 1. Install (VS Code terminal)

Open the Hollow Knight Guide root folder:

```bash
git pull origin master
npx expo install react-native-google-mobile-ads
```

The project already includes Google's **official demo AdMob App IDs** in `app.json` through the `react-native-google-mobile-ads` Expo plugin:
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
- `src/ads/AdsContext.jsx`: when the effective user is Free in Debug, attempts UMP consent gathering and initializes demo AdMob ads. With Google's demo IDs, the consent message may be unavailable; the fallback is **strictly limited to Debug demo ads**, and must not be used with production ads.
- `src/ads/AdBanner.jsx`: Google demo banner (free only; disappears for Premium).
- `src/app/_layout.jsx`: wires AdsProvider below PurchasesProvider.
- `src/app/(tabs)/index.jsx`: places a test banner near the bottom of the Home screen.
- `app.json`: adds native AdMob config plugin with demo App IDs.

## 4. Before actual monetization

**Do not release this demo configuration**. To display real adverts, you must first:
1. Create a Google AdMob account and register your **iOS app** (and Android separately if you later build it).
2. Obtain your own **AdMob App ID** (uses `~`) and **Banner Ad Unit ID** (uses `/`).
3. Replace the demo App IDs in `app.json` and switch the banner code to live Ad Unit IDs for Release. Rebuild the native app after changing App IDs.
4. Complete **Google UMP consent** for UK/EEA/Switzerland users before ad initialization and configure a consent message in AdMob. AdMob's production setup must NOT use the Debug-only fallback.
5. If you collect IDFA for tracking/personalized ads, set a tracking-usage description, request iOS ATT permission, and honor the user's choice. Configure SKAdNetwork IDs as needed.
6. Update your privacy policy, App Store privacy declarations, age/content rating, and any relevant Google Play declarations.
7. Test with Google's demo units or register your device as a test device before using your own ad unit. Don't click live ads while testing.
8. Confirm that **Premium users see no ads** before release, including users whose subscription renews, expires, or is refunded.
9. Only then enable production ad loading in `src/ads/AdsContext.jsx` and `src/ads/AdBanner.jsx`.

Official documentation:
- https://docs.page/invertase/react-native-google-mobile-ads/installation/expo
- https://docs.page/invertase/react-native-google-mobile-ads/consent-basics
- https://docs.page/invertase/react-native-google-mobile-ads/first-ad
- https://developers.google.com/admob/ios/test-ads
- https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
