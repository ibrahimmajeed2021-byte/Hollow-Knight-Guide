// Wiki artwork for the expanded completion checklist.
// Item-specific artwork takes precedence; numbered sets intentionally share a
// group icon. These are category icons, NOT location maps or individual pins.
// Source files: https://hollowknight.wiki/w/Category:X_HK_Sprites_Inventory
// https://hollowknight.wiki/w/Category:X_SS_Sprites_Inventory
// https://hollowknight.wiki/w/Category:X_SS_Achievement_Icons
// Wiki image files are copyrighted game artwork; see WIKI_LOCATION_IMAGES.md.

const WIKI_FILE = "https://hollowknight.wiki/w/Special:Redirect/file/";
export const wikiImageUrl = (filename) =>
  WIKI_FILE + encodeURIComponent(filename.replace(/ /g, "_"));
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
  dreamers: "Dreamers Circle.png",
  trials: "Fools Circle.png",
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
  fleas: "Flea Caravan Circle.png",
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
