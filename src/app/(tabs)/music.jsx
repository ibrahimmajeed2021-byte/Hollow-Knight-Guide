import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Slider from "@react-native-community/slider";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { AppText } from "../../components/hollow/app-text";
import { Screen } from "../../components/hollow/screen";
import { Title } from "../../components/hollow/section-text";
import { useSettings } from "../../settings/SettingsContext.jsx";
import { useGame } from "../../games/game-context";
import { layout, radius, space, type } from "../../ui/design-system";
import { useOnlineAccess } from "../../network/online-access-context";
import { selectorTracks, sourceForTrack, stopSound } from "../../sound/game-sounds";

const FAVOURITES_KEY = "hollow-knight-guide:music-favourites";

function formatTime(seconds = 0) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const remaining = Math.floor(safe % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function MusicScreen() {
  const { colors } = useSettings();
  const { gameId, mediaManifest } = useGame();
  const { blocked, status: connectionStatus } = useOnlineAccess();
  const gameTracks = selectorTracks.filter((track) => track.id === (gameId ?? "hollow"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoaded, setFavouritesLoaded] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const trackSource = (track) =>
    sourceForTrack(track, mediaManifest?.audio, connectionStatus === "online");
  const player = useAudioPlayer(trackSource(gameTracks[0]));
  const status = useAudioPlayerStatus(player);

  // An audio player can continue in the background, so stop it when
  // a Free account loses connection rather than only covering the screen.
  useEffect(() => {
    if (blocked) player.pause();
  }, [blocked, player]);

  useEffect(() => {
    // Keep the music playing when the app is backgrounded or the screen is locked.
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    }).catch(() => {});
    // Stop the automatic game-menu soundtrack before starting manual playback.
    stopSound();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(FAVOURITES_KEY)
      .then((saved) => { if (saved) setFavourites(JSON.parse(saved)); })
      .catch(() => {})
      .finally(() => setFavouritesLoaded(true));
  }, []);

  useEffect(() => {
    if (favouritesLoaded) AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites)).catch(() => {});
  }, [favourites, favouritesLoaded]);

  useEffect(() => {
    player.loop = repeat;
  }, [repeat, player]);

  useEffect(() => {
    player.replace(trackSource(gameTracks[0]));
    setSelectedIndex(0);
  }, [gameId]);

  // If a Premium user loses connectivity while streaming an authorised API
  // track, switch back to the bundled recording so playback remains available.
  useEffect(() => {
    if (connectionStatus !== "online" && !blocked) {
      const local = gameTracks[selectedIndex]?.source;
      if (local) player.replace(local);
    }
  }, [connectionStatus, blocked]);
  const selectedTrack = gameTracks[selectedIndex];
  const duration = status.duration || 0;
  const currentTime = status.currentTime || 0;
  const visibleTracks = gameTracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => !showFavourites || favourites.includes(track.title));

  function activateLockScreenControls(track) {
    player.setActiveForLockScreen(true, {
      title: track.title,
      artist: track.game,
      albumTitle: "Hollow Knight Guide Soundtrack",
    }, {
      showNextTrack: true,
      showPreviousTrack: true,
    });
  }

  function playTrack(index) {
    const nextIndex = Math.max(0, Math.min(gameTracks.length - 1, index));
    if (nextIndex !== selectedIndex) {
      player.replace(trackSource(gameTracks[nextIndex]));
      setSelectedIndex(nextIndex);
    }
    activateLockScreenControls(gameTracks[nextIndex]);
    player.play();
  }

  function togglePlayback() {
    if (status.playing) player.pause();
    else {
      activateLockScreenControls(selectedTrack);
      player.play();
    }
  }

  function skipTrack(direction) {
    let nextIndex;
    if (shuffle && direction > 0 && gameTracks.length > 1) {
      do { nextIndex = Math.floor(Math.random() * gameTracks.length); }
      while (nextIndex === selectedIndex);
    } else {
      nextIndex = (selectedIndex + direction + gameTracks.length) % gameTracks.length;
    }
    playTrack(nextIndex);
  }

  function toggleFavourite(track) {
    setFavourites((current) => current.includes(track.title)
      ? current.filter((title) => title !== track.title)
      : [...current, track.title]);
  }

  return (
    <Screen>
      <Title style={styles.pageTitle}>Music player</Title>
      <View style={[styles.nowPlaying, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={[styles.eyebrow, { color: colors.muted }]}>NOW PLAYING</AppText>
        <AppText style={styles.trackTitle}>{selectedTrack.title}</AppText>
        <AppText style={[styles.trackGame, { color: colors.muted }]}>{selectedTrack.game}</AppText>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={Math.max(duration, 1)}
          value={Math.min(currentTime, duration || 0)}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.accent}
          onSlidingComplete={(value) => player.seekTo(value)}
          accessibilityLabel="Song position"
        />
        <View style={styles.timeRow}>
          <AppText style={[styles.timeText, { color: colors.muted }]}>{formatTime(currentTime)}</AppText>
          <AppText style={[styles.timeText, { color: colors.muted }]}>{formatTime(duration)}</AppText>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={() => skipTrack(-1)}
            accessibilityRole="button"
            accessibilityLabel="Previous song"
            style={[styles.controlButton, { borderColor: colors.border }]}
          >
            <AppText style={styles.controlText}>|◀</AppText>
          </Pressable>
          <Pressable
            onPress={togglePlayback}
            accessibilityRole="button"
            accessibilityLabel={status.playing ? "Pause" : "Play"}
            style={[styles.playButton, { backgroundColor: colors.button }]}
          >
            <AppText style={[styles.playText, { color: colors.buttonText }]}>
              {status.playing ? "Ⅱ" : "▶"}
            </AppText>
          </Pressable>
          <Pressable
            onPress={() => skipTrack(1)}
            accessibilityRole="button"
            accessibilityLabel="Next song"
            style={[styles.controlButton, { borderColor: colors.border }]}
          >
            <AppText style={styles.controlText}>▶|</AppText>
          </Pressable>
        </View>
      </View>

      <View style={styles.extraControls}>
        <Pressable onPress={() => setShuffle((value) => !value)} accessibilityRole="button" accessibilityState={{ selected: shuffle }} style={[styles.modeButton, { borderColor: shuffle ? colors.accent : colors.border }]}>
          <AppText style={[styles.modeText, { color: shuffle ? colors.accent : colors.muted }]}>⇄ Shuffle {shuffle ? "On" : "Off"}</AppText>
        </Pressable>
        <Pressable onPress={() => setRepeat((value) => !value)} accessibilityRole="button" accessibilityState={{ selected: repeat }} style={[styles.modeButton, { borderColor: repeat ? colors.accent : colors.border }]}>
          <AppText style={[styles.modeText, { color: repeat ? colors.accent : colors.muted }]}>↻ Repeat {repeat ? "On" : "Off"}</AppText>
        </Pressable>
      </View>
      <View style={styles.headingRow}>
        <AppText style={styles.listHeading}>{gameTracks[0].game} songs</AppText>
        <Pressable onPress={() => setShowFavourites((value) => !value)} accessibilityRole="button">
          <AppText style={[styles.filterText, { color: colors.accent }]}>{showFavourites ? "Show all" : "♥ Favourites"}</AppText>
        </Pressable>
      </View>
      <View style={styles.trackList}>
        {visibleTracks.map(({ track, index }) => {
          const selected = index === selectedIndex;
          const favourite = favourites.includes(track.title);
          return (
            <View key={track.title} style={[styles.trackRow, { backgroundColor: colors.card, borderColor: colors.border }, selected && { borderColor: colors.accent, borderWidth: 2 }]}>
              <Pressable style={styles.trackMain} onPress={() => playTrack(index)} accessibilityRole="button" accessibilityLabel={`Play ${track.title}, from ${track.game}`} accessibilityState={{ selected }}>
                <View style={styles.trackNumber}>
                  <AppText style={[styles.numberText, { color: colors.muted }]}>{String(index + 1).padStart(2, "0")}</AppText>
                </View>
                <View style={styles.trackInfo}>
                  <AppText style={styles.listTrackTitle}>{track.title}</AppText>
                  <AppText style={[styles.trackGame, { color: colors.muted }]}>{track.game}</AppText>
                </View>
                <AppText style={[styles.listAction, { color: colors.accent }]}>{selected && status.playing ? "Playing" : selected ? "Selected" : "Play"}</AppText>
              </Pressable>
              <Pressable onPress={() => toggleFavourite(track)} accessibilityRole="button" accessibilityLabel={favourite ? `Remove ${track.title} from favourites` : `Add ${track.title} to favourites`} accessibilityState={{ selected: favourite }} style={styles.favouriteButton}>
                <AppText style={[styles.favouriteIcon, { color: favourite ? colors.accent : colors.muted }]}>{favourite ? "♥" : "♡"}</AppText>
              </Pressable>
            </View>
          );
        })}
        {visibleTracks.length === 0 && <AppText style={[styles.emptyText, { color: colors.muted }]}>No favourites yet. Tap the heart beside a song to save it here.</AppText>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: { ...type.title, marginHorizontal: layout.gutter },
  nowPlaying: {
    marginHorizontal: layout.gutter,
    marginTop: space.lg,
    padding: layout.cardPadding,
    borderWidth: 1,
    borderRadius: radius.card,
    gap: space.sm,
  },
  eyebrow: { fontSize: 12, fontWeight: "bold", letterSpacing: 2 },
  trackTitle: { ...type.heading },
  trackGame: { fontSize: 13 },
  slider: { width: "100%", height: 34, marginTop: 12 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeText: { fontSize: 12, fontVariant: ["tabular-nums"] },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
    marginTop: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  controlText: { fontSize: 19 },
  playButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  playText: { fontSize: 25, fontWeight: "bold" },
  extraControls: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 10 },
  modeButton: { borderWidth: 1, borderRadius: radius.pill, minHeight: layout.touchTarget, paddingVertical: space.sm, paddingHorizontal: space.md, justifyContent: "center" },
  modeText: { fontSize: 13, fontWeight: "bold" },
  headingRow: { marginHorizontal: layout.gutter, marginTop: space.xxl, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  listHeading: { ...type.heading },
  filterText: { fontSize: 14, fontWeight: "bold" },
  trackList: { paddingHorizontal: layout.gutter, paddingTop: space.md, gap: space.sm },
  trackRow: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trackMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  trackNumber: { width: 30, alignItems: "center" },
  numberText: { fontSize: 13, fontVariant: ["tabular-nums"] },
  trackInfo: { flex: 1, gap: 3 },
  listTrackTitle: { fontSize: 15, fontWeight: "bold" },
  listAction: { fontSize: 13, fontWeight: "bold" },
  favouriteButton: { width: layout.touchTarget, minHeight: layout.touchTarget, alignItems: "center", justifyContent: "center" },
  favouriteIcon: { fontSize: 25 },
  emptyText: { padding: 16, textAlign: "center", lineHeight: 22 },
});
