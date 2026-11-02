import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'hollow-knight-guide:journal';
const JournalContext = createContext(null);

const emptyState = { photos: [], defeated: {} };

function journalDir() {
  const dir = new Directory(Paths.document, 'journal');
  if (!dir.exists) dir.create();
  return dir;
}

export function photoUri(photo) {
  return new File(journalDir(), photo.file).uri;
}

export function JournalProvider({ children }) {
  const [state, setState] = useState(emptyState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...emptyState, ...JSON.parse(raw) });
      })
      .catch(() => {});
  }, []);

  const commit = useCallback((updater) => {
    setState((prev) => {
      const next = updater(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const addPhoto = useCallback(
    (sourceUri, { tag = null, note = '' } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const file = `${id}.jpg`;
      new File(sourceUri).copy(new File(journalDir(), file));
      commit((prev) => ({
        ...prev,
        photos: [{ id, file, tag, note, createdAt: Date.now() }, ...prev.photos],
      }));
      return id;
    },
    [commit],
  );

  const updatePhoto = useCallback(
    (id, patch) =>
      commit((prev) => ({
        ...prev,
        photos: prev.photos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
    [commit],
  );

  const removePhoto = useCallback(
    (id) =>
      commit((prev) => {
        const photo = prev.photos.find((p) => p.id === id);
        if (photo) {
          try {
            new File(journalDir(), photo.file).delete();
          } catch {}
        }
        return { ...prev, photos: prev.photos.filter((p) => p.id !== id) };
      }),
    [commit],
  );

  const toggleDefeated = useCallback(
    (name) =>
      commit((prev) => {
        const defeated = { ...prev.defeated };
        if (defeated[name]) delete defeated[name];
        else defeated[name] = true;
        return { ...prev, defeated };
      }),
    [commit],
  );

  const value = useMemo(
    () => ({
      photos: state.photos,
      defeated: state.defeated,
      addPhoto,
      updatePhoto,
      removePhoto,
      toggleDefeated,
    }),
    [state, addPhoto, updatePhoto, removePhoto, toggleDefeated],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  return useContext(JournalContext);
}
