import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GameSelect } from "../components/hollow/game-select";
import { LoadingScreen } from "../components/hollow/loading-screen";
import { HKFont } from "../constants/hollow";
import { GameProvider, useGame } from "../games/game-context";
import { JournalProvider } from "../journal/journal-context";
import { LoadoutsProvider } from "../loadouts/loadouts-context";
import {
  SettingsProvider,
  useHaptics,
  useSettings,
} from "../settings/SettingsContext.jsx";

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { isDark } = useSettings();
  const { gameId } = useGame();
  const triggerHaptic = useHaptics();
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      triggerHaptic();
    }
  }, [pathname, triggerHaptic]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <GameSelect />
        <LoadingScreen key={gameId ?? "launch"} />
      </View>
    </ThemeProvider>
  );
}

function GameData() {
  const { config } = useGame();
  return (
    <JournalProvider key={config.id} suffix={config.storageSuffix}>
      <LoadoutsProvider key={config.id} suffix={config.storageSuffix}>
        <AppShell />
      </LoadoutsProvider>
    </JournalProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [HKFont]: require("../../assets/hollow/fonts/TrajanProBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <GameProvider>
          <GameData />
        </GameProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
