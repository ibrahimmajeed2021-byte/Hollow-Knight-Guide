import { router, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { useAds } from "../ads/AdsContext";
import { AppText } from "../components/hollow/app-text";
import { BackupSection } from "../components/hollow/backup-section";
import { Screen } from "../components/hollow/screen";
import { Title } from "../components/hollow/section-text";
import LoadingSoundSetting from "../components/LoadingSoundSettings.js";
import { useGame } from "../games/game-context";
import { usePurchases } from "../purchases/PurchasesContext";
import { useHaptics, useSettings } from "../settings/SettingsContext.jsx";
import { previewSelectorSound, stopSound } from "../sound/game-sounds";
import { palettes } from "../constants/hollow";
import { themeCatalog } from "../themes/theme-catalog";

const MODES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Automatic" },
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
  online: "Online (checked this session)",
  cached: "Cached (saved from last time)",
  bundled: "Bundled (offline)",
};

function Section({ title, children }) {
  const { colors } = useSettings();
  return (
    <View style={styles.section}>
      <AppText style={[styles.sectionTitle, { color: colors.text }]}>{title}</AppText>
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

function ThemeChoice({ theme, selected, isPremium, onChoose }) {
  const { colors } = useSettings();
  const preview = palettes[theme.id + "Dark"] ?? palettes.dark;
  const locked = !isPremium && theme.id !== "default";
  return (
    <Pressable
      onPress={onChoose}
      accessibilityRole="button"
      accessibilityLabel={theme.name + (locked ? ", Premium theme, locked" : selected ? ", selected" : ", apply theme")}
      accessibilityState={{ selected }}
      style={[
        styles.themeChoice,
        { backgroundColor: colors.card, borderColor: selected ? colors.accent : colors.border },
        selected && styles.themeChoiceSelected,
      ]}
    >
      <View style={[styles.themePreview, { backgroundColor: preview.background }]}>
        {theme.backgroundAsset ? (
          <Image source={theme.backgroundAsset} style={[StyleSheet.absoluteFill, { opacity: 0.46 }]} contentFit="cover" accessible={false} />
        ) : null}
        {theme.motifAsset ? (
          <Image source={theme.motifAsset} style={styles.themePreviewMotif} contentFit="contain" accessible={false} />
        ) : null}
        <View style={[styles.themePreviewLine, { backgroundColor: preview.accent }]} />
        <View style={[styles.themePreviewDot, { backgroundColor: preview.accent }]} />
      </View>
      <AppText style={styles.themeChoiceTitle} numberOfLines={2}>{theme.name}</AppText>
      <AppText style={[styles.themeChoiceTagline, { color: colors.muted }]} numberOfLines={2}>
        {theme.tagline}
      </AppText>
      <AppText style={[styles.themeChoiceStatus, { color: colors.accent }]}>
        {selected ? "✓ Selected" : locked ? "🔒 Premium" : "Apply"}
      </AppText>
    </Pressable>
  );
}

function SettingsCategory({ title, subtitle, symbol, open, onPress, children }) {
  const { colors } = useSettings();
  return (
    <View style={[
      styles.category,
      { backgroundColor: colors.card, borderColor: open ? colors.accent : colors.border },
    ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={open ? "Collapse settings category" : "Expand settings category"}
        accessibilityState={{ expanded: open }}
        onPress={onPress}
        style={styles.categoryHeader}
      >
        <View style={[styles.categorySymbol, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <AppText style={[styles.categoryGlyph, { color: colors.accent }]}>{symbol}</AppText>
        </View>
        <View style={styles.categoryText}>
          <AppText style={styles.categoryTitle}>{title}</AppText>
          <AppText style={[styles.categorySubtitle, { color: colors.muted }]}>{subtitle}</AppText>
        </View>
        <AppText style={[styles.categoryChevron, { color: colors.accent }]}>{open ? "−" : "+"}</AppText>
      </Pressable>
      {open ? (
        <View style={[styles.categoryBody, { borderTopColor: colors.border }]}>
          {children}
        </View>
      ) : null}
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
  const { privacyOptionsRequired, showPrivacyOptions } = useAds();
  const [expanded, setExpanded] = useState(null);
  const [themesOpen, setThemesOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const toggleCategory = (id) => {
    setExpanded((current) => current === id ? null : id);
    setConfirmReset(false);
  };

  // Stop a ringtone-style preview as soon as Settings is no longer focused.
  useFocusEffect(
    useCallback(() => {
      return () => stopSound();
    }, [])
  );

  return (
    <Screen contentStyle={styles.screenContent}>
      <Title>Settings</Title>
      <AppText style={[styles.screenSubtitle, { color: colors.muted }]}>
        Make the guide comfortable to use. Choose a category to see its options.
      </AppText>

      <View style={[styles.premiumSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.premiumSymbol, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <AppText style={[styles.categoryGlyph, { color: colors.accent }]}>✧</AppText>
        </View>
        <View style={styles.categoryText}>
          <AppText style={styles.categoryTitle}>
            {isPremium ? "Premium Companion" : "Your field guide"}
          </AppText>
          <AppText style={[styles.categorySubtitle, { color: colors.muted }]}>
            {isPremium
              ? "Premium active · planning, themes and offline access"
              : "Complete guides stay free · discover optional extras"}
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push("/companion")}
          accessibilityRole="button"
          accessibilityLabel={isPremium ? "Open Premium Companion" : "Discover Premium Companion"}
          style={styles.premiumLink}
        >
          <AppText style={[styles.premiumLinkText, { color: colors.accent }]}>Open ›</AppText>
        </Pressable>
      </View>

      <View style={styles.categoryList}>
        <SettingsCategory
          title="Appearance & themes"
          subtitle="Light or dark mode and Hallownest-inspired themes"
          symbol="✦"
          open={expanded === "appearance"}
          onPress={() => toggleCategory("appearance")}
        >
      <Section title="Appearance">
        <AppText style={styles.rowLabel}>Mode</AppText>
        <Segmented
          options={MODES}
          value={settings.mode}
          onChange={(mode) => update({ mode })}
        />
        <AppText style={styles.rowLabel}>Theme</AppText>
        <AppText style={[styles.hint, { color: colors.muted }]}>
          Choose a Hallownest or Pharloom atmosphere. Themes recolour the
          entire interface and add subtle artwork behind the guide. Premium
          choices can also be used offline.
        </AppText>
        <Pressable
          onPress={() => setThemesOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel="Browse appearance themes"
          accessibilityState={{ expanded: themesOpen }}
          style={[styles.expandThemes, { borderColor: colors.border }]}
        >
          <View style={styles.categoryText}>
            <AppText style={styles.rowLabel}>
              {themeCatalog.find((theme) => theme.id === settings.themeStyle)?.name ?? "Classic"}
            </AppText>
            <AppText style={[styles.hint, { color: colors.muted }]}>
              {themesOpen ? "Choose a theme below" : "Tap to browse all Hollow Knight and Silksong themes"}
            </AppText>
          </View>
          <AppText style={{ color: colors.accent, fontWeight: "700" }}>{themesOpen ? "−" : "+"}</AppText>
        </Pressable>
        {themesOpen ? (
          <>
        {["Both games", "Hollow Knight", "Silksong"].map((game) => (
          <View key={game} style={styles.themeGroup}>
            <AppText style={[styles.themeGroupTitle, { color: colors.text }]}>
              {game}
            </AppText>
            <View style={styles.themeGrid}>
              {themeCatalog.filter((theme) => theme.game === game).map((theme) => (
                <ThemeChoice
                  key={theme.id}
                  theme={theme}
                  selected={settings.themeStyle === theme.id}
                  isPremium={isPremium}
                  onChoose={() => {
                    if (!isPremium && theme.id !== "default") {
                      router.push("/premium");
                      return;
                    }
                    update({ themeStyle: theme.id });
                  }}
                />
              ))}
            </View>
          </View>
        ))}

          </>
        ) : null}
      </Section>
        </SettingsCategory>
        <SettingsCategory
          title="Accessibility & feedback"
          subtitle="Text size, contrast, motion and haptics"
          symbol="Aa"
          open={expanded === "accessibility"}
          onPress={() => toggleCategory("accessibility")}
        >
          <Section title="Readable interface">
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
      <Section title="Motion preferences">
        <ToggleRow
          label="Reduce motion"
          hint="Turns off map momentum and zoom animations"
          value={settings.reduceMotion}
          onChange={(reduceMotion) => update({ reduceMotion })}
        />

      </Section>
        </SettingsCategory>
        <SettingsCategory
          title="Audio"
          subtitle="Loading sounds and game-selector music"
          symbol="♫"
          open={expanded === "audio"}
          onPress={() => toggleCategory("audio")}
        >
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
        </SettingsCategory>
        <SettingsCategory
          title="Guide preferences"
          subtitle="Card details and how the guide starts"
          symbol="⌘"
          open={expanded === "guide"}
          onPress={() => toggleCategory("guide")}
        >
      <Section title="Cards">
        <ToggleRow
          label="Start expanded"
          hint="Show full details on boss and charm cards without tapping"
          value={settings.startExpanded}
          onChange={(startExpanded) => update({ startExpanded })}
        />
      </Section>
          <Section title="Navigation">
        <ToggleRow
          label="Remember my game"
          hint="Off: always show the game menu on launch. On: reopen the last game you picked"
          value={settings.rememberGame}
          onChange={(rememberGame) => update({ rememberGame })}
        />
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
          </Section>
        </SettingsCategory>
        <SettingsCategory
          title="Data & support"
          subtitle="Guide updates, backups, privacy and app information"
          symbol="☷"
          open={expanded === "data"}
          onPress={() => toggleCategory("data")}
        >
      <Section title="Data">
        <AppText>{`Source: ${SOURCE_LABELS[dataStatus.source]}`}</AppText>
        <AppText style={{ color: colors.muted, fontSize: 13 }}>
          {dataStatus.at
            ? `Last checked ${new Date(dataStatus.at).toLocaleString()}`
            : "Using the data bundled with the app."}
        </AppText>
      </Section>
      <BackupSection />
      <Section title="About & support">
        <AppText style={[styles.hint, { color: colors.muted }]}>
          Read about this unofficial companion, view its source credits,
          contact the developer or check how app data is handled.
        </AppText>
        <Pressable
          onPress={() => router.push("/about")}
          accessibilityRole="button"
          accessibilityLabel="About this guide and source credits"
          style={[styles.infoLink, { borderColor: colors.border }]}
        >
          <AppText style={[styles.infoLinkText, { color: colors.accent }]}>About & source credits</AppText>
          <AppText style={{ color: colors.accent }}>›</AppText>
        </Pressable>
        <Pressable
          onPress={() => router.push("/privacy")}
          accessibilityRole="button"
          accessibilityLabel="Privacy notice"
          style={[styles.infoLink, { borderColor: colors.border }]}
        >
          <AppText style={[styles.infoLinkText, { color: colors.accent }]}>Privacy notice</AppText>
          <AppText style={{ color: colors.accent }}>›</AppText>
        </Pressable>
      </Section>
      {privacyOptionsRequired ? (
        <Section title="Ad privacy">
          <AppText style={{ color: colors.muted }}>
            Review or update the advertising privacy choices you made earlier.
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={showPrivacyOptions}
            style={[styles.resetButton, { backgroundColor: colors.button, alignSelf: "stretch", marginTop: 4, alignItems: "center" }]}
          >
            <AppText style={[styles.resetText, { color: colors.buttonText }]}>
              Manage ad privacy choices
            </AppText>
          </Pressable>
        </Section>
      ) : null}
      <Pressable
        onPress={() => {
          if (!confirmReset) { setConfirmReset(true); return; }
          reset();
          setConfirmReset(false);
        }}
        accessibilityRole="button"
        style={[styles.resetButton, { backgroundColor: colors.button }]}
      >
        <AppText style={[styles.resetText, { color: colors.buttonText }]}>
          {confirmReset ? "Confirm: reset settings" : "Reset settings to defaults"}
        </AppText>
      </Pressable>
      <AppText style={[styles.hint, styles.centered, { color: colors.muted }]}>
        Defaults: light mode, default style, default text size, default haptics.
      </AppText>
        </SettingsCategory>
      </View>
      <AppText style={[styles.footerInfo, { color: colors.muted }]}>
        Preferences save automatically. Your progress, photos and loadouts are separate from appearance settings.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingTop: 10, paddingBottom: 32 },
  screenSubtitle: { marginHorizontal: 22, marginTop: 6, fontSize: 14, lineHeight: 21, textAlign: "center" },
  premiumSummary: {
    marginHorizontal: 16, marginTop: 22, padding: 14, borderRadius: 16,
    borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 12,
  },
  premiumSymbol: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  premiumLink: { minHeight: 44, paddingHorizontal: 6, justifyContent: "center" },
  premiumLinkText: { fontWeight: "800", fontSize: 14 },
  categoryList: { marginHorizontal: 16, marginTop: 18, gap: 10 },
  category: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  categoryHeader: { minHeight: 80, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  categorySymbol: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  categoryGlyph: { fontSize: 19, fontWeight: "800" },
  categoryText: { flex: 1, gap: 4 },
  categoryTitle: { fontSize: 17, fontWeight: "800" },
  categorySubtitle: { fontSize: 13, lineHeight: 18 },
  categoryChevron: { fontSize: 23, fontWeight: "600" },
  categoryBody: { borderTopWidth: 1, paddingHorizontal: 14, paddingBottom: 18, paddingTop: 10 },
  expandThemes: { flexDirection: "row", alignItems: "center", minHeight: 64, padding: 12, borderWidth: 1, borderRadius: 12, gap: 12 },
  footerInfo: { marginHorizontal: 24, marginTop: 22, lineHeight: 19, fontSize: 12, textAlign: "center" },
  section: { marginTop: 12, paddingVertical: 8, gap: 12 },
  sectionTitle: { fontWeight: "bold", fontSize: 18 },
  rowLabel: { fontSize: 16 },
  hint: { fontSize: 13 },
  centered: { textAlign: "center", marginTop: 8 },
  themeGroup: { marginTop: 10, gap: 8 },
  themeGroupTitle: { fontSize: 16, fontWeight: "800" },
  themeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  themeChoice: {
    width: "47%",
    flexGrow: 1,
    minWidth: 120,
    padding: 10,
    borderWidth: 1,
    borderRadius: 14,
    gap: 5,
  },
  themeChoiceSelected: { borderWidth: 2 },
  themePreview: {
    height: 94,
    borderRadius: 9,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 8,
  },
  themePreviewMotif: {
    position: "absolute",
    height: 98,
    width: 112,
    right: 3,
    bottom: -7,
    opacity: 0.78,
  },
  themePreviewLine: { height: 4, width: "62%", borderRadius: 4, opacity: 0.9 },
  themePreviewDot: { height: 8, width: 8, borderRadius: 4, marginTop: 4, opacity: 0.9 },
  themeChoiceTitle: { fontSize: 15, fontWeight: "800" },
  themeChoiceTagline: { fontSize: 12, lineHeight: 16, minHeight: 32 },
  themeChoiceStatus: { fontSize: 12, fontWeight: "800", marginTop: 2 },
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
  infoLink: { borderWidth: 1, minHeight: 48, borderRadius: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoLinkText: { fontSize: 15, fontWeight: "700" },
});
