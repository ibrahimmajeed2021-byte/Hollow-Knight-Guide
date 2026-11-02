import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const BASE_KEY = 'hollow-knight-guide:loadouts';
const LoadoutsContext = createContext(null);

export function LoadoutsProvider({ children, suffix = '' }) {
  const STORAGE_KEY = BASE_KEY + suffix;
  const [loadouts, setLoadouts] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setLoadouts(JSON.parse(raw));
      })
      .catch(() => {});
  }, [STORAGE_KEY]);

  const commit = useCallback((updater) => {
    setLoadouts((prev) => {
      const next = updater(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [STORAGE_KEY]);

  const saveLoadout = useCallback(
    (loadout) => {
      const id = loadout.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      commit((prev) =>
        prev.some((l) => l.id === id)
          ? prev.map((l) => (l.id === id ? { ...loadout, id } : l))
          : [{ ...loadout, id }, ...prev],
      );
      return id;
    },
    [commit],
  );

  const deleteLoadout = useCallback(
    (id) => commit((prev) => prev.filter((l) => l.id !== id)),
    [commit],
  );

  const replaceLoadouts = useCallback((list) => commit(() => list), [commit]);

  const value = useMemo(
    () => ({ loadouts, saveLoadout, deleteLoadout, replaceLoadouts }),
    [loadouts, saveLoadout, deleteLoadout, replaceLoadouts],
  );
  return <LoadoutsContext.Provider value={value}>{children}</LoadoutsContext.Provider>;
}

export function useLoadouts() {
  return useContext(LoadoutsContext);
}
