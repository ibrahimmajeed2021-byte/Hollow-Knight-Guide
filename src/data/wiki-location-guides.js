// Acquisition locations researched on hollowknight.wiki (November 2026).
// Map files are NOT bundled: the wiki describes these game screenshots as
// copyrighted/fair-use. The app links to the original files and credits them.
// Only wiki-verified map filenames are included; other items use wiki links.
const WIKI = "https://hollowknight.wiki/w/";

export const hollowCharmLocations = {
  "Wayward Compass": "Buy from Iselda in Dirtmouth for 220 Geo after meeting Cornifer.",
  "Gathering Swarm": "Buy from Sly in Dirtmouth for 300 Geo.",
  "Stalwart Shell": "Buy from Sly in Dirtmouth for 200 Geo.",
  "Soul Catcher": "Ancestral Mound, beyond the Elder Baldur in Forgotten Crossroads.",
  "Shaman Stone": "Buy from Salubra in Forgotten Crossroads for 220 Geo.",
  "Soul Eater": "Resting Grounds: use Desolate Dive on the grave below the Stag Station, then go east.",
  Dashmaster: "Fungal Wastes, south of Mantis Village.",
  Sprintmaster: "Buy from Sly for 400 Geo after returning the Shopkeeper's Key.",
  Grubsong: "Reward from Grubfather in Forgotten Crossroads for freeing 10 Grubs.",
  "Grubberfly's Elegy": "Reward from Grubfather in Forgotten Crossroads for freeing all Grubs.",
  "Fragile Heart": "Buy from Leg Eater in Fungal Wastes for 350 Geo (280 with Defender's Crest).",
  "Unbreakable Heart": "Take Fragile Heart to Divine in Dirtmouth and pay 12,000 Geo.",
  "Fragile Greed": "Buy from Leg Eater in Fungal Wastes for 250 Geo (200 with Defender's Crest).",
  "Unbreakable Greed": "Take Fragile Greed to Divine in Dirtmouth and pay 9,000 Geo.",
  "Fragile Strength": "Buy from Leg Eater in Fungal Wastes for 600 Geo (480 with Defender's Crest).",
  "Unbreakable Strength": "Take Fragile Strength to Divine in Dirtmouth and pay 15,000 Geo.",
  "Spell Twister": "Soul Sanctum in City of Tears, in the room before Soul Master.",
  "Steady Body": "Buy from Salubra in Forgotten Crossroads for 120 Geo.",
  "Heavy Blow": "Buy from Sly for 350 Geo after returning the Shopkeeper's Key.",
  "Quick Slash": "Kingdom's Edge, south of Nailmaster Oro's hut.",
  Longnail: "Buy from Salubra in Forgotten Crossroads for 300 Geo.",
  "Mark of Pride": "Mantis Village, northeast of the Mantis Lords arena; defeat them first.",
  "Thorns of Agony": "Greenpath, in the middle of the area; requires Mothwing Cloak.",
  "Baldur Shell": "Howling Cliffs, in a chest to the south.",
  Flukenest: "Defeat Flukemarm in the Royal Waterways.",
  "Defender's Crest": "Defeat Dung Defender in the Royal Waterways.",
  "Glowing Womb": "Forgotten Crossroads, east of False Knight; requires Crystal Heart.",
  "Quick Focus": "Buy from Salubra in Forgotten Crossroads for 800 Geo.",
  "Deep Focus": "Crystal Peak, south of Cornifer; requires Crystal Heart.",
  "Lifeblood Heart": "Buy from Salubra in Forgotten Crossroads for 250 Geo.",
  "Lifeblood Core": "The Abyss, western Lifeblood door; requires 14 Lifeblood masks (15 with Joni's Blessing).",
  "Joni's Blessing": "Joni's Repose in Howling Cliffs.",
  Hiveblood: "The Hive, beyond Hive Knight.",
  "Spore Shroom": "Western Fungal Wastes, near Queen's Gardens.",
  "Sharp Shadow": "Deepnest, southeast of the Hot Spring; requires Shade Cloak.",
  "Shape of Unn": "Lake of Unn in Greenpath; requires Isma's Tear.",
  "Nailmaster's Glory": "Given by Sly in Dirtmouth after learning all three Nail Arts.",
  Weaversong: "Weavers' Den in Deepnest.",
  "Dream Wielder": "Reward from Seer for gathering 500 Essence.",
  DreamShield: "Resting Grounds, south of the Seer.",
  "Grimm Child": "Given by Troupe Master Grimm in Dirtmouth after starting the ritual.",
  "Carefree Melody": "Given by Nymm in Dirtmouth after banishing the Grimm Troupe.",
  Kingsoul: "Combine halves from White Lady in Queen's Gardens and the White Palace.",
  "Void Heart": "Return to the Birthplace in the Abyss with Kingsoul equipped.",
};

export const silksongCrestLocations = {
  "Hunter Crest": "Equipped from the start; Eva in Weavenest Atla can upgrade it.",
  "Reaper Crest": "Chapel of the Reaper in western Greymoor, above Moorwing; complete its gauntlet.",
  "Wanderer Crest": "Chapel of the Wanderer in Bonegrave; complete its gauntlet.",
  "Beast Crest": "Chapel of the Beast in Hunter's March, after defeating Savage Beastfly.",
  "Cursed Crest": "Complete Rite of Rebirth: find the Twisted Bud in Bilewater and bring it to Greyroot in Shellwood.",
  "Architect Crest": "Chapel of the Architect, accessible from the Citadel's Underworks.",
  "Shaman Crest": "Ruined Chapel, Moss Grotto, in Act 3; requires Silk Soar to reach the hidden room.",
  "Cloakless Crest": "Temporarily equipped when a Wardenfly captures Hornet and takes her to the Slab.",
};

// Filenames found on Hollow Knight Wiki's file pages or map-file categories.
// The Grubfather map identifies the reward NPC, not a pickup on the ground.
const hkMaps = {
  "Wayward Compass": "Mapshot HK Iselda 01.png",
  "Gathering Swarm": "Mapshot HK Sly 01.png",
  "Stalwart Shell": "Mapshot HK Sly 01.png",
  "Sprintmaster": "Mapshot HK Sly 01.png",
  "Heavy Blow": "Mapshot HK Sly 01.png",
  "Nailmaster's Glory": "Mapshot HK Sly 01.png",
  "Shaman Stone": "Mapshot HK Salubra 01.png",
  "Steady Body": "Mapshot HK Salubra 01.png",
  "Longnail": "Mapshot HK Salubra 01.png",
  "Quick Focus": "Mapshot HK Salubra 01.png",
  "Lifeblood Heart": "Mapshot HK Salubra 01.png",
  "Fragile Heart": "Mapshot HK Leg Eater 01.png",
  "Fragile Greed": "Mapshot HK Leg Eater 01.png",
  "Fragile Strength": "Mapshot HK Leg Eater 01.png",
  "Carefree Melody": "Mapshot HK Nymm 01.png",
  "Dream Wielder": "Mapshot HK Seer 01.png",
  "Kingsoul": "Mapshot HK White Lady 01.png",
  "Soul Eater": "Mapshot HK Soul Eater.png",
  "Lifeblood Core": "Mapshot HK Lifeblood Core.png",
  "Spore Shroom": "Mapshot HK Spore Shroom.png",
  "Quick Slash": "Mapshot HK Quick Slash.png",
  "Spell Twister": "Mapshot HK Spell Twister.png",
  DreamShield: "Mapshot HK Dreamshield.png",
  Grubsong: "Mapshot HK Mask Shard 02.png",
  "Grubberfly's Elegy": "Mapshot HK Mask Shard 02.png",
};
const ssMaps = {
  "Hunter Crest": "Mapshot SS Eva 01.png",
  "Cursed Crest": "Mapshot SS Greyroot.png",
  "Shaman Crest": "Mapshot SS Red Memory.png",
  "Cloakless Crest": "Mapshot SS Wardenfly 02.png",
  "Pollip Pouch": "Mapshot SS Greyroot.png",
  "Tacks": "Mapshot SS Crull and Benjin 01.png",
  "Architect Crest": "Mapshot SS Architect Crest.png",
  "Beast Crest": "Mapshot SS Beast Crest.png",
  "Reaper Crest": "Mapshot SS Reaper Crest.png",
  "Wanderer Crest": "Mapshot SS Wanderer Crest.png",
  "Barbed Bracelet": "Mapshot SS Barbed Bracelet.png",
  "Weighted Belt": "Mapshot SS Weighted Belt.png",
  "Snare Setter": "Mapshot SS Snare Setter 01.png",
};
const mapCaptions = {
  "Grubsong": "Grubfather's location",
  "Grubberfly's Elegy": "Grubfather's location",
  "Wayward Compass": "Iselda's shop",
  "Gathering Swarm": "Sly's shop",
  "Stalwart Shell": "Sly's shop",
  "Sprintmaster": "Sly's shop",
  "Heavy Blow": "Sly's shop",
  "Nailmaster's Glory": "Sly's location",
  "Shaman Stone": "Salubra's shop",
  "Steady Body": "Salubra's shop",
  "Longnail": "Salubra's shop",
  "Quick Focus": "Salubra's shop",
  "Lifeblood Heart": "Salubra's shop",
  "Fragile Heart": "Leg Eater's location",
  "Fragile Greed": "Leg Eater's location",
  "Fragile Strength": "Leg Eater's location",
  "Carefree Melody": "Nymm's location",
  "Dream Wielder": "The Seer's location",
  "Kingsoul": "White Lady (one Kingsoul half)",
  "Hunter Crest": "Eva's location (Crest upgrades)",
  "Cursed Crest": "Greyroot's location (quest)",
  "Shaman Crest": "Red Memory location",
  "Cloakless Crest": "Wardenfly location (capture)",
  "Pollip Pouch": "Greyroot's location (quest)",
  "Tacks": "Crull and Benjin's location",
};
const articleOverrides = {
  "Grimm Child": "Grimmchild",
  DreamShield: "Dreamshield",
  "Silkshot (Original)": "Silkshot",
  "Silkshot (Twelfth Architect)": "Silkshot",
  "Silkshot (Forge Daughter)": "Silkshot",
  "Druid's Eyes": "Druid's Eye",
  "Claw Mirrors": "Claw Mirror",
};
const wikiSlug = (value) => encodeURIComponent(value.replace(/ /g, "_"));

export function getWikiLocationGuide(item, gameId) {
  if (!item?.name) return null;
  const hk = gameId === "hollow";
  const location = hk
    ? item.location || hollowCharmLocations[item.name] || null
    : item.location || silksongCrestLocations[item.name] || null;
  const file = (hk ? hkMaps : ssMaps)[item.name];
  return {
    location,
    wikiUrl: item.wikiUrl || WIKI + wikiSlug(articleOverrides[item.name] || item.name),
    // The documented MediaWiki external image redirect. An image request
    // can fail (offline, remote server changes), and the UI must hide it.
    imageUrl: item.locationMapUrl || (file ? WIKI + "Special:Redirect/file/" + wikiSlug(file) : null),
    fileUrl: item.locationMapSource || (file ? WIKI + "File:" + wikiSlug(file) : null),
    mapLabel: item.locationMapLabel || mapCaptions[item.name] || "Location map",
  };
}
