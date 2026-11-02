import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { games } from './config';

const STORAGE_KEY = 'hollow-knight-guide:game';
const SETTINGS_KEY = 'hollow-knight-guide:settings';
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(SETTINGS_KEY), AsyncStorage.getItem(STORAGE_KEY)])
      .then(([settingsRaw, raw]) => {
        const remember = settingsRaw ? JSON.parse(settingsRaw).rememberGame === true : false;
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

  const value = useMemo(
    () => ({ gameId, loaded, config: games[gameId ?? 'hollow'], selectGame, clearGame }),
    [gameId, loaded, selectGame, clearGame],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
