import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Switch, View } from "react-native";
import { AppText } from "./hollow/app-text";
import { useSettings } from "../settings/SettingsContext";

export default function LoadingSoundSetting({ embedded = false }) {
  const context = useSettings() || {};
  const { settings = {}, update = () => {}, colors = {} } = context;

  const soundEnabled = settings.loadingSoundEnabled ?? true;
  const volume = settings.loadingSoundVolume ?? 50;

  // Extract app theme palette (with Hollow Knight gold fallbacks)
  const primaryColor = colors.primary || colors.accent || "#D4AF37";
  const textColor = colors.text || "#FFFFFF";
  const subtextColor = colors.subtext || colors.muted || "#A0A0A0";
  const cardBg = colors.card || "rgba(255, 255, 255, 0.05)";
  const borderColor = colors.border || "rgba(255, 255, 255, 0.1)";

  const handleToggle = (value) => {
    if (value && volume === 0) {
      update({ loadingSoundEnabled: true, loadingSoundVolume: 50 });
    } else {
      update({ loadingSoundEnabled: value });
    }
  };

  const handleSliderChange = (value) => {
    const rounded = Math.round(value);
    if (rounded === 0) {
      update({ loadingSoundEnabled: false, loadingSoundVolume: 0 });
    } else if (!soundEnabled && rounded > 0) {
      update({ loadingSoundEnabled: true, loadingSoundVolume: rounded });
    } else {
      update({ loadingSoundVolume: rounded });
    }
  };

  return (
    <View style={[styles.container, embedded && styles.embedded, { backgroundColor: embedded ? "transparent" : cardBg, borderColor }]}>
      <View style={styles.row}>
        <AppText style={[styles.label, { color: textColor }]}>
          Loading Screen Sound
        </AppText>
        <Switch
          value={soundEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: "#3A3A3C", true: primaryColor }}
          thumbColor={soundEnabled ? "#FFFFFF" : "#E5E5EA"}
        />
      </View>

      <View
        style={[
          styles.sliderContainer,
          !soundEnabled && styles.disabledContainer,
        ]}
      >
        <View style={styles.labelRow}>
          <AppText style={[styles.label, { color: textColor }]}>Volume</AppText>
          <AppText style={[styles.valueText, { color: subtextColor }]}>
            {soundEnabled ? volume : 0}%
          </AppText>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={soundEnabled ? volume : 0}
          onValueChange={handleSliderChange}
          minimumTrackTintColor={primaryColor}
          maximumTrackTintColor={borderColor}
          thumbTintColor={primaryColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  embedded: { marginVertical: 4, paddingHorizontal: 0, borderWidth: 0 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sliderContainer: {
    marginTop: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  valueText: {
    fontSize: 14,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  disabledContainer: {
    opacity: 0.35,
  },
});
