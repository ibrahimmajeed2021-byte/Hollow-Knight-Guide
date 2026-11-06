// Structural regression checks for the Stage 1 UI reorganisation.
// These complement (not replace) the Expo runtime and device visual tests.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), "utf8");

const home = read("src/app/(tabs)/index.jsx");
const settings = read("src/app/settings.jsx");
const hub = read("src/app/companion.jsx");
const paywall = read("src/app/premium.jsx");

assert.ok(existsSync(join(root, "src/app/companion.jsx")), "Companion route must exist");
for (const path of ["/guided", "/planner", "/premium-studio", "/premium"]) {
  const route = "src/app/" + path.slice(1) + ".jsx";
  assert.ok(existsSync(join(root, route)), route + " missing");
  assert.ok(hub.includes(path), "Companion doesn't link to " + path);
}

assert.match(home, /router\.push\("\/companion"\)/, "Home must have a Companion link");
assert.ok(!home.includes('router.push("/guided")'), "Home should not duplicate Guided Mode buttons");
assert.ok(!home.includes('router.push("/premium-studio")'), "Home should not duplicate Studio buttons");
assert.match(home, /showSection\("overview"\)/, "Progress overview must remain");
assert.match(home, /showSection\("search"\)/, "Guide search must remain");
assert.match(home, /showSection\("continue"\)/, "Next steps must remain");
assert.match(home, /showSection\("toolkit"\)/, "Loadouts must remain");
assert.match(home, /<AdBanner\s*\/>/, "Ads must remain for Free users");

const categories = [
  "Appearance & themes", "Accessibility & feedback", "Audio",
  "Guide preferences", "Data & support",
];
for (const name of categories) {
  assert.ok(settings.includes('title="' + name + '"'), name + " category missing");
}
assert.ok(settings.includes("useState(null)"), "Categories should default collapsed");
assert.ok(settings.includes("setThemesOpen"), "Theme gallery must be discoverable");
assert.ok(settings.includes("<BackupSection embedded />"), "Backup controls must remain");
assert.ok(settings.includes("<LoadingSoundSetting embedded />"), "Audio controls must remain");
for (const id of [
  "themeStyle", "fontSize", "highContrast", "selectorMusicEnabled",
  "hapticsIntensity", "startExpanded", "reduceMotion",
  "rememberGame", "showPrivacyOptions", "clearGame", "reset()",
]) {
  assert.ok(settings.includes(id), "Settings option missing: " + id);
}
assert.match(settings, /Confirm: reset settings/, "Reset needs confirmation");

assert.ok(hub.includes("usePurchases()"), "Companion must check the actual Premium status");
assert.ok(hub.includes('const destination = isPremium ? feature.path : "/premium"'),
  "Free users should be directed to Premium plans, not locked tools");
assert.ok(hub.includes("The free guide already includes"),
  "Companion must explain free guide value");
assert.ok(paywall.includes("Explore without interruptions"), "Premium value explanation missing");
assert.ok(paywall.includes("The complete boss, item and collectible guides"),
  "Paywall must affirm the complete guide stays free");
assert.ok(paywall.includes("presentPaywall") &&
  paywall.includes("purchasePackage") &&
  paywall.includes("restorePurchases") &&
  paywall.includes("presentCustomerCenter"),
  "Existing RevenueCat purchase actions must remain");

console.log("Stage 1 UI structure checks passed: Home, Companion, Settings and purchases.");
