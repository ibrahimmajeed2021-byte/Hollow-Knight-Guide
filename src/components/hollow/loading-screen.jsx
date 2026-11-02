import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { HKFont } from '../../constants/hollow';
import { useSettings } from '../../settings/settings-context';

const HOLD_MS = 900;

export function LoadingScreen() {
  const { settings } = useSettings();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const reduce = settings.reduceMotion;

  useEffect(() => {
    SplashScreen.hideAsync();
    const timer = setTimeout(() => setLeaving(true), HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || (leaving && reduce)) return null;

  const exiting = reduce
    ? undefined
    : FadeOut.duration(400).withCallback((finished) => {
        'worklet';
        if (finished) scheduleOnRN(setVisible, false);
      });

  if (leaving && !reduce) {
    return (
      <Animated.View exiting={exiting} style={styles.overlay}>
        <Content reduce={reduce} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={styles.overlay}>
      <Content reduce={reduce} />
    </Animated.View>
  );
}

function Content({ reduce }) {
  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    zIndex: 100,
  },
  image: { width: 160, height: 144 },
  title: { color: '#fff', fontFamily: HKFont, fontSize: 26, letterSpacing: 4, textAlign: 'center' },
  subtitle: { color: '#aaa', fontFamily: HKFont, fontSize: 14, letterSpacing: 8, textAlign: 'center', marginTop: 4 },
});
