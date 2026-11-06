import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSettings } from '../settings/SettingsContext.jsx';
import { normaliseJournal } from './journal-utils.mjs';

const BASE_KEY = 'hollow-knight-guide:journal';
const JournalContext = createContext(null);

const emptyState = { photos: [], defeated: {}, collected: {}, notes: {} };

function journalDir() {
  const dir = new Directory(Paths.document, 'journal');
  if (!dir.exists) dir.create();
  return dir;
}

export function photoUri(photo) {
  return new File(journalDir(), photo.file).uri;
}

export function JournalProvider({ children, suffix = '' }) {
  const STORAGE_KEY = BASE_KEY + suffix;
  const { colors } = useSettings();
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    let mounted = true;
    setReady(false);
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        setState(raw ? normaliseJournal(JSON.parse(raw)) : emptyState);
      })
      .catch(() => {
        // A damaged backup must never prevent the guide from starting.
        if (mounted) setState(emptyState);
      })
      .finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, [STORAGE_KEY]);

  // Do not show a blank journal that could accept a toggle before its saved
  // progress is loaded. Persist after hydration, in order, to avoid older
  // asynchronous writes replacing the newest state during rapid toggles.
  useEffect(() => {
    if (!ready) return;
    const snapshot = JSON.stringify(state);
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(STORAGE_KEY, snapshot));
  }, [state, ready, STORAGE_KEY]);

  const commit = useCallback((updater) => {
    setState((prev) => updater(prev));
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

  const toggleCollected = useCallback(
    (name) =>
      commit((prev) => {
        const collected = { ...prev.collected };
        if (collected[name]) delete collected[name];
        else collected[name] = true;
        return { ...prev, collected };
      }),
    [commit],
  );

  const setNote = useCallback(
    (name, text) =>
      commit((prev) => {
        const notes = { ...prev.notes };
        if (text.trim()) notes[name] = text;
        else delete notes[name];
        return { ...prev, notes };
      }),
    [commit],
  );

  const resetProgress = useCallback(
    () => commit((prev) => ({ ...prev, defeated: {}, collected: {} })),
    [commit],
  );

  const restoreProgress = useCallback(
    ({ defeated, collected, notes }) =>
      commit((prev) => ({
        ...prev,
        defeated: defeated ?? {},
        collected: collected ?? {},
        notes: notes ?? {},
      })),
    [commit],
  );

  const value = useMemo(
    () => ({
      restoreProgress,
      photos: state.photos,
      defeated: state.defeated,
      collected: state.collected,
      notes: state.notes,
      setNote,
      toggleCollected,
      resetProgress,
      addPhoto,
      updatePhoto,
      removePhoto,
      toggleDefeated,
    }),
    [state, addPhoto, updatePhoto, removePhoto, toggleDefeated, toggleCollected, resetProgress, restoreProgress, setNote],
  );

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator
          color={colors.accent}
          size="large"
          accessibilityLabel="Loading your saved guide progress"
        />
      </View>
    );
  }
  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  return useContext(JournalContext);
}
