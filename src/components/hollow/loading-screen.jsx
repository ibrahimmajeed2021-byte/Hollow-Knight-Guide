import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useGame } from "../../games/game-context";
import { HKFont } from "../../constants/hollow";
import { games } from "../../games/config";
import { useSettings } from "../../settings/settings-context";

const HOLD_MS = 1200;

export function LoadingScreen() {
  const { settings } = useSettings();
  const { config, gameId } = useGame();
  const launch = !gameId;
  const heroes = launch ? [games.hollow, games.silksong] : [config];
  const words = launch
    ? ["HOLLOW KNIGHT & SILKSONG"]
    : config.guideTitle.toUpperCase().split(" ");
  const subtitle = launch ? "GUIDE" : words.pop();
  const [visible, setVisible] = useState(true);
  const reduce = settings.reduceMotion;

  useEffect(() => {
    SplashScreen.hideAsync();
    const timer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      exiting={reduce ? undefined : FadeOut.duration(300)}
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
        entering={reduce ? undefined : FadeIn.duration(500)}
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
        entering={reduce ? undefined : FadeIn.delay(250).duration(600)}
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
