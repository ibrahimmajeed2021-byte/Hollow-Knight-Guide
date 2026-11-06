import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Button } from "../components/hollow/button";
import { Screen } from "../components/hollow/screen";
import { Body, Title } from "../components/hollow/section-text";
import { premiumAccents, defaultSettings } from "../constants/hollow";
import { usePurchases } from "../purchases/PurchasesContext";
import { useSettings } from "../settings/SettingsContext.jsx";
import { layout, radius, space, type } from "../ui/design-system";

function Option({ children, active, onPress, colors }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[styles.option, {
        backgroundColor: active ? colors.button : colors.background,
        borderColor: active ? colors.button : colors.border,
      }]}
    >
      <AppText style={[styles.optionText, { color: active ? colors.buttonText : colors.text }]}>
        {children}
      </AppText>
    </Pressable>
  );
}

function SettingToggle({ label, description, enabled, onChange, colors }) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.flex}>
        <AppText style={styles.toggleTitle}>{label}</AppText>
        <AppText style={[styles.help, { color: colors.muted }]}>{description}</AppText>
      </View>
      <Switch value={enabled} onValueChange={onChange} trackColor={{ true: colors.button }} accessibilityLabel={label} />
    </View>
  );
}

export default function PremiumStudioScreen() {
  const { colors, settings, update } = useSettings();
  const { isPremium } = usePurchases();
  const sections = settings.homeSections || defaultSettings.homeSections;

  const setSection = (id, on) =>
    update({ homeSections: { ...sections, [id]: on } });

  const resetStudio = () => update({
    accentPreset: defaultSettings.accentPreset,
    cardDensity: defaultSettings.cardDensity,
    showArtwork: defaultSettings.showArtwork,
    wallpaperStrength: defaultSettings.wallpaperStrength,
    ambientMotion: defaultSettings.ambientMotion,
    homeSections: defaultSettings.homeSections,
  });

  if (!isPremium) return (
    <Screen>
      <Title>Premium customisation studio</Title>
      <Body>Unlock custom accents, your Home layout, compact cards and adjustable theme effects.</Body>
      <Button label="Explore Premium" onPress={() => router.push("/premium")} style={styles.topButton} />
    </Screen>
  );

  return (
    <Screen>
      <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />
      <Title>Premium customisation</Title>
      <Body>Build the field journal you prefer. Every change is saved on this device and can be reset independently of game progress.</Body>

      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.heading}>Accent colours</AppText>
        <AppText style={[styles.help, { color: colors.muted }]}>
          Choose a readable accent for buttons, highlights and selected controls. High Contrast always takes priority.
        </AppText>
        <View style={styles.accentGrid}>
          {Object.entries(premiumAccents).map(([id, preset]) => {
            const selected = settings.accentPreset === id;
            return (
              <Pressable
                key={id}
                onPress={() => update({ accentPreset: id })}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.accentChoice, { borderColor: selected ? colors.accent : colors.border }]}
              >
                <View style={[styles.swatch, { backgroundColor: preset.dark ?? colors.accent }]} />
                <AppText style={styles.accentName}>{preset.name}</AppText>
                <AppText style={[styles.selected, { color: colors.accent }]}>{selected ? "✓ Selected" : " "}</AppText>
              </Pressable>
            );
          })}
        </View>
        <View style={[styles.preview, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <AppText style={styles.previewHeading}>Live preview</AppText>
          <AppText style={[styles.help, { color: colors.muted }]}>Your guide content stays exactly the same.</AppText>
          <View style={[styles.previewButton, { backgroundColor: colors.button }]}>
            <AppText style={{ color: colors.buttonText, fontWeight: "800" }}>Explore Hallownest</AppText>
          </View>
        </View>
      </View>

      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.heading}>Cards and artwork</AppText>
        <View style={styles.options}>
          <Option active={settings.cardDensity !== "compact"} onPress={() => update({ cardDensity: "comfortable" })} colors={colors}>
            Comfortable
          </Option>
          <Option active={settings.cardDensity === "compact"} onPress={() => update({ cardDensity: "compact" })} colors={colors}>
            Compact
          </Option>
        </View>
        <SettingToggle
          label="Show guide thumbnails"
          description="Show boss, charm and collectible icons in list cards and Home results."
          enabled={settings.showArtwork !== false}
          onChange={(showArtwork) => update({ showArtwork })}
          colors={colors}
        />
      </View>

      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.heading}>Atmospheric backgrounds</AppText>
        <AppText style={[styles.help, { color: colors.muted }]}>
          Adjust the subtle artwork on Premium themes. High Contrast and Reduce Motion accessibility settings always override decoration where needed.
        </AppText>
        <View style={styles.sliderHeader}>
          <AppText style={styles.toggleTitle}>Wallpaper intensity</AppText>
          <AppText style={[styles.toggleTitle, { color: colors.accent }]}>
            {settings.wallpaperStrength ?? 50}%
          </AppText>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={100}
          step={5}
          value={settings.wallpaperStrength ?? 50}
          onSlidingComplete={(wallpaperStrength) => update({ wallpaperStrength })}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.accent}
          accessibilityLabel="Theme wallpaper intensity"
        />
        <SettingToggle
          label="Gentle ambient motion"
          description="Slowly animate the decorative glow in a Premium theme. Disabled if Reduce Motion is on."
          enabled={settings.ambientMotion === true}
          onChange={(ambientMotion) => update({ ambientMotion })}
          colors={colors}
        />
        <Button label="Choose another Premium theme" variant="outline" onPress={() => router.push("/settings")} />
      </View>

      <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.heading}>Customise your Home page</AppText>
        <AppText style={[styles.help, { color: colors.muted }]}>
          Choose which sections appear beneath the progress banner. Your progress and saved data are never deleted.
        </AppText>
        {[
          ["overview", "Progress overview", "Boss, item and collectible counts"],
          ["search", "Guide search", "Search across bosses and locations"],
          ["continue", "Continue exploring", "Next unfinished entries"],
          ["toolkit", "Your toolkit", "Loadout shortcuts"],
        ].map(([id, label, description]) => (
          <SettingToggle
            key={id}
            label={label}
            description={description}
            enabled={sections[id] !== false}
            onChange={(enabled) => setSection(id, enabled)}
            colors={colors}
          />
        ))}
      </View>
      <Button label="Restore customisation defaults" variant="outline" onPress={resetStudio} style={styles.topButton} />
      <AppText style={[styles.footer, { color: colors.muted }]}>
        Your existing guide, premium entitlement, journal, loadouts and saved progress remain unchanged.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: "flex-start", marginHorizontal: 16, marginTop: 8 },
  topButton: { marginHorizontal: 16, marginTop: 16 },
  panel: { marginHorizontal: layout.gutter, marginTop: space.lg, padding: layout.cardPadding, borderWidth: 1, borderRadius: radius.card, gap: space.md },
  heading: { ...type.heading },
  help: { fontSize: 13, lineHeight: 19 },
  accentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  accentChoice: { borderWidth: 1, padding: space.md, borderRadius: radius.control, width: "47%", flexGrow: 1, minWidth: 120, gap: space.sm, alignItems: "center", minHeight: 98 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  accentName: { fontSize: 14, fontWeight: "700", textAlign: "center" },
  selected: { fontSize: 12, fontWeight: "700" },
  preview: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 },
  previewHeading: { fontSize: 18, fontWeight: "800" },
  previewButton: { padding: 12, borderRadius: 10, alignSelf: "flex-start" },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { borderWidth: 1, borderRadius: radius.control, minHeight: layout.touchTarget, justifyContent: "center", paddingHorizontal: space.lg, paddingVertical: space.sm },
  optionText: { fontSize: 14, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 56 },
  flex: { flex: 1, gap: 3 },
  toggleTitle: { fontSize: 15, fontWeight: "700" },
  sliderHeader: { flexDirection: "row", justifyContent: "space-between" },
  footer: { marginHorizontal: 20, marginTop: 12, marginBottom: 24, textAlign: "center", lineHeight: 20 },
});
