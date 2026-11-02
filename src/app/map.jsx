import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Image as RNImage, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import { Screen } from '../components/hollow/screen';
import { HK } from '../constants/hollow';

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const DOUBLE_TAP_SCALE = 3;
const mapImage = require('../../assets/hollow/map/HallownestMap.png');
const { width: imgW, height: imgH } = RNImage.resolveAssetSource(mapImage);

function clamp(value, min, max) {
  'worklet';
  return Math.min(max, Math.max(min, value));
}

function maxOffset(scale, base, view) {
  'worklet';
  return Math.max(0, (base * scale - view) / 2);
}

function resetMap(v) {
  v.scale.value = withTiming(1);
  v.tx.value = withTiming(0);
  v.ty.value = withTiming(0);
}

function createMapGesture({ W, H, baseW, baseH, scale, tx, ty, startTx, startTy, lastFx, lastFy }) {
  const pinch = Gesture.Pinch()
    .onStart((e) => {
      lastFx.value = e.focalX;
      lastFy.value = e.focalY;
    })
    .onChange((e) => {
      const next = clamp(scale.value * e.scaleChange, MIN_SCALE, MAX_SCALE);
      const ratio = next / scale.value;
      const fx = e.focalX - W / 2;
      const fy = e.focalY - H / 2;
      const px = lastFx.value - W / 2;
      const py = lastFy.value - H / 2;
      tx.value = fx - (px - tx.value) * ratio;
      ty.value = fy - (py - ty.value) * ratio;
      scale.value = next;
      lastFx.value = e.focalX;
      lastFy.value = e.focalY;
    })
    .onEnd(() => {
      tx.value = withTiming(
        clamp(tx.value, -maxOffset(scale.value, baseW, W), maxOffset(scale.value, baseW, W)),
      );
      ty.value = withTiming(
        clamp(ty.value, -maxOffset(scale.value, baseH, H), maxOffset(scale.value, baseH, H)),
      );
    });

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onStart(() => {
      startTx.value = tx.value;
      startTy.value = ty.value;
    })
    .onChange((e) => {
      const mx = maxOffset(scale.value, baseW, W);
      const my = maxOffset(scale.value, baseH, H);
      tx.value = clamp(startTx.value + e.translationX, -mx, mx);
      ty.value = clamp(startTy.value + e.translationY, -my, my);
    })
    .onEnd((e) => {
      const mx = maxOffset(scale.value, baseW, W);
      const my = maxOffset(scale.value, baseH, H);
      tx.value = withDecay({ velocity: e.velocityX, clamp: [-mx, mx] });
      ty.value = withDecay({ velocity: e.velocityY, clamp: [-my, my] });
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd((e) => {
      const next = scale.value > 1.5 ? 1 : DOUBLE_TAP_SCALE;
      const ratio = next / scale.value;
      const fx = e.x - W / 2;
      const fy = e.y - H / 2;
      const mx = maxOffset(next, baseW, W);
      const my = maxOffset(next, baseH, H);
      scale.value = withTiming(next);
      tx.value = withTiming(next === 1 ? 0 : clamp(fx - (fx - tx.value) * ratio, -mx, mx));
      ty.value = withTiming(next === 1 ? 0 : clamp(fy - (fy - ty.value) * ratio, -my, my));
    });

  return Gesture.Race(doubleTap, Gesture.Simultaneous(pan, pinch));
}

export default function MapScreen() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);
  const lastFx = useSharedValue(0);
  const lastFy = useSharedValue(0);

  const { width: W, height: H } = size;
  const fit = Math.min(W / imgW, H / imgH) || 0;
  const baseW = imgW * fit;
  const baseH = imgH * fit;

  const gesture = useMemo(
    () => createMapGesture({ W, H, baseW, baseH, scale, tx, ty, startTx, startTy, lastFx, lastFy }),
    [W, H, baseW, baseH, scale, tx, ty, startTx, startTy, lastFx, lastFy],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <Screen scroll={false}>
      <View style={styles.container} onLayout={(e) => setSize(e.nativeEvent.layout)}>
        {W > 0 && (
          <GestureDetector gesture={gesture}>
            <View style={StyleSheet.absoluteFill} collapsable={false}>
              <Animated.View
                style={[
                  styles.canvas,
                  { width: baseW, height: baseH, left: (W - baseW) / 2, top: (H - baseH) / 2 },
                  animatedStyle,
                ]}
              >
                <Image
                  source={mapImage}
                  style={StyleSheet.absoluteFill}
                  contentFit="contain"
                  accessibilityLabel="Hollow Knight interactive map"
                />
              </Animated.View>
            </View>
          </GestureDetector>
        )}
        <View style={styles.overlay} pointerEvents="box-none">
          <Text style={styles.hint}>Pinch to zoom · drag to move · double tap to zoom</Text>
          <Pressable
            onPress={() => resetMap({ scale, tx, ty })}
            style={styles.button}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', backgroundColor: HK.background },
  canvas: { position: 'absolute' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    color: 'white',
    backgroundColor: 'rgba(15,15,27,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 13,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: HK.header,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
