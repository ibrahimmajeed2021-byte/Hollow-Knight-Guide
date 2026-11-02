import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchRemote, readCached } from "../api/remote-data";
import { games } from "./config";

const STORAGE_KEY = "hollow-knight-guide:game";
const SETTINGS_KEY = "hollow-knight-guide:settings";
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [remote, setRemote] = useState({});

  useEffect(() => {
    let cancelled = false;
    const load = async (id, kind) => {
      const path = `${id}/${kind}.json`;
      const cached = await readCached(path);
      if (cached && !cancelled)
        setRemote((prev) => ({ ...prev, [path]: cached }));
      const fresh = await fetchRemote(path);
      if (fresh && !cancelled)
        setRemote((prev) => ({ ...prev, [path]: fresh }));
    };
    Object.keys(games).forEach((id) => {
      load(id, "bosses");
      load(id, "items");
    });
    return () => {
      cancelled = true;
    };
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
    const config = {
      ...base,
      bosses: bosses?.length ? bosses : base.bosses,
      items: items?.length ? items : base.items,
    };
    return { gameId, loaded, config, selectGame, clearGame };
  }, [gameId, loaded, remote, selectGame, clearGame]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
