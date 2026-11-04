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
import { selectorTracks, stopSound } from "../../sound/game-sounds";

const FAVOURITES_KEY = "hollow-knight-guide:music-favourites";

function formatTime(seconds = 0) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safe / 60);
  const remaining = Math.floor(safe % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function MusicScreen() {
  const { colors } = useSettings();
  const { gameId } = useGame();
  const gameTracks = selectorTracks.filter((track) => track.id === (gameId ?? "hollow"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoaded, setFavouritesLoaded] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const player = useAudioPlayer(gameTracks[0].source);
  const status = useAudioPlayerStatus(player);

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
    // If the user switches games while this tab is mounted, reset to that game\u2019s first song.
    player.replace(gameTracks[0].source);
    setSelectedIndex(0);
  }, [gameId]);
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
      player.replace(gameTracks[nextIndex].source);
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
    const nextIndex =
      (selectedIndex + direction + gameTracks.length) % gameTracks.length;
    playTrack(nextIndex);
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

      <AppText style={styles.listHeading}>{gameTracks[0].game} songs</AppText>
      <View style={styles.trackList}>
        {visibleTracks.map(({ track, index }) => {
          const selected = index === selectedIndex;
          return (
            <Pressable
              key={track.title}
              onPress={() => playTrack(index)}
              accessibilityRole="button"
              accessibilityLabel={`Play ${track.title}, from ${track.game}`}
              accessibilityState={{ selected }}
              style={[
                styles.trackRow,
                { backgroundColor: colors.card, borderColor: colors.border },
                selected && { borderColor: colors.accent, borderWidth: 2 },
              ]}
            >
              <Pressable style={styles.trackMain} onPress={() => playTrack(index)} accessibilityRole="button" accessibilityLabel={`Play ${track.title}, from ${track.game}`} accessibilityState={{ selected }}>\n              <View style={styles.trackNumber}>
                <AppText style={[styles.numberText, { color: colors.muted }]}>
                  {String(index + 1).padStart(2, "0")}
                </AppText>
              </View>
              <View style={styles.trackInfo}>
                <AppText style={styles.listTrackTitle}>{track.title}</AppText>
                <AppText style={[styles.trackGame, { color: colors.muted }]}>{track.game}</AppText>
              </View>
              <AppText style={[styles.listAction, { color: colors.accent }]}>
                {selected && status.playing ? "Playing" : selected ? "Selected" : "Play"}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontSize: 30, marginHorizontal: 16 },
  nowPlaying: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderWidth: 1,
    borderRadius: 14,
    gap: 8,
  },
  eyebrow: { fontSize: 12, fontWeight: "bold", letterSpacing: 2 },
  trackTitle: { fontSize: 23, fontWeight: "bold", lineHeight: 30 },
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
  modeButton: { borderWidth: 1, borderRadius: 18, paddingVertical: 8, paddingHorizontal: 12 },
  modeText: { fontSize: 13, fontWeight: "bold" },
  headingRow: { marginHorizontal: 16, marginTop: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  listHeading: { fontSize: 21, fontWeight: "bold" },
  filterText: { fontSize: 14, fontWeight: "bold" },
  trackList: { paddingHorizontal: 16, paddingTop: 10, gap: 8 },
  trackRow: {
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 10,
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
  favouriteButton: { width: 40, minHeight: 44, alignItems: "center", justifyContent: "center" },
  favouriteIcon: { fontSize: 25 },
  emptyText: { padding: 16, textAlign: "center", lineHeight: 22 },
});
