import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const MIN_SCALE = 0.3;
const MAX_SCALE = 6;

function createStickerGesture({ tx, ty, scale, rotation }) {
  const pan = Gesture.Pan()
    .onChange((e) => {
      tx.value += e.changeX;
      ty.value += e.changeY;
    });
  const pinch = Gesture.Pinch().onChange((e) => {
    scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * e.scaleChange));
  });
  const rotate = Gesture.Rotation().onChange((e) => {
    rotation.value += e.rotationChange;
  });
  return Gesture.Simultaneous(pan, pinch, rotate);
}

export function Sticker({ source, size = 110 }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const gesture = useMemo(
    () => createStickerGesture({ tx, ty, scale, rotation }),
    [tx, ty, scale, rotation],
  );
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.sticker, { width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }, style]}
      >
        <Image source={source} style={styles.image} contentFit="contain" />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sticker: { position: 'absolute', left: '50%', top: '50%' },
  image: { width: '100%', height: '100%' },
});
