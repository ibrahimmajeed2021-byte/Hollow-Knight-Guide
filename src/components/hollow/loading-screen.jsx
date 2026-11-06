import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { HKFont } from "../../constants/hollow";
import { games } from "../../games/config";
import { useGame } from "../../games/game-context";
import { usePurchases } from "../../purchases/PurchasesContext";
import { useSettings } from "../../settings/SettingsContext.jsx";
import {
  pickRandomGameId,
  playLoadingSound,
  playSelectorSound,
  setSoundVolume,
  stopSound,
} from "../../sound/game-sounds";

// Keep the loading theme audible before transitioning. Silent loading stays quick.
const MUSIC_HOLD_MS = 3000;
const QUICK_HOLD_MS = 800;
const REDUCED_MOTION_QUICK_MS = 280;

export function LoadingScreen() {
  const { settings } = useSettings();
  const { isPremium } = usePurchases();
  const { config, gameId, loaded } = useGame();
  const launch = !gameId;
  // Which game's loading sound the launch screen uses; re-rolled on every launch.
  const [launchPick] = useState(pickRandomGameId);
  const heroes = launch ? [games.hollow, games.silksong] : [config];
  const words = launch
    ? ["HOLLOW KNIGHT & SILKSONG"]
    : config.guideTitle.toUpperCase().split(" ");
  const subtitle = launch ? "GUIDE" : words.pop();
  const [visible, setVisible] = useState(true);
  const reduce = settings.reduceMotion;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // Start the hold only AFTER the audio player has been set up and playback
  // requested. This stops iOS audio initialization from eating into the intro.
  // Reduce motion shortens animations, but must not cut enabled audio short.
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    let timer;
    const soundEnabled = settings.loadingSoundEnabled !== false
      && (settings.loadingSoundVolume ?? 80) > 0;
    const volume = soundEnabled ? (settings.loadingSoundVolume ?? 80) / 100 : 0;
    setSoundVolume(volume);

    const quickMs = reduce ? REDUCED_MOTION_QUICK_MS : QUICK_HOLD_MS;
    // Even if loading sound is disabled, request playback with volume zero
    // so a previous selector track is faded out on game selection.
    playLoadingSound(launch ? launchPick : gameId)
      .then((started) => {
        if (cancelled) return;
        timer = setTimeout(
          () => setVisible(false),
          soundEnabled && started ? MUSIC_HOLD_MS : quickMs,
        );
      })
      .catch(() => {
        if (!cancelled) timer = setTimeout(() => setVisible(false), quickMs);
      });

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [
    loaded, launch, launchPick, gameId, reduce,
    settings.loadingSoundEnabled, settings.loadingSoundVolume,
  ]);

  // The game picker sits under this overlay, so its music starts once the launch screen is gone.
  useEffect(() => {
    if (!launch || !loaded || visible) return;
    if (!settings.selectorMusicEnabled) {
      stopSound();
      return;
    }
    playSelectorSound(
      settings.selectorMusicRandom ?? true,
      settings.selectorMusicTrack ?? 0,
      isPremium
    );
  }, [
    launch,
    loaded,
    visible,
    settings.selectorMusicEnabled,
    settings.selectorMusicRandom,
    settings.selectorMusicTrack,
    isPremium,
  ]);

  // A game's loading sound fades out as the guide appears.
  useEffect(() => {
    if (!launch && !visible) stopSound();
  }, [launch, visible]);

  if (!visible) return null;

  return (
    <Animated.View
      exiting={reduce ? undefined : FadeOut.duration(180)}
      pointerEvents="auto"
      style={[
        styles.overlay,
        { backgroundColor: launch ? "#000" : config.loadingColor },
      ]}
    >
      {!launch && config.loadingBackground ? (
        <>
          <Image
            source={config.loadingBackground}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            blurRadius={2}
          />
          <View style={[StyleSheet.absoluteFill, styles.dim]} />
        </>
      ) : null}
      <Animated.View
        entering={reduce ? undefined : FadeIn.duration(260)}
        style={styles.heroes}
      >
        {heroes.map((g) => (
          <View key={g.id}>
            <Image
              source={g.loadingImage}
              style={g.loadingImageSize}
              contentFit="contain"
            />
          </View>
        ))}
      </Animated.View>
      <Animated.View
        entering={reduce ? undefined : FadeIn.delay(100).duration(300)}
      >
        <Text style={styles.title}>{words.join(" ")}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dim: { backgroundColor: "rgba(0,0,0,0.55)" },
  heroes: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  title: {
    color: "#fff",
    fontFamily: HKFont,
    fontSize: 26,
    letterSpacing: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    fontFamily: HKFont,
    fontSize: 14,
    letterSpacing: 8,
    textAlign: "center",
    marginTop: 4,
  },
});
