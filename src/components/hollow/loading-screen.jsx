import { ApiArtworkImage } from "./api-artwork-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { HKFont } from "../../constants/hollow";
import { games } from "../../games/config";
import { resolveTheme } from "../../themes/theme-catalog";
import { useGame } from "../../games/game-context";
import { usePurchases } from "../../purchases/PurchasesContext";
import { useOnlineAccess } from "../../network/online-access-context";
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
  const { settings, colors } = useSettings();
  const { isPremium } = usePurchases();
  const { status: onlineStatus } = useOnlineAccess();
  const { config, gameId, loaded, mediaManifest } = useGame();
  const launch = !gameId;
  // Which game's loading sound the launch screen uses; re-rolled on every launch.
  const [launchPick] = useState(pickRandomGameId);
  const activeTheme = resolveTheme(settings.themeStyle);
  const customTheme = !launch && activeTheme.id !== "default" && !settings.highContrast;
  const hostedTheme = customTheme && onlineStatus === "online"
    ? mediaManifest?.themes?.[activeTheme.id] : null;
  const splashBackground = customTheme
    ? activeTheme.backgroundAsset : config.loadingBackground;
  const splashBackgroundUrl = customTheme
    ? hostedTheme?.backgroundImageUrl : config.backgroundImageUrl;
  const heroes = launch
    ? [games.hollow, games.silksong].map((game) => ({
        ...game,
        heroImageUrl: mediaManifest?.games?.[game.id]?.heroImageUrl,
      }))
    : customTheme
      ? [{
          ...config,
          loadingImage: activeTheme.motifAsset ?? config.loadingImage,
          heroImageUrl: hostedTheme?.motifImageUrl,
          loadingImageSize: { width: 170, height: 165 },
        }]
      : [config];
  const words = launch
    ? ["HOLLOW KNIGHT & SILKSONG"]
    : config.guideTitle.toUpperCase().split(" ");
  const subtitle = launch ? "GUIDE" : words.pop();
  const [visible, setVisible] = useState(true);
  const reduce = settings.reduceMotion;
  // Snapshot startup preferences once for this splash instance. Settings remain
  // live elsewhere, but changing them must never replay the loading theme or
  // reset its timer while the user is browsing the app.
  const startupSettings = useRef({
    soundEnabled: settings.loadingSoundEnabled,
    soundVolume: settings.loadingSoundVolume,
    reduceMotion: settings.reduceMotion,
  });

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // This runs once per game-selection splash (the parent keys the component
  // by gameId), after game state is loaded. Do not depend on live Settings:
  // toggling Reduce Motion, volume or sound must not restart loading music.
  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    let timer;
    // Never trap the user behind the splash if audio setup/playback stalls.
    // This fallback runs independently of the playback promise.
    const safetyTimer = setTimeout(() => setVisible(false), MUSIC_HOLD_MS + 1500);
    const prefs = startupSettings.current;
    const soundEnabled = prefs.soundEnabled !== false
      && (prefs.soundVolume ?? 80) > 0;
    const volume = soundEnabled ? (prefs.soundVolume ?? 80) / 100 : 0;
    setSoundVolume(volume);

    const quickMs = prefs.reduceMotion
      ? REDUCED_MOTION_QUICK_MS
      : QUICK_HOLD_MS;
    // Even if loading sound is disabled, request playback with volume zero
    // so a previous selector track is faded out on game selection.
    playLoadingSound(launch ? launchPick : gameId, mediaManifest?.audio, onlineStatus === "online")
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
      clearTimeout(safetyTimer);
      if (timer) clearTimeout(timer);
    };
  }, [loaded, launch, launchPick, gameId]);

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
      isPremium,
      mediaManifest?.audio,
      onlineStatus === "online"
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
        { backgroundColor: launch ? "#000" : customTheme ? colors.header : config.loadingColor },
      ]}
    >
      {!launch && (splashBackground || splashBackgroundUrl) ? (
        <>
          <ApiArtworkImage
            iconUrl={splashBackgroundUrl}
            fallbackImage={splashBackground}
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
            <ApiArtworkImage
              iconUrl={g.heroImageUrl}
              fallbackImage={g.loadingImage}
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
