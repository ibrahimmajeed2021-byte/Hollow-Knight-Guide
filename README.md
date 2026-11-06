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

## Updating the public guide API

Guide JSON can be regenerated separately when source item data changes:

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
