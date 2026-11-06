import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useGame } from "../games/game-context";
import { useJournal } from "../journal/journal-context";
import { useSettings } from "../settings/SettingsContext.jsx";
import {
  entryRevealKey,
  hiddenLabel,
  isEntryCompleted,
  visibleInGuidedMode,
  hintFor,
} from "./guided-logic.mjs";

const Context = createContext(null);
const PREFIX = "hollow-knight-guide:premium-guided:";

export function GuidedModeProvider({ children }) {
  const { config } = useGame();
  const { defeated, collected } = useJournal();
  const { settings } = useSettings();
  const [revealed, setRevealed] = useState({});
  const [goal, setGoal] = useState(null);
  const [ready, setReady] = useState(false);
  const key = PREFIX + config.id;

  useEffect(() => {
    let active = true;
    setReady(false);
    setRevealed({});
    setGoal(null);
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!active || !raw) return;
        const value = JSON.parse(raw);
        if (value.revealed && typeof value.revealed === "object") setRevealed(value.revealed);
        if (value.goal && ["boss", "item", "collectible"].includes(value.goal.kind) &&
            typeof value.goal.name === "string") setGoal(value.goal);
      })
      .catch(() => {})
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [key]);

  const save = useCallback((nextRevealed, nextGoal) => {
    AsyncStorage.setItem(key, JSON.stringify({ revealed: nextRevealed, goal: nextGoal }))
      .catch(() => {});
  }, [key]);

  const revealEntry = useCallback((kind, item) => {
    if (!item?.name) return;
    setRevealed((previous) => {
      const next = { ...previous, [entryRevealKey(kind, item)]: true };
      save(next, goal);
      return next;
    });
  }, [goal, save]);

  const chooseGoal = useCallback((nextGoal) => {
    const next = nextGoal && ["boss", "item", "collectible"].includes(nextGoal.kind)
      ? { kind: nextGoal.kind, name: nextGoal.name } : null;
    setGoal(next);
    save(revealed, next);
  }, [revealed, save]);

  const enabled = settings.guidedMode === true;
  const window = settings.spoilerWindow ?? "balanced";
  const isVisible = useCallback((kind, item) =>
    !ready || visibleInGuidedMode({
      enabled,
      window,
      kind,
      item,
      config,
      defeated,
      collected,
      revealed,
    }),
  [enabled, window, config, defeated, collected, revealed, ready]);

  const value = useMemo(() => ({
    enabled,
    ready,
    window,
    isVisible,
    revealEntry,
    chooseGoal,
    goal,
    hiddenLabel,
    hintFor,
    isCompleted: (kind, item) => isEntryCompleted(kind, item, defeated, collected),
  }), [enabled, ready, window, isVisible, revealEntry, chooseGoal, goal, defeated, collected]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useGuidedMode() {
  const context = useContext(Context);
  if (!context) throw new Error("useGuidedMode needs GuidedModeProvider");
  return context;
}
