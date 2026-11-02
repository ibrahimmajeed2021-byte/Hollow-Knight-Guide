import { bosses as hkBosses } from "../data/bosses";
import { silksongBossImages } from "../data/silksong-images";
import { silksongBosses } from "../data/silksong-bosses";
import { charms as hkCharms } from "../data/charms";
import { bossImages, charmImages, locationImages } from "../data/images";

export const games = {
  hollow: {
    id: "hollow",
    title: "Hollow Knight",
    guideTitle: "Hollow Knight Guide",
    tagline: "Hallownest",
    storageSuffix: "",
    loadingImage: require("../../assets/hollow/Knight.png"),
    loadingColor: "#000",
    loadingImageSize: { width: 87, height: 144 },
    itemsLabel: "Charms",
    itemLabel: "Charm",
    hasLoadouts: true,
    bosses: hkBosses,
    items: hkCharms,
    bossImages,
    itemImages: charmImages,
    locationImages,
  },
  silksong: {
    id: "silksong",
    title: "Hollow Knight: Silksong",
    guideTitle: "Silksong Guide",
    tagline: "Pharloom",
    storageSuffix: ":silksong",
    itemsLabel: "Tools",
    itemLabel: "Tool",
    hasLoadouts: false,
    loadingImage: require("../../assets/hollow/silksong/Hornet.png"),
    loadingColor: "#2a0508",
    loadingImageSize: { width: 124, height: 144 },
    bosses: silksongBosses,
    items: [],
    bossImages: silksongBossImages,
    itemImages: {},
    locationImages: {},
  },
};

export const gameList = Object.values(games);
