# Hollow Knight Guide — Hallownest & Pharloom Field Guide

A fan-made companion for **Hollow Knight** and **Hollow Knight: Silksong** built with Expo and React Native. It is an **independent, unofficial project**, not endorsed, published or affiliated with Team Cherry.

## What the app does

- Guides and locations for bosses, charms, tools, crests, collectibles and Silksong wishes.
- On-device progress tracking for boss defeats, item pickups and completed quests.
- A home dashboard with real completion totals, cross-guide search, and shortcuts to unfinished entries.
- Charms and crest/tool loadout builders, personal notes and a local photo journal.
- Map previews and source links, with graceful offline/image-error fallbacks.
- Themes, accessibility controls, and a music player.
- Optional Premium themes and selector extras; the main guide remains free.

The **Progress** screen keeps its full completion breakdown, and checkmarks use the original journal keys. Changing screens does not reset saved progress.

## Expanded completion guide

The app now tracks boss variants, Dream bosses, Warrior Dreams and Godhome
encounters in Hollow Knight, alongside all 46 Grubs, 16 Mask Shards, 9 Vessel
Fragments, 6 Pale Ore, extra Charm Notches, spells, movement abilities,
Nail Arts, Dreamers, keys, trials and all five Pantheons.

In Silksong, the guide includes all 30 Fleas, main-story objectives, keys,
Bellhome upgrades and seven mementos, in addition to the existing boss,
tool, crest, collectible and wish lists. Main-story objectives and wishes
share the Quests tab, with a category filter.

All added checklist entries retain local journal keys based on their names;
existing entries and their saved completion state are unaffected. Existing
boss and tool information still loads from your bundled data or public JSON
API, but old JSON snapshots cannot hide newer bundled entries.

This is a **guide-tracked checklist**, not an official achievement percentage.
Some content is optional, repeatable or mutually exclusive. See
[CONTENT_AUDIT.md](CONTENT_AUDIT.md) for source references, coverage,
known limitations and the difference between unique content and variants.

Run the completion data regression check:

```bash
npm run test:guide
npm run test:progression
```

## Recommended chronological order

Bosses, charms, tools, crests, collectibles and quests follow a recommended
in-game progression order across both games. Because each game is non-linear,
optional areas and late rewards can be found at different times. The source
data and progress keys are unchanged; the lists are sorted after bundled or
remote API data is loaded. Home's next-unfinished suggestions use the same
ordering, including the mixed Silksong Items list.

Read [progression ordering assumptions and sources](PROGRESSION_ORDER.md).
Run `npm run test:progression` to verify all curated entries and key ordering
regressions before testing on device.

## Run and test

Install dependencies in your local clone:

```bash
npm install
npx expo start --dev-client --clear
```

Use an **existing Expo development-client build** to open the app. Because this project has native RevenueCat and AdMob dependencies, Expo Go is not a substitute for the full development client.

### Home and trust overhaul checks

1. Select **Hollow Knight**. Check the hero progress bar, boss/charms counts, item search and next-unfinished shortcuts.
2. Search for a boss or charm, tap its result, confirm the correct tab opens and the list filters by that name. Mark it done and return Home to check that counts update.
3. Switch to **Silksong**. Confirm the dashboard now includes items and quests, then test searches for a boss, a tool, a Mask Shard and a wish. Verify all results land in their matching tab.
4. On **Settings → About & support**, open **About & source credits**, then **Privacy notice**; test links and Back navigation.
5. Expand a wiki map while offline. Its acquisition text and wiki credits should still be visible. When a remote preview fails, a clear placeholder and Retry button should appear.
6. Open Premium in the development client and check its offering and Restore Purchases buttons. For a production build, technical SKU/configuration error text should not appear in the UI.
7. Switch games more than once. Confirm the short loading animation and game-selector music still work and saved progress remains independent for each game.
8. Test large text/high contrast/reduced motion and the progress backup/restore flow.

The app code changes do not require regenerating the static guide API or rebuilding an existing **development client**. Native app config changes or new native modules would still require a new build.

## Free online access and Premium offline mode

Free users need an active internet connection to the guide service. An
app-wide connection gate checks `/api/index.json` on launch, periodically,
and when the app returns to the foreground. If it cannot reach the guide,
Free users see a connection-required screen with a Retry button. Switching
off Wi-Fi does not count as offline if cellular data still works. A service
outage can also trigger the message; the wording explains this.

Premium subscriptions and lifetime purchases use the existing RevenueCat
entitlement `hollow_knight_guide_pro`. Offline Premium uses locally
bundled artwork, guide data and music plus cached API information. A locally
recorded positive entitlement is a backup for RevenueCat's own offline
CustomerInfo cache; time-limited subscriptions are not extended past their
last known expiration without verification. Premium purchases require an
internet connection the first time.

When a Free user loses connection, guide screens are covered and both
selector/loading music and the music player are stopped/paused.

Test the policy with `npm run test:offline`. On a device, use the Premium
screen's **Preview Free Mode** (Debug only), disable both Wi-Fi and cellular
data, wait for the check, then reconnect. Repeat with Premium active.
The service ping checks every 15 seconds, with a 6.5-second timeout.
It does not test whether an AdMob ad actually loaded or can be shown.

The network gate is a JavaScript feature and does **not** require a new native
build for an existing development client. Production app updates still need
to be distributed through the normal release process.

**Important:** An app cannot run before its native icon/splash and essential
boot code are available locally. Premium offline operation also needs data
and media on the device. Accordingly the app is API-*first*, not a remote-only
binary. The static API controls the online images and the locally bundled
versions are fallback media. Audio has bundled offline fallbacks. An optional licensed streaming URL
manifest can select online audio through `api/media.json`, but do not publicly
rehost copyrighted game recordings without distribution rights.

## Usability and reliability: Stage 3

Stage 3 focuses on navigation, testing and keeping the existing free guide
reliable rather than adding more features.

**Fixed universal Close:** A large, high-contrast **X** stays pinned in the
top-right app header on Settings, Premium, Companion, Planner, Customisation,
secondary progress pages, loadouts, privacy and other secondary screens.
Unlike an in-page "Back" text link, it remains visible while scrolling.
It returns to the previous screen when history exists, otherwise Home.
On the six main guide tabs the same header position remains Settings, not X.
The native tab bar hides automatically on every secondary route; main guide
tabs keep their standard navigation. The redundant bottom Back on the
Premium page has been removed.

**Search and deep links:** Bosses, Items, Quests and Collectibles now provide
an accessible one-tap clear control on iOS/Android/web. When a specific entry
is opened from Home or the progression planner, any stale "completed only"
filter that would hide it is reset. Existing category selection and journal
keys remain unchanged.

**Progress safety:** Saved per-game journals are hydrated before their
interactive screens are shown, and rapid progress changes are written to
AsyncStorage sequentially. Invalid saved shapes fall back to empty safe
values without discarding well-formed notes or photos. Resetting progress
now requires an explicit inline confirmation on both mobile and web and
does not remove photo journal entries, notes or loadouts.

**Free versus Premium offline:** Free accounts with no confirmed connection
cannot briefly see cached content before the saved Premium entitlement has
finished loading. Premium accounts verified on this device continue to work
offline as before. The offline gate explains when saved Premium status is
still being checked.

Run `npm run test:qa-stage3` and the existing regression scripts. Source
checks do not replace a successful Expo build or the device walkthrough.
Manually test Home, Settings and the top X, game switching, quest/item
deep links, photo and progress checklists, Free ads, Free offline
restriction, Premium offline use, and accessibility at increased text size.
No new native dependencies or server API endpoints are required.

## Visual consistency: Stage 2

Stage 2 is a presentation and accessibility pass with no change to game data
or purchase entitlements. The neutral `src/ui/design-system.js` defines
shared spacing, corner radii, readable typography sizes, 48-point minimum
control targets, standard motion durations and safe progress percentages.
**Theme colours remain in SettingsContext**; no Free guide features are
removed or Premium-only effects added to the core interface.

Updated components include:

- **Text, headings and controls:** one scale for titles and labels; the
  existing user font-size preference continues to apply. Buttons, filter
  chips and common links use larger minimum touch targets and press feedback.
- **Cards:** Home dashboard, Progress and Premium Companion now use the same
  reusable `SurfaceCard`; both games' boss, charm, tool and collectible
  cards share tighter dimensions and clearer expanded-detail separation.
- **Search and lists:** Bosses, Items, Quests and Collectibles use the same
  informative `EmptyState` component when searches or filters have no match.
- **Motion:** existing Reduce Motion settings still prevent entry-card
  animation, and the progress bar uses clamped percentages with the shared
  animation timing. High Contrast remains honoured by the core controls.
- **Other screens:** Music, Settings, Premium, Guided Mode, the progression
  planner and the customisation studio use consistent dimensions and headings.

Test with `npm run test:ui-stage2`, plus the existing
`npm run test:ui-stage1`, `npm run test:premium-companion`,
`npm run test:guide` and `npm run test:progression`.
These source checks do not compile JSX or replace testing in the installed
iOS development client. Verify the normal Free and Premium modes in both
games, light/dark themes, High Contrast, large text and Reduce Motion.

## Interface polish: Stage 1

Home now prioritises overall guide progress, search and two next-step cards.
A compact third shortcut still opens the current game's collectibles or
Silksong quests. Loadouts stay accessible through a single toolkit row.
Both Free and Premium show one quiet **Companion** entry, replacing the
previous three independent Premium shortcut buttons.

The dedicated `/companion` hub keeps Premium's guidance, planner and
customisation together and shows existing goal progress when applicable.
For Free users, it explains the value of the paid experience **without**
hiding or degrading the full guide. Locked Premium tools lead to the
existing RevenueCat paywall; purchase and restore behaviour is unchanged.

Settings is now organised into five discoverable accordion categories:
**Appearance & themes**, **Accessibility & feedback**, **Audio**,
**Guide preferences**, and **Data & support**. They start collapsed,
and the full theme gallery expands only when requested. All earlier settings,
audio controls, backups, privacy options and switch-game navigation remain,
with a confirmation tap before resetting preferences.

The paywall groups paid benefits into three plain-language areas and clearly
states which content stays free. No new native dependencies or public API
endpoints were added, and the existing progress/storage keys are unchanged.

Run `npm run test:ui-stage1` for structural checks; finish verification on
the device for both Hollow Knight and Silksong in Free and Premium previews.
This script checks files and navigation contracts but does **not** compile JSX
or replace a device visual test.

## Premium companion: guided exploration, planner and customisation

Three optional Premium features are available from **Settings → Premium
companion tools** and the **Premium companion** section on Home:

- **Spoiler-free Guided Mode** (`/guided`): hides later boss, item and
  collectible names, images, rewards and locations in the regular guide.
  Three sensitivity levels reveal roughly 3, 8 or 18 upcoming entries per
  category based on progress in that category. Completed entries stay
  visible. Users can manually reveal any obscured card. Home search only
  displays visible entries when Guided Mode is active. Hint buttons
  deliberately reveal increasingly specific directions.
- **Smart progression planner** (`/planner`): choose a featured goal or
  search for any existing boss, item or collectible. The planner builds a
  progress-aware checklist using curated *suggested preparations*. Completion
  buttons use the existing journal keys, so guide totals stay consistent.
  Detailed location hints require a tap, and unrevealed steps remain masked
  in Guided Mode. The planner is not a speedrun route, exhaustive dependency
  solver or claim that every suggested step is mandatory in a non-linear game.
- **Premium customisation studio** (`/premium-studio`): choose from six
  accessible accent presets; comfortable/compact cards; show or hide list
  thumbnails; adjust theme artwork intensity; turn on gentle, opt-in ambient
  motion (respects Reduce Motion); and choose which Home sections appear.

All three options are Premium-gated through the existing RevenueCat
entitlement. Guided Mode defaults **off** and every customisation preference
defaults to the original look and Home layout. Saved progress, photos, notes,
loadouts, ads, the music player and other screens retain their existing
behaviour while these features are off. A completed journal entry is never
deleted by Guided Mode; individual reveals and planner goals are saved
separately per game in AsyncStorage.

Run `npm run test:premium-companion` for the spoiler and planner regressions.
No new API endpoints or native dependencies are required for this feature
update. The planner uses already-loaded API guide content wherever available
and gracefully works with bundled data when Premium is offline.

## Premium location themes

Settings → Appearance includes **13 Premium appearance styles** with live
preview tiles, plus the original free Classic style. The Hollow Knight
selection contains Hallownest, City of Tears, Voidheart, Godhome, Greenpath,
Crystal Peak and White Palace. Silksong offers Pharloom, Citadel of Song,
Moss Grotto, Deep Docks, Bilewater and Songclave.

Every theme has a readable light and dark palette. Premium themes also add
a subtle, location-inspired wallpaper and game-art emblem throughout the
guide, on the Home hero and on the game selector/loading transitions.
The art is **atmospheric**, not an exact map screenshot. Enable High Contrast
to disable decorative screen wallpaper while keeping theme selection and
the high-contrast text colours.

Premium entitlement is enforced in Settings. Free accounts see locked theme
tiles that open the paywall. Your selected theme is saved in the existing
settings storage, preserved if Premium expires, and restored when Premium is
reactivated. The default theme remains free.

`npm run build:api` now writes `api/media.json` with `themes[themeId]`
backgroundImageUrl and motifImageUrl fields. Existing game artwork is
staged to `public/guide-icons` for the online URLs. Theme artwork always
retains the equivalent local asset so purchased Premium themes work offline;
online URLs can be changed by editing the media manifest without a
new native build, but adding entirely new theme IDs requires an app update.

Check theme integrity with `npm run test:themes`, then run
`npm run test:api-images` before publishing the API.

## API-driven icons and location images

The public JSON endpoints now include `iconUrl` for every boss, charm,
tool and collectible. Entries with a secondary image also expose
`iconFallbackUrl`, and boss location records expose `imageUrl`.
The app reads the API-provided `iconUrl` on the Home screen and in guide
lists, while keeping bundled artwork available offline.

Run `npm run build:api` to generate the JSON and stage bundled images under
`public/guide-icons/`. When you export the web build these files are copied
into `dist/guide-icons/` alongside the static JSON. Both are then deployed
to the same Surge domain. Use `npm run test:api-images` to validate all
published JSON references against staged image files locally.

To provide authorised streaming audio (optional), create a JSON file
outside the repository such as `licensed-audio.json`:

```json
{
  "loading": {
    "hollow": "https://your-authorised-host.example/hollow-loading.mp3"
  },
  "tracks": {
    "Hollow Knight Title Theme": "https://your-authorised-host.example/title.mp3"
  }
}
```

Supply it on build:
`GUIDE_LICENSED_AUDIO_MANIFEST=licensed-audio.json npm run build:api`.
The URLs must use HTTPS and you must have permission to stream that media.
No music files are uploaded by default. The app uses API audio URLs when
available online; Premium uses bundled audio offline.

The `media.json` endpoint now controls both games' Home hero portraits and
background artwork. These assets are staged into `public/guide-icons/` along
with the artwork used by item endpoints.

After the initial app code update, changing an icon URL in an API JSON
response can change the online icon without rebuilding the native app.
Re-deploy the site after changing your generated JSON or images, and
restart the app if you need it to refresh cached API data.

## Updating the public guide API

Guide JSON and static artwork are regenerated together when source data changes:

```bash
npm run build:api
npx expo export --platform web
npx surge ./dist hollow-knight-guide-ibrahim.surge.sh
```

Pushing code to GitHub alone does **not** update the public Surge deployment. Check the latest JSON on your own Surge endpoint when updating content.

## Source attribution and intellectual property

- Gameplay information and location references are adapted from [Hollow Knight Wiki](https://hollowknight.wiki/w/Main_Page). Wiki article text is community contributed; **individual images and media may have different copyright restrictions**. Location cards link to the source file pages where available.
- Hollow Knight and Silksong are games by [Team Cherry](https://www.teamcherry.com.au/games). Their art, game imagery and music are not claimed as original assets of this guide.
- Musical compositions are by Christopher Larkin.

**Important before distributing or monetising:** review permissions to reproduce or stream game graphics and recordings, and verify compliance with platform app-review rules. An attribution or fan-project notice does not itself grant permission.

## Privacy and support

Read the [public privacy notice](PRIVACY.md). A matching in-app privacy screen is reachable from Settings. The notice covers on-device checklist data, photo files, optional ads/purchases and third-party content requests; review it again for the exact production build.

Support: **apolohcr2@outlook.com**

## Project structure

- `src/app/(tabs)/` — main Home, Bosses, Items/Charms, Quests, Music and Progress navigation.
- `src/app/about.jsx` and `src/app/privacy.jsx` — attribution and privacy pages.
- `src/components/hollow/` — reusable cards, headers and map-preview components.
- `src/games/`, `src/data/` — game data and configuration.
- `scripts/build-api.mjs` and `public/api/` — public static JSON API generator and snapshots.
