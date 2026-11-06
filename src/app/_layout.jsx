import { useFonts } from "expo-font";
import { Image } from "expo-image";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GameSelect } from "../components/hollow/game-select";
import { LoadingScreen } from "../components/hollow/loading-screen";
import { HKFont } from "../constants/hollow";
import { GameProvider, useGame } from "../games/game-context";
import { OnlineAccessProvider } from "../network/online-access-context";
import { OfflineAccessGate } from "../network/offline-access-gate";
import { useOnlineAccess } from "../network/online-access-context";
import { configureHostedAudio } from "../sound/game-sounds";
import { JournalProvider } from "../journal/journal-context";
import { GuidedModeProvider } from "../premium/guided-context";
import { LoadoutsProvider } from "../loadouts/loadouts-context";
import { AdsProvider } from "../ads/AdsContext";
import { PurchasesProvider } from "../purchases/PurchasesContext";
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
        <OfflineAccessGate />
      </View>
    </ThemeProvider>
  );
}

function GameData() {
  const { config, mediaManifest } = useGame();
  const { status } = useOnlineAccess();

  useEffect(() => {
    configureHostedAudio(mediaManifest?.audio, status === "online");
  }, [mediaManifest, status]);
  return (
    <JournalProvider key={config.id} suffix={config.storageSuffix}>
      <GuidedModeProvider key={config.id}>
        <LoadoutsProvider key={config.id} suffix={config.storageSuffix}>
          <AppShell />
        </LoadoutsProvider>
      </GuidedModeProvider>
    </JournalProvider>
  );
}

export default function RootLayout() {
  // Expo Image's default iOS memory/disk cache has no explicit size limits.
  // Cap retained decoded artwork on memory-constrained devices; visible images
  // still render and disk caching avoids needless repeat downloads.
  useEffect(() => {
    if (Platform.OS === "ios") {
      Image.configureCache({
        maxMemoryCost: 64 * 1024 * 1024,
        maxDiskSize: 200 * 1024 * 1024,
      });
    }
  }, []);

  const [fontsLoaded] = useFonts({
    [HKFont]: require("../../assets/hollow/fonts/TrajanProBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PurchasesProvider>
        <AdsProvider>
          <SettingsProvider>
            <OnlineAccessProvider>
              <GameProvider>
                <GameData />
              </GameProvider>
            </OnlineAccessProvider>
          </SettingsProvider>
        </AdsProvider>
      </PurchasesProvider>
    </GestureHandlerRootView>
  );
}
