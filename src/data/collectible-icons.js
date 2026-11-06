// Wiki artwork for the expanded completion checklist.
// Item-specific artwork takes precedence; numbered sets intentionally share a
// group icon. These are category icons, NOT location maps or individual pins.
// Source files: https://hollowknight.wiki/w/Category:X_HK_Sprites_Inventory
// https://hollowknight.wiki/w/Category:X_SS_Sprites_Inventory
// https://hollowknight.wiki/w/Category:X_SS_Achievement_Icons
// Wiki image files are copyrighted game artwork; see WIKI_LOCATION_IMAGES.md.

// Direct MediaWiki CDN URLs avoid redirect/hotlink failures in Expo Image.
// These paths use the wiki's actual per-filename MD5 upload directories.
// When a file is removed or renamed the card still has a bundled fallback.
const CDN_IMAGES = {
  "../../assets/hollow/charms/Grubsong.png": "https://cdn.wikimg.net/en/hkwiki/images/4/44/..%2F..%2Fassets%2Fhollow%2Fcharms%2FGrubsong.png",
  "../../assets/hollow/charms/NailmastersGlory.png": "https://cdn.wikimg.net/en/hkwiki/images/1/12/..%2F..%2Fassets%2Fhollow%2Fcharms%2FNailmastersGlory.png",
  "../../assets/hollow/charms/ShamanStone.png": "https://cdn.wikimg.net/en/hkwiki/images/9/9e/..%2F..%2Fassets%2Fhollow%2Fcharms%2FShamanStone.png",
  "Absolute Radiance Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/6/68/Absolute_Radiance_Icon.png",
  "Achievement SS Flea Finder.png": "https://cdn.wikimg.net/en/hkwiki/images/4/43/Achievement_SS_Flea_Finder.png",
  "Ancient Mask.png": "https://cdn.wikimg.net/en/hkwiki/images/2/20/Ancient_Mask.png",
  "Architect Quest Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/e/ed/Architect_Quest_Icon.png",
  "Architect's Key.png": "https://cdn.wikimg.net/en/hkwiki/images/3/3c/Architect's_Key.png",
  "B Elder Hu.png": "https://cdn.wikimg.net/en/hkwiki/images/e/ed/B_Elder_Hu.png",
  "B Galien.png": "https://cdn.wikimg.net/en/hkwiki/images/9/96/B_Galien.png",
  "B Gorb.png": "https://cdn.wikimg.net/en/hkwiki/images/6/6c/B_Gorb.png",
  "B Grey Prince Zote.png": "https://cdn.wikimg.net/en/hkwiki/images/1/17/B_Grey_Prince_Zote.png",
  "B Markoth.png": "https://cdn.wikimg.net/en/hkwiki/images/6/6b/B_Markoth.png",
  "B Marmu.png": "https://cdn.wikimg.net/en/hkwiki/images/e/e8/B_Marmu.png",
  "B Nightmare King.png": "https://cdn.wikimg.net/en/hkwiki/images/0/09/B_Nightmare_King.png",
  "B No Eyes.png": "https://cdn.wikimg.net/en/hkwiki/images/3/3b/B_No_Eyes.png",
  "B Pure Vessel.png": "https://cdn.wikimg.net/en/hkwiki/images/e/e4/B_Pure_Vessel.png",
  "B Vessel Seal.png": "https://cdn.wikimg.net/en/hkwiki/images/5/5f/B_Vessel_Seal.png",
  "B White Defender.png": "https://cdn.wikimg.net/en/hkwiki/images/a/a7/B_White_Defender.png",
  "B Xero.png": "https://cdn.wikimg.net/en/hkwiki/images/e/ed/B_Xero.png",
  "Banner Hornet Sentinel.png": "https://cdn.wikimg.net/en/hkwiki/images/d/d5/Banner_Hornet_Sentinel.png",
  "Banner Lost Kin.png": "https://cdn.wikimg.net/en/hkwiki/images/0/0d/Banner_Lost_Kin.png",
  "Banner Sisters of Battle.png": "https://cdn.wikimg.net/en/hkwiki/images/3/38/Banner_Sisters_of_Battle.png",
  "Banner Soul Tyrant.png": "https://cdn.wikimg.net/en/hkwiki/images/c/c5/Banner_Soul_Tyrant.png",
  "Banner Winged Nosk.png": "https://cdn.wikimg.net/en/hkwiki/images/6/66/Banner_Winged_Nosk.png",
  "Beast Quest Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/f/f4/Beast_Quest_Icon.png",
  "Bellhome Key.png": "https://cdn.wikimg.net/en/hkwiki/images/c/c8/Bellhome_Key.png",
  "Charm Notch.png": "https://cdn.wikimg.net/en/hkwiki/images/e/e3/Charm_Notch.png",
  "City Crest.png": "https://cdn.wikimg.net/en/hkwiki/images/f/fb/City_Crest.png",
  "Collector's Map.png": "https://cdn.wikimg.net/en/hkwiki/images/a/a0/Collector's_Map.png",
  "Conductor Quest Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/0/04/Conductor_Quest_Icon.png",
  "Craw Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/2/24/Craw_Memento.png",
  "Craw Summons.png": "https://cdn.wikimg.net/en/hkwiki/images/5/5b/Craw_Summons.png",
  "Crawbell.png": "https://cdn.wikimg.net/en/hkwiki/images/d/de/Crawbell.png",
  "Delicate Flower.png": "https://cdn.wikimg.net/en/hkwiki/images/7/7e/Delicate_Flower.png",
  "Diving Bell Key.png": "https://cdn.wikimg.net/en/hkwiki/images/2/23/Diving_Bell_Key.png",
  "Elegant Key.png": "https://cdn.wikimg.net/en/hkwiki/images/7/7f/Elegant_Key.png",
  "Enraged Guardian Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/5/54/Enraged_Guardian_Icon.png",
  "Failed Champion Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/e/e7/Failed_Champion_Icon.png",
  "Fall Quest Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/b/b9/Fall_Quest_Icon.png",
  "Finale Quest Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/7/72/Finale_Quest_Icon.png",
  "Fury of the Fallen.png": "https://cdn.wikimg.net/en/hkwiki/images/4/4f/Fury_of_the_Fallen.png",
  "Gate Quest Icon.png": "https://cdn.wikimg.net/en/hkwiki/images/9/99/Gate_Quest_Icon.png",
  "Godtuner.png": "https://cdn.wikimg.net/en/hkwiki/images/9/92/Godtuner.png",
  "Grey Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/a/ad/Grey_Memento.png",
  "Grubsong.png": "https://cdn.wikimg.net/en/hkwiki/images/7/78/Grubsong.png",
  "Guardian's Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/0/0e/Guardian's_Memento.png",
  "HJ Herrah.png": "https://cdn.wikimg.net/en/hkwiki/images/3/3a/HJ_Herrah.png",
  "HJ Lurien.png": "https://cdn.wikimg.net/en/hkwiki/images/8/83/HJ_Lurien.png",
  "HJ Monomon.png": "https://cdn.wikimg.net/en/hkwiki/images/9/9d/HJ_Monomon.png",
  "Hero's Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/f/f1/Hero's_Memento.png",
  "Hunter's Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/1/17/Hunter's_Memento.png",
  "Icon SS Mask Shard Pickup 1.png": "https://cdn.wikimg.net/en/hkwiki/images/6/68/Icon_SS_Mask_Shard_Pickup_1.png",
  "Key of Apostate.png": "https://cdn.wikimg.net/en/hkwiki/images/e/e0/Key_of_Apostate.png",
  "Key of Heretic.png": "https://cdn.wikimg.net/en/hkwiki/images/7/75/Key_of_Heretic.png",
  "Key of Indolent.png": "https://cdn.wikimg.net/en/hkwiki/images/0/07/Key_of_Indolent.png",
  "Spool Extender.png": "https://cdn.wikimg.net/en/hkwiki/images/1/17/Spool_Extender.png",
  "Sprintmaster Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/f/f7/Sprintmaster_Memento.png",
  "Surface Memento.png": "https://cdn.wikimg.net/en/hkwiki/images/d/d7/Surface_Memento.png",
};
const WIKI_FILE = "https://hollowknight.wiki/w/Special:Redirect/file/";
export const wikiImageUrl = (filename) =>
  CDN_IMAGES[filename] ?? (WIKI_FILE + encodeURIComponent(filename.replace(/ /g, "_")));
export const wikiImageSource = (filename) => ({ uri: wikiImageUrl(filename) });

// Each of these filenames appears on the wiki's sprite/media listings.
// One icon is shared by each numbered collectible set.
const hollowGroups = {
  grubs: "Grubsong.png", // Grub-themed charm illustration
  maskshards: "Ancient Mask.png", // Completed-mask illustration
  vesselfragments: "B Vessel Seal.png", // Soul-vessel illustration
  paleore: "Fury of the Fallen.png", // Replaced below by local nail-art icon
  charmnotches: "Charm Notch.png",
  abilities: "Godtuner.png",
  spells: "Grubsong.png", // Replaced below by local spell-related icon
  nailarts: "Fury of the Fallen.png", // Nail-damage charm illustration
  keys: "Elegant Key.png",
  dreamers: "Godtuner.png",
  trials: "Godtuner.png",
  godhome: "Godtuner.png",
  milestones: "Fury of the Fallen.png",
};

// Existing local images load without internet and are better thematic matches
// for these categories than unrelated remotely hosted inventory graphics.
const hollowLocalIcons = {
  grubs: require("../../assets/hollow/charms/Grubsong.png"),
  paleore: require("../../assets/hollow/charms/NailmastersGlory.png"),
  spells: require("../../assets/hollow/charms/ShamanStone.png"),
  nailarts: require("../../assets/hollow/charms/NailmastersGlory.png"),
  milestones: require("../../assets/hollow/charms/NailmastersGlory.png"),
};

const hollowNamed = {
  "City Crest": "City Crest.png",
  "Elegant Key": "Elegant Key.png",
  "Collector's Map": "Collector's Map.png",
  "Delicate Flower": "Delicate Flower.png",
  "Godtuner": "Godtuner.png",
  "Charm Notch": "Charm Notch.png",
  "Monomon the Teacher": "HJ Monomon.png",
  "Lurien the Watcher": "HJ Lurien.png",
  "Herrah the Beast": "HJ Herrah.png",
};

const silksongGroups = {
  fleas: "Achievement SS Flea Finder.png",
  objectives: "Gate Quest Icon.png",
  keyitems: "Bellhome Key.png",
  mementos: "Guardian's Memento.png",
  bellhome: "Crawbell.png",
};

// The named inventory files are listed on the Hollow Knight Wiki.
// For numbered keys and other generic entries, display their group's icon.
const silksongNamed = {
  "Architect's Key": "Architect's Key.png",
  "Bellhome Key": "Bellhome Key.png",
  "Diving Bell Key": "Diving Bell Key.png",
  "Craw Summons": "Craw Summons.png",
  "Key of Indolent": "Key of Indolent.png",
  "Key of Heretic": "Key of Heretic.png",
  "Key of Apostate": "Key of Apostate.png",
  "Guardian's Memento": "Guardian's Memento.png",
  "Hero's Memento": "Hero's Memento.png",
  "Grey Memento": "Grey Memento.png",
  "Sprintmaster Memento": "Sprintmaster Memento.png",
  "Hunter's Memento": "Hunter's Memento.png",
  "Surface Memento": "Surface Memento.png",
  "Craw Memento": "Craw Memento.png",
  "Crawbell": "Crawbell.png",
  "Materium": "Crawbell.png", // Bellhome furnishings category image
};

const objectiveIcons = [
  [/^LEARN: Conductor/, "Conductor Quest Icon.png"],
  [/^LEARN: Architect/, "Architect Quest Icon.png"],
  [/^SEEK: After the Fall/, "Fall Quest Icon.png"],
  [/^DEFEAT: Beast/, "Beast Quest Icon.png"],
  [/^(DEFEAT: Pale Monarch|DESTROY: Soul Snare|DESCEND: Last Dive)/, "Finale Quest Icon.png"],
];

export function getCollectibleArtwork(item, gameId, existingUrl) {
  // These two old wiki aliases did not resolve on iPhone. Use file names
  // confirmed in the wiki's inventory artwork listings instead.
  if (gameId === "silksong" && item?.group === "maskshards") {
    return wikiImageSource("Icon SS Mask Shard Pickup 1.png");
  }
  if (gameId === "silksong" && item?.group === "spoolfragments") {
    return wikiImageSource("Spool Extender.png");
  }
  if (existingUrl) return { uri: existingUrl };
  if (item?.artworkUrl) return { uri: item.artworkUrl };
  if (!item) return undefined;
  if (gameId === "hollow") {
    if (hollowLocalIcons[item.group]) return hollowLocalIcons[item.group];
    const file = hollowNamed[item.name] || hollowGroups[item.group];
    return file ? wikiImageSource(file) : undefined;
  }
  let file = silksongNamed[item.name] || silksongGroups[item.group];
  if (item.group === "objectives") {
    file = objectiveIcons.find(([pattern]) => pattern.test(item.name))?.[1] || file;
  }
  // Prefer individual inventory artwork for unique keys, mementos, etc. only
  // when the named file is listed/known rather than guessing its path.
  return file ? wikiImageSource(file) : undefined;
}
