import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchRemote,
  readCached,
  fetchMediaManifest,
  readCachedMediaManifest,
} from "../api/remote-data";
import { games } from "./config";
import { sortByProgression } from "../data/progression-order";

const STORAGE_KEY = "hollow-knight-guide:game";
const SETTINGS_KEY = "hollow-knight-guide:settings";
const GameContext = createContext(null);

// Online values win for existing entries, but an older published API must
// NEVER remove new bundled guide entries (or their saved journal keys).
// Remote-only entries are appended and sorted by progression afterward.
function mergeList(bundled, remote) {
  if (!Array.isArray(remote) || !remote.length) return bundled;
  const bundledNames = new Set(bundled.map((entry) => entry.name));
  const remoteByName = new Map(remote.map((entry) => [entry.name, entry]));
  return [
    ...bundled.map((entry) => ({ ...entry, ...(remoteByName.get(entry.name) ?? {}) })),
    ...remote.filter((entry) => !bundledNames.has(entry.name)),
  ];
}

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [remote, setRemote] = useState({});
  const [sources, setSources] = useState({});
  const [mediaManifest, setMediaManifest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async (id, kind) => {
      const path = `${id}/${kind}.json`;
      const cached = await readCached(path);
      if (cached && !cancelled) {
        setRemote((prev) => ({ ...prev, [path]: cached.data }));
        setSources((prev) => ({
          ...prev,
          [path]: { source: "cached", at: cached.at },
        }));
      }
      const fresh = await fetchRemote(path);
      if (fresh && !cancelled) {
        setRemote((prev) => ({ ...prev, [path]: fresh }));
        setSources((prev) => ({
          ...prev,
          [path]: { source: "online", at: Date.now() },
        }));
      }
    };
    Object.keys(games).forEach((id) => {
      load(id, "bosses");
      load(id, "items");
      load(id, "collectibles");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    readCachedMediaManifest().then((cached) => {
      if (cached && !cancelled) setMediaManifest(cached);
    });
    fetchMediaManifest().then((fresh) => {
      if (fresh && !cancelled) setMediaManifest(fresh);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(SETTINGS_KEY),
      AsyncStorage.getItem(STORAGE_KEY),
    ])
      .then(([settingsRaw, raw]) => {
        const remember = settingsRaw
          ? JSON.parse(settingsRaw).rememberGame === true
          : false;
        if (remember && raw && games[raw]) setGameId(raw);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const selectGame = useCallback((id) => {
    setGameId(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  }, []);

  const clearGame = useCallback(() => {
    setGameId(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  const value = useMemo(() => {
    const id = gameId ?? "hollow";
    const base = games[id];
    const bosses = remote[`${id}/bosses.json`];
    const items = remote[`${id}/items.json`];
    const collectibles = remote[`${id}/collectibles.json`];
    const remoteMedia = mediaManifest?.games?.[id];
    const config = {
      ...base,
      heroImageUrl: remoteMedia?.heroImageUrl ?? null,
      backgroundImageUrl: remoteMedia?.backgroundImageUrl ?? null,
      bosses: sortByProgression(id, "bosses", mergeList(base.bosses, bosses)),
      items: sortByProgression(id, "items", mergeList(base.items, items)),
      collectibles: sortByProgression(
        id, "collectibles", mergeList(base.collectibles ?? [], collectibles),
      ),
    };
    const found = ["bosses", "items", "collectibles"]
      .map((kind) => sources[`${id}/${kind}.json`])
      .filter(Boolean);
    const online = found.some((s) => s.source === "online");
    const dataStatus = {
      source: online ? "online" : found.length ? "cached" : "bundled",
      at: found.reduce((latest, s) => Math.max(latest, s.at ?? 0), 0) || null,
    };
    return { gameId, loaded, config, mediaManifest, dataStatus, selectGame, clearGame };
  }, [gameId, loaded, remote, sources, mediaManifest, selectGame, clearGame]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
