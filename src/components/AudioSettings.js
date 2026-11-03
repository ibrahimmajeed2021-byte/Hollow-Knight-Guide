import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useAudio } from "../context/AudioContext";

export default function AudioSettings() {
  const { soundEnabled, volume, setSoundEnabled, setVolume } = useAudio();

  const handleSwitchToggle = (value) => {
    setSoundEnabled(value);
    if (value && volume === 0) {
      setVolume(50);
    }
  };

  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value);
    setVolume(roundedValue);

    if (roundedValue === 0) {
      setSoundEnabled(false);
    } else if (!soundEnabled && roundedValue > 0) {
      setSoundEnabled(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Loading Screen Sound</Text>
        <Switch
          value={soundEnabled}
          onValueChange={handleSwitchToggle}
          trackColor={{ false: "#767577", true: "#34C759" }}
        />
      </View>

      <View
        style={[
          styles.sliderContainer,
          !soundEnabled && styles.disabledContainer,
        ]}
      >
        <View style={styles.labelRow}>
          <Text style={styles.label}>Volume</Text>
          <Text style={styles.valueText}>{soundEnabled ? volume : 0}%</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={soundEnabled ? volume : 0}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#D1D1D6"
          thumbTintColor="#007AFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
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
    color: "#FFF",
    fontWeight: "500",
  },
  valueText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  disabledContainer: {
    opacity: 0.4,
  },
});
