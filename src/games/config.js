import { bosses as hkBosses } from "../data/bosses";
import { hollowExtraBosses } from "../data/hollow-extra-bosses";
import { hollowExtraCharms } from "../data/hollow-extra-charms";
import { hollowCollectibles, hollowCollectibleGroups } from "../data/hollow-collectibles";
import {
  silksongBossImages,
  silksongLocationImages,
  silksongItemImages,
} from "../data/silksong-images";
import { silksongItems } from "../data/silksong-items";
import { silksongCollectibles, silksongCollectibleGroups } from "../data/silksong-collectibles";
import { silksongExtraCollectibles, silksongExtraCollectibleGroups } from "../data/silksong-extra-collectibles";
import { silksongBosses } from "../data/silksong-bosses";
import { silksongExtraBosses } from "../data/silksong-extra-bosses";
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
    bosses: [...hkBosses, ...hollowExtraBosses],
    items: [...hkCharms, ...hollowExtraCharms],
    collectibles: hollowCollectibles,
    collectibleGroups: hollowCollectibleGroups,
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
    itemsLabel: "Items",
    itemLabel: "Tool",
    hasLoadouts: true,
    largeBossImage: true,
    loadingImage: require("../../assets/hollow/silksong/Hornet.png"),
    loadingColor: "#06140a",
    loadingBackground: require("../../assets/hollow/silksong/MossGrotto.png"),
    loadingImageSize: { width: 124, height: 144 },
    bosses: [...silksongBosses, ...silksongExtraBosses],
    items: silksongItems,
    collectibles: [...silksongCollectibles, ...silksongExtraCollectibles],
    collectibleGroups: [...silksongCollectibleGroups, ...silksongExtraCollectibleGroups],
    bossImages: silksongBossImages,
    itemImages: silksongItemImages,
    locationImages: silksongLocationImages,
  },
};

export const gameList = Object.values(games);
