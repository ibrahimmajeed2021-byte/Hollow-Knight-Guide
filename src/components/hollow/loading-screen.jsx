import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { HKFont } from '../../constants/hollow';
import { useSettings } from '../../settings/settings-context';

const HOLD_MS = 1200;

export function LoadingScreen() {
  const { settings } = useSettings();
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
      style={styles.overlay}
    >
      <Animated.View entering={reduce ? undefined : FadeIn.duration(500)}>
        <Image
          source={require('../../../assets/hollow/bosses/HollowKnight.png')}
          style={styles.image}
          contentFit="contain"
        />
      </Animated.View>
      <Animated.View entering={reduce ? undefined : FadeIn.delay(250).duration(600)}>
        <Text style={styles.title}>HOLLOW KNIGHT</Text>
        <Text style={styles.subtitle}>GUIDE</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  image: { width: 160, height: 144 },
  title: { color: '#fff', fontFamily: HKFont, fontSize: 26, letterSpacing: 4, textAlign: 'center' },
  subtitle: { color: '#aaa', fontFamily: HKFont, fontSize: 14, letterSpacing: 8, textAlign: 'center', marginTop: 4 },
});
