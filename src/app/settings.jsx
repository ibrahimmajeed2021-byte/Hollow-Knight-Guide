import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { BackupSection } from "../components/hollow/backup-section";
import { Screen } from "../components/hollow/screen";
import { Title } from "../components/hollow/section-text";
import LoadingSoundSetting from "../components/LoadingSoundSettings.js";
import { useGame } from "../games/game-context";
import { usePurchases } from "../purchases/PurchasesContext";
import { useHaptics, useSettings } from "../settings/SettingsContext.jsx";
import { previewSelectorSound, stopSound } from "../sound/game-sounds";

const MODES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Automatic" },
];
const STYLES = [
  { value: "default", label: "Default" },
  { value: "hollowknight", label: "Hollow Knight" },
  { value: "silksong", label: "Silksong" },
];
const FONT_SIZES = [
  { value: "small", label: "Small" },
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra large" },
];
const INTENSITIES = [
  { value: "default", label: "Default" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

const LOADINGVOLUME = [
  { value: "disabled", label: "Disabled" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const SELECTOR_TRACKS = [
  { value: 0, label: "Hollow Knight Title Theme", game: "Hollow Knight" },
  { value: 1, label: "Silksong Title Theme", game: "Silksong" },
  { value: 2, label: "Bone Bottom", game: "Silksong" },
  { value: 3, label: "Bilewater", game: "Silksong" },
  { value: 4, label: "Choral Chambers", game: "Silksong" },
  { value: 5, label: "Lost Verdania", game: "Silksong" },
  { value: 6, label: "Songclave", game: "Silksong" },
  { value: 7, label: "High Halls", game: "Silksong" },
  { value: 8, label: "Dirtmouth", game: "Hollow Knight" },
  { value: 9, label: "Greenpath", game: "Hollow Knight" },
  { value: 10, label: "City of Tears", game: "Hollow Knight" },
  { value: 11, label: "Resting Grounds", game: "Hollow Knight" },
];

const SOURCE_LABELS = {
  online: "Online (latest)",
  cached: "Cached (saved from last time)",
  bundled: "Bundled (offline)",
};

function Section({ title, children }) {
  const { colors } = useSettings();
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {children}
    </View>
  );
}

function Segmented({ options, value, onChange }) {
  const { colors } = useSettings();
  return (
    <View style={styles.segmented} accessibilityRole="radiogroup">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[
              styles.option,
              { borderColor: colors.border },
              selected && {
                backgroundColor: colors.button,
                borderColor: colors.button,
              },
            ]}
          >
            <AppText
              style={[
                styles.optionText,
                selected && { color: colors.buttonText, fontWeight: "bold" },
              ]}
            >
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({ label, hint, value, onChange }) {
  const { colors } = useSettings();
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <AppText style={styles.rowLabel}>{label}</AppText>
        {hint ? (
          <AppText style={[styles.hint, { color: colors.muted }]}>
            {hint}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: colors.button }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, update, reset, colors } = useSettings();
  const { clearGame, dataStatus } = useGame();
  const triggerHaptic = useHaptics();
  const { isPremium } = usePurchases();

  // Stop a ringtone-style preview as soon as Settings is no longer focused.
  useFocusEffect(
    useCallback(() => {
      return () => stopSound();
    }, [])
  );

  return (
    <Screen>
      <Title>Settings</Title>

      <Section title="Premium">
        <AppText style={{ color: colors.muted }}>
          {isPremium
            ? "Premium is active. Your extra themes and selector music are unlocked."
            : "Unlock Hollow Knight and Silksong themes and more game-selector music."}
        </AppText>
        <Pressable
          onPress={() => router.push("/premium")}
          accessibilityRole="button"
          style={[styles.resetButton, { backgroundColor: colors.button, alignSelf: "stretch", marginTop: 4, alignItems: "center" }]}
        >
          <AppText style={[styles.resetText, { color: colors.buttonText }]}>
            {isPremium ? "Manage Premium" : "Explore Premium"}
          </AppText>
        </Pressable>
      </Section>

      <Section title="Appearance">
        <AppText style={styles.rowLabel}>Mode</AppText>
        <Segmented
          options={MODES}
          value={settings.mode}
          onChange={(mode) => update({ mode })}
        />
        <AppText style={styles.rowLabel}>Style</AppText>
        <Segmented
          options={STYLES.map((style) => ({
            ...style,
            label: !isPremium && style.value !== "default"
              ? `${style.label} 🔒`
              : style.label,
          }))}
          value={settings.themeStyle}
          onChange={(themeStyle) => {
            if (!isPremium && themeStyle !== "default") {
              router.push("/premium");
              return;
            }
            update({ themeStyle });
          }}
        />
        <ToggleRow
          label="High contrast"
          hint="Stronger colours and borders for easier reading"
          value={settings.highContrast}
          onChange={(highContrast) => update({ highContrast })}
        />
      </Section>

      <Section title="Text size">
        <Segmented
          options={FONT_SIZES}
          value={settings.fontSize}
          onChange={(fontSize) => update({ fontSize })}
        />
        <AppText style={[styles.hint, { color: colors.muted }]}>
          Preview: The quick knight explores Hallownest.
        </AppText>
      </Section>

      <Section title="Haptic feedback">
        <ToggleRow
          label="Haptics"
          hint="Vibration when switching tabs"
          value={settings.hapticsEnabled}
          onChange={(hapticsEnabled) => update({ hapticsEnabled })}
        />
        {settings.hapticsEnabled && (
          <>
            <AppText style={styles.rowLabel}>Intensity</AppText>
            <Segmented
              options={INTENSITIES}
              value={settings.hapticsIntensity}
              onChange={(hapticsIntensity) => {
                update({ hapticsIntensity });
                if (hapticsIntensity === "default") triggerHaptic();
              }}
            />
          </>
        )}
      </Section>

      <LoadingSoundSetting />

      <Section title="Game selector music">
        <ToggleRow
          label="Selector music"
          hint="Play music while choosing Hollow Knight or Silksong"
          value={settings.selectorMusicEnabled ?? true}
          onChange={(selectorMusicEnabled) => update({ selectorMusicEnabled })}
        />
        {settings.selectorMusicEnabled !== false && (
          <>
            <ToggleRow
              label="Randomise music"
              hint="Choose a different track at random each time the game menu opens"
              value={settings.selectorMusicRandom ?? true}
              onChange={(selectorMusicRandom) => update({ selectorMusicRandom })}
            />
            {settings.selectorMusicRandom === false && (
              <View style={styles.trackList}>
                <AppText style={styles.rowLabel}>Choose a song</AppText>
                {SELECTOR_TRACKS.map((track) => {
                  const selected = (settings.selectorMusicTrack ?? 0) === track.value;
                  const locked = !isPremium && track.value > 1;
                  return (
                    <Pressable
                      key={track.value}
                      onPress={() => {
                        if (locked) {
                          router.push("/premium");
                          return;
                        }
                        update({ selectorMusicTrack: track.value });
                        previewSelectorSound(track.value);
                      }}
                      accessibilityRole="radio"
                      accessibilityLabel={`${track.label}, from ${track.game}${locked ? ", Premium locked" : ""}`}
                      accessibilityState={{ selected }}
                      style={[
                        styles.trackOption,
                        { borderColor: colors.border },
                        selected && {
                          backgroundColor: colors.button,
                          borderColor: colors.button,
                        },
                      ]}
                    >
                      <View style={styles.trackText}>
                        <AppText
                          style={[
                            styles.trackName,
                            selected && { color: colors.buttonText, fontWeight: "bold" },
                          ]}
                        >
                          {track.label}
                        </AppText>
                        <AppText
                          style={[
                            styles.hint,
                            { color: selected ? colors.buttonText : colors.muted },
                          ]}
                        >
                          {track.game}
                        </AppText>
                      </View>
                      {selected ? (
                        <AppText style={{ color: colors.buttonText, fontWeight: "bold" }}>
                          Selected
                        </AppText>
                      ) : locked ? (
                        <AppText style={{ color: colors.muted, fontWeight: "bold" }}>
                          🔒 Premium
                        </AppText>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
      </Section>

      <Section title="Cards">
        <ToggleRow
          label="Start expanded"
          hint="Show full details on boss and charm cards without tapping"
          value={settings.startExpanded}
          onChange={(startExpanded) => update({ startExpanded })}
        />
      </Section>

      <Section title="Motion">
        <ToggleRow
          label="Reduce motion"
          hint="Turns off map momentum and zoom animations"
          value={settings.reduceMotion}
          onChange={(reduceMotion) => update({ reduceMotion })}
        />
        <ToggleRow
          label="Remember my game"
          hint="Off: always show the game menu on launch. On: reopen the last game you picked"
          value={settings.rememberGame}
          onChange={(rememberGame) => update({ rememberGame })}
        />
      </Section>

      <Pressable
        onPress={() => {
          clearGame();
          router.replace("/");
        }}
        accessibilityRole="button"
        style={[styles.resetButton, { backgroundColor: colors.button }]}
      >
        <AppText style={[styles.resetText, { color: colors.buttonText }]}>
          Main menu (switch game)
        </AppText>
      </Pressable>

      <Section title="Data">
        <AppText>{`Source: ${SOURCE_LABELS[dataStatus.source]}`}</AppText>
        <AppText style={{ color: colors.muted, fontSize: 13 }}>
          {dataStatus.at
            ? `Last updated ${new Date(dataStatus.at).toLocaleString()}`
            : "Using the data bundled with the app."}
        </AppText>
      </Section>

      <BackupSection />

      <Pressable
        onPress={reset}
        accessibilityRole="button"
        style={[styles.resetButton, { backgroundColor: colors.button }]}
      >
        <AppText style={[styles.resetText, { color: colors.buttonText }]}>
          Reset to defaults
        </AppText>
      </Pressable>
      <AppText style={[styles.hint, styles.centered, { color: colors.muted }]}>
        Defaults: light mode, default style, default text size, default haptics.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  sectionTitle: { fontWeight: "bold", fontSize: 18 },
  rowLabel: { fontSize: 16 },
  hint: { fontSize: 13 },
  centered: { textAlign: "center", marginTop: 8 },
  segmented: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
  },
  optionText: { fontSize: 14 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleText: { flex: 1, gap: 2 },
  trackList: { gap: 8, marginTop: 4 },
  trackOption: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  trackText: { flex: 1, gap: 2 },
  trackName: { fontSize: 15 },
  resetButton: {
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetText: { fontWeight: "bold" },
});
