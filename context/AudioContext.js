import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AudioContext = createContext(undefined);

export const AudioProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [volume, setVolumeState] = useState(80);

  // Load saved preferences on startup
  useEffect(() => {
    (async () => {
      try {
        const savedEnabled = await AsyncStorage.getItem(
          "@loading_sound_enabled"
        );
        const savedVolume = await AsyncStorage.getItem("@loading_sound_volume");
        if (savedEnabled !== null)
          setSoundEnabledState(JSON.parse(savedEnabled));
        if (savedVolume !== null) setVolumeState(JSON.parse(savedVolume));
      } catch (e) {
        console.error("Failed to load audio settings", e);
      }
    })();
  }, []);

  const setSoundEnabled = (enabled) => {
    setSoundEnabledState(enabled);
    AsyncStorage.setItem("@loading_sound_enabled", JSON.stringify(enabled));
  };

  const setVolume = (newVolume) => {
    setVolumeState(newVolume);
    AsyncStorage.setItem("@loading_sound_volume", JSON.stringify(newVolume));
  };

  return (
    <AudioContext.Provider
      value={{ soundEnabled, volume, setSoundEnabled, setVolume }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
