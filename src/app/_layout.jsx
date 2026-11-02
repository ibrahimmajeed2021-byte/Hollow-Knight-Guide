import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '../components/animated-icon';
import AppTabs from '../components/app-tabs';
import { HKFont } from '../constants/hollow';
import { SettingsProvider, useHaptics, useSettings } from '../settings/settings-context';

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { isDark } = useSettings();
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
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [HKFont]: require('../../assets/hollow/fonts/TrajanProBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <AppShell />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
