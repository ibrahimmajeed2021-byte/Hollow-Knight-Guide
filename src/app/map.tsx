import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Screen } from '@/components/hollow/screen';
import { Body, Title } from '@/components/hollow/section-text';
import { HK } from '@/constants/hollow';

const MIN_SCALE = 0.5;
const MAX_SCALE = 8;
const mapImage = require('../../assets/hollow/map/HallownestMap.png');

type MapValues = Record<
  'scale' | 'savedScale' | 'tx' | 'ty' | 'savedTx' | 'savedTy',
  SharedValue<number>
>;

function resetMap(v: MapValues) {
  v.scale.value = withTiming(1);
  v.tx.value = withTiming(0);
  v.ty.value = withTiming(0);
  v.savedScale.value = 1;
  v.savedTx.value = 0;
  v.savedTy.value = 0;
}

export default function MapScreen() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const next = Math.min(MAX_SCALE, scale.value * 2);
      scale.value = withTiming(next);
      savedScale.value = next;
    });

  const gesture = Gesture.Simultaneous(pinch, pan, doubleTap);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const reset = () => resetMap({ scale, savedScale, tx, ty, savedTx, savedTy });

  return (
    <Screen scroll={false}>
      <Title>Interactive Map</Title>
      <Body>Pinch to zoom, drag to move around, double tap to zoom in.</Body>
      <Pressable onPress={reset} style={styles.button} accessibilityRole="button">
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.canvas, style]}>
            <Image
              source={mapImage}
              style={styles.map}
              contentFit="contain"
              accessibilityLabel="Hollow Knight interactive map"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 12, overflow: 'hidden' },
  canvas: { flex: 1 },
  map: { flex: 1 },
  button: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: HK.header,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
