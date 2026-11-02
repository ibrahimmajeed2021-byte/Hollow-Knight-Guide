import * as Haptics from 'expo-haptics';
import { useFonts } from 'expo-font';
import { DefaultTheme, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '../components/animated-icon';
import AppTabs from '../components/app-tabs';
import { HKFont } from '../constants/hollow';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [HKFont]: require('../../assets/hollow/fonts/TrajanProBold.ttf'),
  });
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      Haptics.selectionAsync();
    }
  }, [pathname]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
