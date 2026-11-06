// Each Premium appearance has its own palette and atmospheric artwork.
// The image files are already bundled in the guide; API URLs are generated
// from the same asset paths for normal online operation.
// All artwork retains the existing fan-guide attribution/rights notice.
const entries = [
  {
    id: "default", name: "Classic", game: "Both games",
    tagline: "The original field journal", accent: "#565a75",
  },
  {
    id: "hollowknight", name: "Hallownest", game: "Hollow Knight",
    tagline: "The kingdom below", accent: "#82b2d7",
    backgroundAsset: require("../../assets/hollow/CityOfTears.png"),
    backgroundPath: "assets/hollow/CityOfTears.png",
    motifAsset: require("../../assets/hollow/Knight.png"),
    motifPath: "assets/hollow/Knight.png",
  },
  {
    id: "cityOfTears", name: "City of Tears", game: "Hollow Knight",
    tagline: "Rain over the capital", accent: "#6fa7dc",
    backgroundAsset: require("../../assets/hollow/CityOfTears.png"),
    backgroundPath: "assets/hollow/CityOfTears.png",
    motifAsset: require("../../assets/hollow/bosses/SoulMaster.png"),
    motifPath: "assets/hollow/bosses/SoulMaster.png",
  },
  {
    id: "voidheart", name: "Voidheart", game: "Hollow Knight",
    tagline: "Bound by the Void", accent: "#ab95e4",
    motifAsset: require("../../assets/hollow/charms/VoidHeart.png"),
    motifPath: "assets/hollow/charms/VoidHeart.png",
  },
  {
    id: "godhome", name: "Godhome", game: "Hollow Knight",
    tagline: "The realm of the Godseekers", accent: "#e9be60",
    motifAsset: require("../../assets/hollow/bosses/Radiance.png"),
    motifPath: "assets/hollow/bosses/Radiance.png",
  },
  {
    id: "greenpath", name: "Greenpath", game: "Hollow Knight",
    tagline: "Ancient gardens of moss", accent: "#9fcf79",
    motifAsset: require("../../assets/hollow/bosses/MassiveMossCharger.png"),
    motifPath: "assets/hollow/bosses/MassiveMossCharger.png",
  },
  {
    id: "crystalPeak", name: "Crystal Peak", game: "Hollow Knight",
    tagline: "Violet light in the mines", accent: "#cc9ce3",
    motifAsset: require("../../assets/hollow/bosses/CrystalGuardian.png"),
    motifPath: "assets/hollow/bosses/CrystalGuardian.png",
  },
  {
    id: "whitePalace", name: "White Palace", game: "Hollow Knight",
    tagline: "Pale King's sanctuary", accent: "#dbdfed",
    motifAsset: require("../../assets/hollow/bosses/HollowKnight.png"),
    motifPath: "assets/hollow/bosses/HollowKnight.png",
  },
  {
    id: "silksong", name: "Pharloom", game: "Silksong",
    tagline: "The world of silk and song", accent: "#7ed957",
    backgroundAsset: require("../../assets/hollow/silksong/MossGrotto.png"),
    backgroundPath: "assets/hollow/silksong/MossGrotto.png",
    motifAsset: require("../../assets/hollow/silksong/Hornet.png"),
    motifPath: "assets/hollow/silksong/Hornet.png",
  },
  {
    id: "citadelOfSong", name: "Citadel of Song", game: "Silksong",
    tagline: "Gilded halls and melodies", accent: "#e0bf7f",
    motifAsset: require("../../assets/hollow/silksong/bosses/GrandMotherSilk.png"),
    motifPath: "assets/hollow/silksong/bosses/GrandMotherSilk.png",
  },
  {
    id: "mossGrotto", name: "Moss Grotto", game: "Silksong",
    tagline: "An emerald beginning", accent: "#83d69c",
    backgroundAsset: require("../../assets/hollow/silksong/MossGrotto.png"),
    backgroundPath: "assets/hollow/silksong/MossGrotto.png",
    motifAsset: require("../../assets/hollow/silksong/bosses/MossMotherRuinedChapel.png"),
    motifPath: "assets/hollow/silksong/bosses/MossMotherRuinedChapel.png",
  },
  {
    id: "deepDocks", name: "Deep Docks", game: "Silksong",
    tagline: "Embers beneath Pharloom", accent: "#ed9f65",
    motifAsset: require("../../assets/hollow/silksong/bosses/LaceDeepDocks.png"),
    motifPath: "assets/hollow/silksong/bosses/LaceDeepDocks.png",
  },
  {
    id: "bilewater", name: "Bilewater", game: "Silksong",
    tagline: "Poisonous swamps and shadows", accent: "#a5cf8b",
    motifAsset: require("../../assets/hollow/silksong/bosses/GroaltheGreat.png"),
    motifPath: "assets/hollow/silksong/bosses/GroaltheGreat.png",
  },
  {
    id: "songclave", name: "Songclave", game: "Silksong",
    tagline: "A haven of voices", accent: "#b1b8e8",
    motifAsset: require("../../assets/hollow/silksong/bosses/GarmondandZaza.png"),
    motifPath: "assets/hollow/silksong/bosses/GarmondandZaza.png",
  },
];

export const themeCatalog = entries;
export const premiumThemeIds = entries.filter((theme) => theme.id !== "default").map((theme) => theme.id);
export const themeById = Object.fromEntries(entries.map((theme) => [theme.id, theme]));

export function resolveTheme(id) {
  return themeById[id] || themeById.default;
}
