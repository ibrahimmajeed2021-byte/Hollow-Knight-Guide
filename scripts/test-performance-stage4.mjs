import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FREE_CHECK_INTERVAL_MS,
  PREMIUM_CHECK_INTERVAL_MS,
  reachabilityIntervalMs,
} from "../src/network/polling-policy.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");

// Keep Free service reachability enforcement responsive without waking
// verified offline-capable Premium clients every 15 seconds.
assert.equal(FREE_CHECK_INTERVAL_MS, 15_000);
assert.equal(PREMIUM_CHECK_INTERVAL_MS, 90_000);
assert.equal(reachabilityIntervalMs(false), 15_000);
assert.equal(reachabilityIntervalMs(true), 90_000);

const network = read("src/network/online-access-context.jsx");
assert.match(network, /reachabilityIntervalMs\(verifiedPremium\)/);
assert.match(network, /retry\(\{ silent: true \}\)/);
assert.match(network, /AppState\.currentState === "active"/);
assert.match(network, /if \(!silent\) setChecking\(true\)/);
assert.match(network, /if \(mounted\.current && !silent\) setChecking\(false\)/);

const games = read("src/games/game-context.jsx");
assert.match(games, /if \(!gameId\) return;/);
assert.match(games, /\$\{gameId\}\/\$\{kind\}\.json/);
assert.doesNotMatch(games, /Object\.keys\(games\)\.forEach/);
assert.match(games, /\[gameId\]\)/);

const home = read("src/app/(tabs)/index.jsx");
assert.match(home, /if \(!term \|\| settings\.homeSections\?\.search === false\) return \[\];/);
assert.match(home, /if \(matches\.length >= 7\) break;/);
assert.match(home, /\.\.\.homeArtwork\(entry, artworkKind, config\)/);
assert.doesNotMatch(home, /const lookup = useMemo/);

const theme = read("src/themes/theme-backdrop.jsx");
const screen = read("src/components/hollow/screen.jsx");
assert.match(theme, /AppState\.addEventListener\("change"/);
assert.match(theme, /!active \|\| !appActive/);
assert.match(theme, /pulse\.stopAnimation\(\)/);
assert.match(screen, /useIsFocused\(\)/);
assert.match(screen, /<ThemeBackdrop active=\{isFocused\}/);

const layout = read("src/app/_layout.jsx");
assert.match(layout, /Image\.configureCache/);
assert.match(layout, /maxMemoryCost: 64 \* 1024 \* 1024/);
assert.match(layout, /maxDiskSize: 200 \* 1024 \* 1024/);
assert.match(layout, /if \(state !== "active"\) stopSound\(\)/);

// These existing behaviours must remain intact while optimising.
assert.match(read("src/network/offline-access-gate.jsx"), /!blocked/);
assert.match(read("src/components/hollow/game-select.jsx"), /selectGame\(game\.id\)/);
assert.match(read("src/app/_layout.jsx"), /<JournalProvider key=\{config\.id\} suffix=\{config\.storageSuffix\}>/);
console.log("Stage 4 performance checks passed: network, API, search, animation, iOS cache.");
