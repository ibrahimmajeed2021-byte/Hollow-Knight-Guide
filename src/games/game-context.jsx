import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { games } from './config';

const STORAGE_KEY = 'hollow-knight-guide:game';
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameId, setGameId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw && games[raw]) setGameId(raw);
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
