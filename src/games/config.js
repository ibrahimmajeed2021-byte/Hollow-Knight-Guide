import { bosses as hkBosses } from "../data/bosses";
import {
  silksongBossImages,
  silksongLocationImages,
  silksongItemImages,
} from "../data/silksong-images";
import { silksongItems } from "../data/silksong-items";
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
    loadingBackground: require("../../assets/hollow/CityOfTears.png"),
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
    itemsLabel: "Tools & Crests",
    itemLabel: "Tool",
    hasLoadouts: false,
    largeBossImage: true,
    loadingImage: require("../../assets/hollow/silksong/Hornet.png"),
    loadingColor: "#06140a",
    loadingBackground: require("../../assets/hollow/silksong/MossGrotto.png"),
    loadingImageSize: { width: 124, height: 144 },
    bosses: silksongBosses,
    items: silksongItems,
    bossImages: silksongBossImages,
    itemImages: silksongItemImages,
    locationImages: silksongLocationImages,
  },
};

export const gameList = Object.values(games);
