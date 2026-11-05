# Item acquisition locations and wiki map previews

## Silksong collectibles, wishes and abilities (November 2026 update)

The **100% Completion → Collectibles** screen now contains all **150**
existing entries across eight groups. Each row displays a group-specific
artwork thumbnail, and expanding a row shows **Where to find it**:

| Group | Entries | Mapped wiki reference files |
|---|---:|---:|
| Mask Shards | 20 | 15 |
| Spool Fragments | 18 | 15 |
| Memory Lockets | 20 | 17 |
| Silk Hearts | 3 | 2 |
| Pale Oil | 3 | 3 |
| Craftmetal | 8 | 8 |
| Wishes | 54 | 9 |
| Skills & Abilities | 24 | 2 |
| **Total** | **150** | **71** |

The remaining entries show **category artwork** rather than a fabricated
location map. In particular, wish entries can display a Wishwall illustration
and ability entries an ability-category illustration. The caption explicitly
distinguishes representative artwork from a specific pickup location.

**Important**: The original wiki graphics are copyrighted game assets, and
the app links to the original image and file credits. Preview availability,
image embedding permission, the correctness of all entries on a live device,
and publication rights are **not guaranteed**. Confirm commercial reuse rights
before App Store release. If remote previews are not allowed, remove them and
use the source links only.

### Files

- `src/data/silksong-collectible-guides.js`: explicit mapping between our
  checklist numbers and the wiki file names. Memory Locket wiki map number
  differs from the checklist number: **do not generate names using the raw
  collectible index**.
- `src/app/(tabs)/progress/collectibles.jsx`: image thumbnails, location map
  previews, wiki credits and links on each expanded row.
- `src/games/game-context.jsx` and `src/games/config.js`: download and cache
  `silksong/collectibles.json` with the original bundled 150-entry fallback.
- `src/app/(tabs)/progress/index.jsx`: completion totals use fetched entries.
- `scripts/build-api.mjs`: exports all 150 entries with `wikiUrl`,
  `artworkUrl`, `artworkSource`, plus optional `locationMapUrl`,
  `locationMapSource`, `locationMapLabel`.
- `public/api/silksong/collectibles.json`: regenerated JSON, with existing
  locations and progress names preserved.

### Update and test

From VS Code:
```bash
git pull --rebase --autostash origin master
npx expo start --dev-client --clear
```

Open **Silksong → Progress → Collectibles**. Expand a Mask Shard, Memory
Locket, Wish and Ability to check each type of image. This is JavaScript-only,
so an existing iOS development-client build does not need rebuilding.
Standard Expo Go is not suitable because the full app includes native
RevenueCat and AdMob modules.

When ready to publish the static API to your existing Surge account:
```bash
npm run build:api
npx expo export --platform web
npx surge ./dist hollow-knight-guide-ibrahim.surge.sh
```

Updating GitHub is not the same as deploying Surge. The app will show the
bundled data until the static API is deployed and successfully fetched.

---


The **Charms** tab in Hollow Knight and **Tools & Crests** tab in Silksong
now share an expanded **Where to find it** section with:

- Acquisition directions for all **44 Hollow Knight charms**.
- Existing acquisition directions for **59 Silksong tools**, plus researched
  acquisition directions for all **8 crests**.
- **38 map-preview assignments** sourced from named Hollow Knight Wiki files.
  Some images show a shopkeeper or quest giver's map position, not an
  item pickup. Captions identify the distinction.
- A full Hollow Knight Wiki guide link for **every item**.
- Links to the wiki file-description/credits pages for the verified maps.
- Internet-dependent map previews with graceful failure; the location text and
  links remain visible without a map.

## Image rights

The Hollow Knight Wiki file pages label many of these game map screenshots as
**copyrighted game artwork used under fair use**, not public-domain or CC
images. The code **does not copy these files into the app or GitHub assets**.
It uses remote wiki file previews and links back to the wiki credit pages.
Even remote embedding can raise copyright and hotlinking issues, especially
for a commercial app. Confirm the rights and the wiki's reuse/hotlinking
terms before publicly distributing or monetizing this feature. If necessary,
show **a link only** instead of an image preview, or use properly licensed
or original location illustrations.

Reference: https://hollowknight.wiki/w/Charms and the individual item pages.

## Implementation

- `src/data/wiki-location-guides.js`: locations, verified map file names,
  attribution URLs, and readable map captions; supports API overrides.
- `src/components/hollow/wiki-location-section.jsx`: accessible map preview,
  error fallback, wiki source links, explanatory text.
- `src/app/(tabs)/charms/index.jsx`: includes the shared section for both games.
- `scripts/build-api.mjs`: generates `location`, `wikiUrl`, and, when
  available, `locationMapUrl`, `locationMapSource`, and `locationMapLabel`
  in the static item JSON API files.
- `public/api/hollow/items.json` and `public/api/silksong/items.json`:
  updated generated source data; deploy separately for the public Surge API.

## Testing in VS Code

```bash
git pull --rebase --autostash origin master
npx expo start --dev-client --clear
```

Open either game > **Charms** / **Tools & Crests**, expand an item, and scroll
to **Where to find it**. All items show text and a wiki article link. The
subset with verified maps also shows a map preview if the wiki image redirect
is reachable. When the remote image fails, use **Open map and credits on Wiki**
to inspect it on the source site.

No native iOS rebuild is required for these JavaScript-only changes. Since
the project depends on native RevenueCat and AdMob modules, keep using your
existing **development client** rather than standard Expo Go.

## Republish static API

Updating `public/api/` in GitHub **does not** automatically publish the Surge
site. When ready, in VS Code:

```bash
npm run build:api
npx expo export --platform web
npx surge ./dist hollow-knight-guide-ibrahim.surge.sh
```

These commands update
`https://hollow-knight-guide-ibrahim.surge.sh/api/` once Surge completes
the deployment using your existing Surge account.

## Future maintenance

For another verified item-specific or vendor map:
1. Visit the specific Hollow Knight Wiki file page to confirm that its map
   depicts the acquisition location.
2. Add the filename to the appropriate `hkMaps` or `ssMaps` dictionary
   inside `src/data/wiki-location-guides.js`.
3. If it shows a vendor, event, or related quest rather than the item,
   label it precisely in `mapCaptions`.
4. Regenerate and redeploy the API.

Never guess filenames or label a merchant map as the item's pickup location.
