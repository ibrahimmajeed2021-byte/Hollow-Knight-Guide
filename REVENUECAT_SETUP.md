# RevenueCat setup — Hollow Knight Guide

This Expo Router / React Native app uses RevenueCat's **Test Store** while developing.

## 1. Install the native packages (from the VS Code terminal)

```bash
git pull origin master
npm install --save react-native-purchases react-native-purchases-ui
```

Both packages are native modules. **Rebuild the installed iPhone app** after installing them:

```bash
npx expo run:ios --configuration Release --device
```

Do not use Expo Go to test real native purchases. No need to copy RevenueCat's sample `App()`; this project uses `src/app/_layout.jsx`.

If Xcode reports missing pods, from your project root run `npx pod-install ios` and rebuild. If Xcode 27 reports an iOS deployment-target CocoaPods issue, see RevenueCat's React Native installation page for its specific `post_install` workaround; don't change unrelated Podfile settings preemptively.

## 2. Configure RevenueCat Test Store

In the RevenueCat dashboard:

1. **Product catalog > Products > Test Store**: create three products:
   - `monthly` — auto-renewable, 1 month; test price **£1.99**.
   - `yearly` — auto-renewable, 1 year; **choose the yearly price you want**.
   - `lifetime` — **non-consumable / one-time**, test price **£7.99**.
2. **Product catalog > Entitlements**: create `hollow_knight_guide_pro`.
3. Attach **all three** products to that entitlement. Buying **any one** should unlock Premium.
4. **Product catalog > Offerings**: create an offering (for example `default`). Make it the **Current** offering. Add the three products as packages. Use the built-in monthly, annual and lifetime package types where available; custom package identifiers also work.
5. **Paywalls**: create a paywall for the Current offering and publish it. The app's `View Premium paywall` button uses this dashboard design.
6. Optionally configure **Customer Center** in the dashboard to let paying customers manage subscriptions and get help.

RevenueCat may have created example products when you signed up. Check their IDs before creating duplicates. Product identifiers in this guide are the requested names; the app itself reads the available packages and localized price strings from RevenueCat rather than hard-coding prices.

## 3. App files

- `src/purchases/PurchasesContext.jsx`: configures RevenueCat once, uses Test Store key, fetches customer info and offerings, listens for entitlement updates, handles purchases/restore/paywall/Customer Center.
- `src/app/premium.jsx`: Premium screen, purchase options, native paywall, restore and Customer Center.
- `src/app/_layout.jsx`: wraps the app in `PurchasesProvider`.
- `src/settings/SettingsContext.jsx`: prevents expired/non-premium customers from using premium theme styles and remembers their previous selection.
- `src/app/settings.jsx`: Premium entry and padlocks for locked themes and selector tracks.
- `src/sound/game-sounds.js` and `src/components/hollow/loading-screen.jsx`: free random selector playback uses only tracks 0 and 1; Premium uses all tracks.

**The separate music player is unchanged**, and high contrast, font sizing, light/dark/automatic appearance and core game guide remain free.

## 4. Minimal API examples

```js
import Purchases from "react-native-purchases";

const info = await Purchases.getCustomerInfo();
const isPremium = Boolean(info.entitlements.active.hollow_knight_guide_pro);

const offerings = await Purchases.getOfferings();
const selectedPackage = offerings.current?.availablePackages?.[0];

if (selectedPackage) {
  try {
    const result = await Purchases.purchasePackage(selectedPackage);
    const unlocked = Boolean(
      result.customerInfo.entitlements.active.hollow_knight_guide_pro
    );
    console.log("Unlocked:", unlocked);
  } catch (error) {
    if (!error.userCancelled) console.error(error);
  }
}

const restoredInfo = await Purchases.restorePurchases();
```

```js
import RevenueCatUI from "react-native-purchases-ui";

await RevenueCatUI.presentPaywallIfNeeded({
  requiredEntitlementIdentifier: "hollow_knight_guide_pro",
});
await RevenueCatUI.presentCustomerCenter();
```

The app's actual implementation handles errors in UI state, updates entitlement state through the SDK listener, refreshes CustomerInfo on foreground, and uses RevenueCat's Current offering to drive the available purchase buttons.

## 5. How to test on your iPhone

1. Build/install the app after npm install.
2. Open your game's **Settings > Explore Premium**.
3. Confirm the three product buttons and their prices appear. If not, check that the offering is set to **Current** and the products belong to your Test Store.
4. Purchase monthly using the Test Store, then confirm `hollow_knight_guide_pro` becomes active. Go back to Settings: both special themes and all selector tracks should unlock.
5. Test restore, yearly and lifetime on fresh/appropriate test customers; check test subscription expiry and entitlement updates. Test Store purchases never charge real money.
6. Check the **Customers** screen in RevenueCat to verify test purchases.
7. On error, inspect Metro/Xcode logs and the visible error on the Premium screen. Verify that you installed the native packages and rebuilt.

## 6. Before production

The source contains a **public Test Store** key. Never use that key for actual App Store purchases. After joining the Apple Developer Program and configuring App Store Connect products, set the appropriate platform-specific *public* SDK key in the build environment:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_your_public_ios_key
# For Android builds:
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_your_public_android_key
```

These environment variables are embedded in the app at build time; **they are not secrets**. Do not put RevenueCat secret API keys in the app.

Set up App Store Connect products with the correct types, subscription group, prices, localization and agreements, and attach them to the same entitlement in RevenueCat. Confirm the production offering and paywall, test Apple Sandbox, restore, expiration and refund behavior, and rebuild for release.

RevenueCat docs:
- https://www.revenuecat.com/docs/getting-started/installation/expo
- https://www.revenuecat.com/docs/projects/configuring-products
- https://www.revenuecat.com/docs/tools/paywalls/displaying-paywalls
- https://www.revenuecat.com/docs/tools/customer-center/customer-center-react-native
- https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store
