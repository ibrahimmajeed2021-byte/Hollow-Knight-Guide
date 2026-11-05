// Hollow Knight Wiki location-image references for Silksong collectibles.
// The map numbering is not the same as the numbered checklist in every group.
// Keep this explicit mapping; never infer a map filename from a checklist number.
// Wiki map screenshots are copyrighted/fair-use game imagery. They're linked,
// not copied into the app. See WIKI_LOCATION_IMAGES.md.
const WIKI = "https://hollowknight.wiki/w/";
const fileUrl = (file) => WIKI + "File:" + encodeURIComponent(file.replace(/ /g, "_"));
const imageUrl = (file) => WIKI + "Special:Redirect/file/" + encodeURIComponent(file.replace(/ /g, "_"));
const wikiUrl = (title) => WIKI + encodeURIComponent(title.replace(/ /g, "_"));

const mask = {
  1: ["Mapshot SS Pebb 01.png", "Pebb's shop (Act 1–2)"],
  2: ["Mapshot SS Mask Shard 02.png", "Wormways location"],
  3: ["Mapshot SS Mask Shard 03.png", "The Marrow / Deep Docks passage"],
  4: ["Mapshot SS Mask Shard 04.png", "Far Fields location"],
  5: ["Mapshot SS Mask Shard 05.png", "Shellwood location"],
  6: ["Mapshot SS Mask Shard 06.png", "Weavenest Atla location"],
  7: ["Mapshot SS Jubilana 01.png", "Jubilana's shop (reward vendor)"],
  8: ["Mapshot SS Mask Shard 08.png", "Cogwork Core location"],
  9: ["Mapshot SS Mask Shard 09.png", "Whispering Vaults location"],
  11: ["Mapshot SS Mask Shard 11.png", "Far Fields Skull Cave location"],
  12: ["Mapshot SS Mask Shard 12.png", "Mount Fay location"],
  13: ["Mapshot SS Mask Shard 13.png", "The Slab location"],
  14: ["Mapshot SS Mask Shard 14.png", "Bilewater location"],
  15: ["Mapshot SS Mask Shard 15.png", "Wisp Thicket location"],
  16: ["Mapshot SS Mask Shard 16.png", "Blasted Steps location"],
};
const spool = {
  1: ["Mapshot SS Spool Fragment 01.png", "Bone Bottom location"],
  2: ["Mapshot SS Spool Fragment 02.png", "Deep Docks (central)"],
  3: ["Mapshot SS Spool Fragment 03.png", "Greymoor location"],
  5: ["Mapshot SS Spool Fragment 04.png", "Weavenest Atla location"],
  6: ["Mapshot SS Spool Fragment 05.png", "The Slab location"],
  7: ["Mapshot SS Spool Fragment 06.png", "Grand Gate location"],
  8: ["Mapshot SS Spool Fragment 07.png", "Underworks (central)"],
  10: ["Mapshot SS Spool Fragment 08.png", "Whiteward location"],
  11: ["Mapshot SS Spool Fragment 09.png", "Cogwork Core location"],
  12: ["Mapshot SS Spool Fragment 10.png", "Underworks (east)"],
  14: ["Mapshot SS Jubilana 01.png", "Jubilana's shop"],
  15: ["Mapshot SS Spool Fragment 11.png", "Deep Docks (east)"],
  16: ["Mapshot SS Spool Fragment 12.png", "High Halls location"],
  17: ["Mapshot SS Spool Fragment 13.png", "Memorium location"],
  18: ["Mapshot SS Grindle 01.png", "Grindle's shop"],
};
const locket = {
  1: ["Mapshot SS Memory Locket 01.png", "Hunter's March location"],
  3: ["Mapshot SS Memory Locket 02.png", "Greymoor (Bellway)"],
  5: ["Mapshot SS Memory Locket 03.png", "The Marrow location"],
  6: ["Mapshot SS Memory Locket 04.png", "Wormways location"],
  8: ["Mapshot SS Memory Locket 05.png", "Blasted Steps location"],
  9: ["Mapshot SS Memory Locket 06.png", "Bilewater (Bellway)"],
  10: ["Mapshot SS Memory Locket 07.png", "Choral Chambers location"],
  11: ["Mapshot SS Memory Locket 08.png", "Underworks location"],
  12: ["Mapshot SS Memory Locket 09.png", "Deep Docks location"],
  13: ["Mapshot SS Memory Locket 10.png", "Whispering Vaults location"],
  14: ["Mapshot SS Memory Locket 11.png", "Sands of Karak location"],
  15: ["Mapshot SS Memory Locket 12.png", "Greymoor (Halfway Home)"],
  16: ["Mapshot SS Memory Locket 13.png", "Memorium location"],
  17: ["Mapshot SS Memory Locket 14.png", "The Slab location"],
  18: ["Mapshot SS Memory Locket 15.png", "Bilewater (cocoon)"],
  19: ["Mapshot SS Memory Locket 16.png", "Bellhart location (Act 3)"],
  20: ["Mapshot SS Memory Locket 17.png", "Far Fields location (Act 3)"],
};
const craftmetal = {
  1: ["Mapshot SS Pebb 01.png", "Pebb's shop (Act 1–2)"],
  2: ["Mapshot SS Craftmetal 02.png", "The Marrow location"],
  3: ["Mapshot SS Craftmetal 03.png", "Deep Docks location"],
  4: ["Mapshot SS Craftmetal 04.png", "Blasted Steps location"],
  5: ["Mapshot SS Jubilana 01.png", "Jubilana's shop"],
  6: ["Mapshot SS Craftmetal 06.png", "Wisp Thicket location"],
  7: ["Mapshot SS Craftmetal 07.png", "Underworks location"],
  8: ["Mapshot SS Craftmetal 08.png", "Putrified Ducts location"],
};
const paleOil = {
  1: ["Mapshot SS Pale Oil 01.png", "Choral Chambers location"],
  2: ["Mapshot SS Loyal Mergwin 01.png", "Loyal Mergwin (quest giver)"],
  3: ["Mapshot SS Pale Oil 03.png", "Putrified Ducts / Flea Caravan"],
};
const silkHearts = {
  1: ["Screenshot SS Silk Heart 01.png", "Silk Heart from Bell Beast (item screenshot)"],
  2: ["Screenshot SS Silk Heart 02.png", "Silk Heart from The Unravelled (item screenshot)"],
};
// A verified quest-giver/boss location is labelled as such, not as a pickup.
const namedMaps = {
  "The Wandering Merchant": ["Mapshot SS Jubilana 01.png", "Jubilana's location"],
  "The Lost Merchant": ["Mapshot SS Jubilana 01.png", "Jubilana's location"],
  "Building Up Songclave": ["Mapshot SS Jubilana 01.png", "Jubilana's location"],
  "Strengthening Songclave": ["Mapshot SS Jubilana 01.png", "Jubilana's location"],
  "Trail's End": ["Mapshot SS Shakra Trail's End.png", "Trail's End (Shakra)"],
  "Savage Beastfly": ["Mapshot SS Savage Beastfly 01.png", "Savage Beastfly boss arena"],
  "Pinmaster's Oil": ["Mapshot SS Pale Oil 01.png", "Pale Oil pickup (one source)"],
  "Ecstasy of the End": ["Mapshot SS Pale Oil 03.png", "Flea Caravan area (reward)"],
  "Great Taste of Pharloom": ["Mapshot SS Loyal Mergwin 01.png", "Loyal Mergwin (quest)"],
  "Silk Heart": ["Screenshot SS Silk Heart 01.png", "Silk Heart pickup (illustration)"],
  "Architect's Melody": ["Mapshot SS Architect's Melody.png", "Architect's Melody location"],
};
// Pages used by all numbered entries are verified wiki articles; unnumbered
// abilities and wishes use their own wiki article or search page.
const groupArticle = {
  maskshards: "Mask Shard (Silksong)",
  spoolfragments: "Spool Fragment",
  memorylockets: "Memory Locket",
  silkhearts: "Silk Heart",
  paleoil: "Pale Oil",
  craftmetal: "Craftmetal",
};
// These are actual item/group art files confirmed on the wiki's Items page,
// plus the Wishwall and Skills/Abilities pages. They are CATEGORY thumbnails,
// never presented as a precise location map.
const artwork = {
  maskshards: ["Mask Shard (Silksong).png", "Mask Shard artwork"],
  spoolfragments: ["Spool Fragment.png", "Spool Fragment artwork"],
  memorylockets: ["Memory Locket.png", "Memory Locket artwork"],
  silkhearts: ["Icon SS Silk Heart.png", "Silk Heart artwork"],
  paleoil: ["Pale Oil.png", "Pale Oil artwork"],
  craftmetal: ["Craftmetal.png", "Craftmetal artwork"],
  wishes: ["Wishwall Bellhart.png", "Wishwall illustration (not the quest location)"],
  abilities: ["Icon SS Farsight Art.png", "Ability-category artwork (Farsight; not this ability's location)"],
};
const articleOverrides = {
  "The Lost Fleas": "The Lost Fleas",
  "LEARN: Bugs of Pharloom": "Bugs of Pharloom",
  "SPRINT: Fastest in Pharloom": "Fastest in Pharloom",
  "WITNESS: Passing of the Age": "Passing of the Age",
  "STEEL: A Vassal Lost": "A Vassal Lost",
  Silkspear: "Silkspear",
};

export function getCollectibleGuide(item) {
  if (!item?.name) return null;
  const number = Number(item.name.match(/#(\d+)$/)?.[1] || 0);
  let map = null;
  switch (item.group) {
    case "maskshards": map = mask[number]; break;
    case "spoolfragments": map = spool[number]; break;
    case "memorylockets": map = locket[number]; break;
    case "silkhearts": map = silkHearts[Number(item.name.match(/^Silk Heart (\d+):/)?.[1] || 0)]; break;
    case "paleoil": map = paleOil[number]; break;
    case "craftmetal": map = craftmetal[number]; break;
    default: map = namedMaps[item.name] || null;
  }
  const article = groupArticle[item.group] || articleOverrides[item.name] || item.name;
  const sourcePage = wikiUrl(article);
  const defaultArtwork = artwork[item.group];
  const artworkFilename = defaultArtwork?.[0];
  const artworkPreview = item.artworkUrl ||
    (artworkFilename ? imageUrl(artworkFilename) : null);
  const mapPreview = item.locationMapUrl || (map ? imageUrl(map[0]) : null);
  const mapPage = item.locationMapSource || (map ? fileUrl(map[0]) : null);
  return {
    location: item.location || null,
    wikiUrl: item.wikiUrl || sourcePage,
    artworkUrl: artworkPreview,
    artworkSource: item.artworkSource ||
      (artworkFilename ? fileUrl(artworkFilename) : null),
    imageUrl: mapPreview || artworkPreview,
    fileUrl: mapPage || item.artworkSource ||
      (artworkFilename ? fileUrl(artworkFilename) : null),
    mapLabel: mapPreview
      ? (item.locationMapLabel || map?.[1] || "Location map")
      : defaultArtwork?.[1] || "Collectible artwork",
    imageType: mapPreview ? "map" : "artwork",
  };
}
