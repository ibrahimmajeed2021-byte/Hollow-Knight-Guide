import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Image as RNImage, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '../../components/hollow/app-text';
import { Screen } from '../../components/hollow/screen';
import { useSettings } from '../../settings/settings-context';

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const DOUBLE_TAP_SCALE = 3;
const mapImage = require('../../../assets/hollow/map/HallownestMap.png');
const { width: imgW, height: imgH } = RNImage.resolveAssetSource(mapImage);

function clamp(value, min, max) {
  'worklet';
  return Math.min(max, Math.max(min, value));
}

function maxOffset(scale, base, view) {
  'worklet';
  return Math.max(0, (base * scale - view) / 2);
}

function animate(value, reduceMotion) {
  'worklet';
  return reduceMotion ? value : withTiming(value);
}

function resetMap(v, reduceMotion) {
  v.scale.value = animate(1, reduceMotion);
  v.tx.value = animate(0, reduceMotion);
  v.ty.value = animate(0, reduceMotion);
}

function createMapGesture({
  W,
  H,
  baseW,
  baseH,
  scale,
  tx,
  ty,
  startTx,
  startTy,
  lastFx,
  lastFy,
  reduceMotion,
}) {
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
      const mx = maxOffset(scale.value, baseW, W);
      const my = maxOffset(scale.value, baseH, H);
      tx.value = animate(clamp(tx.value, -mx, mx), reduceMotion);
      ty.value = animate(clamp(ty.value, -my, my), reduceMotion);
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
      if (reduceMotion) return;
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
      scale.value = animate(next, reduceMotion);
      tx.value = animate(
        next === 1 ? 0 : clamp(fx - (fx - tx.value) * ratio, -mx, mx),
        reduceMotion,
      );
      ty.value = animate(
        next === 1 ? 0 : clamp(fy - (fy - ty.value) * ratio, -my, my),
        reduceMotion,
      );
    });

  return Gesture.Race(doubleTap, Gesture.Simultaneous(pan, pinch));
}

export default function MapScreen() {
  const { colors, settings } = useSettings();
  const reduceMotion = settings.reduceMotion;
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
    () =>
      createMapGesture({
        W,
        H,
        baseW,
        baseH,
        scale,
        tx,
        ty,
        startTx,
        startTy,
        lastFx,
        lastFy,
        reduceMotion,
      }),
    [W, H, baseW, baseH, scale, tx, ty, startTx, startTy, lastFx, lastFy, reduceMotion],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <Screen scroll={false}>
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
        onLayout={(e) => setSize(e.nativeEvent.layout)}
      >
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
                  cachePolicy="memory-disk"
                  accessibilityLabel="Hollow Knight interactive map"
                />
              </Animated.View>
            </View>
          </GestureDetector>
        )}
        <View style={styles.overlay} pointerEvents="box-none">
          <AppText style={styles.hint}>Pinch to zoom · drag to move · double tap to zoom</AppText>
          <Pressable
            onPress={() => resetMap({ scale, tx, ty }, reduceMotion)}
            style={[styles.button, { backgroundColor: colors.button }]}
            accessibilityRole="button"
          >
            <AppText style={[styles.buttonText, { color: colors.buttonText }]}>Reset</AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
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
    color: '#ffffff',
    backgroundColor: 'rgba(15,15,27,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 13,
    overflow: 'hidden',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { fontWeight: 'bold' },
});
