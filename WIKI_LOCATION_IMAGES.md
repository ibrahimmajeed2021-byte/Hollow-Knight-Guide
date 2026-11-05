# Item acquisition locations and wiki map previews

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
