import { bosses as hkBosses } from '../data/bosses';
import { charms as hkCharms } from '../data/charms';
import { bossImages, charmImages, locationImages } from '../data/images';

export const games = {
  hollow: {
    id: 'hollow',
    title: 'Hollow Knight',
    guideTitle: 'Hollow Knight Guide',
    tagline: 'Hallownest',
    storageSuffix: '',
    itemsLabel: 'Charms',
    itemLabel: 'Charm',
    hasLoadouts: true,
    bosses: hkBosses,
    items: hkCharms,
    bossImages,
    itemImages: charmImages,
    locationImages,
  },
  silksong: {
    id: 'silksong',
    title: 'Hollow Knight: Silksong',
    guideTitle: 'Silksong Guide',
    tagline: 'Pharloom',
    storageSuffix: ':silksong',
    itemsLabel: 'Tools',
    itemLabel: 'Tool',
    hasLoadouts: false,
    bosses: [],
    items: [],
    bossImages: {},
    itemImages: {},
    locationImages: {},
  },
};

export const gameList = Object.values(games);
