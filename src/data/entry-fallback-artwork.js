// Bundled artwork used only when a wiki-hosted icon is unavailable.
// A fallback is illustrative of the group or boss variant; it is not an
// incorrectly labelled item-specific sprite. These do not need internet.
const hk = {
  grubs: require("../../assets/hollow/charms/Grubsong.png"),
  maskshards: require("../../assets/hollow/charms/LifebloodHeart.png"),
  vesselfragments: require("../../assets/hollow/charms/SoulCatcher.png"),
  paleore: require("../../assets/hollow/charms/NailmastersGlory.png"),
  charmnotches: require("../../assets/hollow/charms/WaywardCompass.png"),
  abilities: require("../../assets/hollow/charms/Dashmaster.png"),
  spells: require("../../assets/hollow/charms/ShamanStone.png"),
  nailarts: require("../../assets/hollow/charms/NailmastersGlory.png"),
  keys: require("../../assets/hollow/charms/WaywardCompass.png"),
  dreamers: require("../../assets/hollow/charms/DreamShield.png"),
  trials: require("../../assets/hollow/charms/MarkofPride.png"),
  godhome: require("../../assets/hollow/charms/DreamWielder.png"),
  milestones: require("../../assets/hollow/charms/QuickSlash.png"),
};
const ss = {
  maskshards: require("../../assets/hollow/silksong/items/FracturedMask.png"),
  spoolfragments: require("../../assets/hollow/silksong/items/SpoolExtender.png"),
  memorylockets: require("../../assets/hollow/silksong/items/MemoryCrystal.png"),
  silkhearts: require("../../assets/hollow/silksong/items/ReserveBind.png"),
  paleoil: require("../../assets/hollow/silksong/items/NeedlePhial.png"),
  craftmetal: require("../../assets/hollow/silksong/items/CogworkWheel.png"),
  wishes: require("../../assets/hollow/silksong/items/PinBadge.png"),
  abilities: require("../../assets/hollow/silksong/items/HunterCrest.png"),
  fleas: require("../../assets/hollow/silksong/items/EggofFlealia.png"),
  objectives: require("../../assets/hollow/silksong/items/Compass.png"),
  keyitems: require("../../assets/hollow/silksong/items/SnitchPick.png"),
  mementos: require("../../assets/hollow/silksong/items/MemoryCrystal.png"),
  bellhome: require("../../assets/hollow/silksong/items/ShellSatchel.png"),
};

export function getCollectibleFallbackArtwork(item, gameId) {
  return (gameId === "silksong" ? ss : hk)[item?.group];
}

// Dream forms use their original encounter portrait when the wiki portrait
// cannot load. Warrior Dreams fall back to the bundled Dream Shield artwork.
const originalBoss = {
  "Failed Champion": "FalseKnight",
  "Soul Tyrant": "SoulMaster",
  "Lost Kin": "BrokenVessel",
  "White Defender": "DungDefender",
  "Grey Prince Zote": "Zote",
  "Nightmare King Grimm": "Grimm",
  "Enraged Guardian": "CrystalGuardian",
  "Hornet Sentinel": "HornetProtector",
  "Pure Vessel": "HollowKnight",
  "Absolute Radiance": "Radiance",
  "Sisters of Battle": "MantisLords",
  "Winged Nosk": "Nosk",
  "Skull Tyrant (Bone Bottom rematch)": "SkullTyrantTheMarrowBoneBottom",
};

export function getBossFallbackArtwork(item, images) {
  const base = originalBoss[item?.name];
  if (base && images?.[base]) return images[base];
  if (item?.kind === "Warrior Dream") {
    return require("../../assets/hollow/charms/DreamShield.png");
  }
  return undefined;
}

export function getCharmFallbackArtwork(item, images) {
  return item?.name === "Fury of the Fallen"
    ? images?.NailmastersGlory
    : undefined;
}
