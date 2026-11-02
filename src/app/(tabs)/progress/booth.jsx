import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { AppText } from '../../../components/hollow/app-text';
import { Button } from '../../../components/hollow/button';
import { Screen } from '../../../components/hollow/screen';
import { Sticker } from '../../../components/hollow/sticker';
import { HKFont } from '../../../constants/hollow';
import { useGame } from '../../../games/game-context';
import { useJournal } from '../../../journal/journal-context';
import { saveToLibrary } from '../../../journal/save-to-library';
import { useSettings } from '../../../settings/settings-context';

const STAGE_WIDTH = Dimensions.get('window').width - 32;
const STAGE_HEIGHT = (STAGE_WIDTH * 4) / 3;

function Frame({ title, guide }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.frameBorder} />
      <Text style={styles.frameTitle}>{title}</Text>
      <Text style={styles.frameCredit}>{guide} · By Ibrahim · All rights reserved</Text>
    </View>
  );
}

export default function BoothScreen() {
  const { colors } = useSettings();
  const { config } = useGame();
  const stickerOptions = [
    ...Object.entries(config.bossImages).map(([key, source]) => ({ key: `boss-${key}`, source })),
    ...Object.entries(config.itemImages).map(([key, source]) => ({ key: `charm-${key}`, source })),
  ];
  const { addPhoto } = useJournal();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [photo, setPhoto] = useState(null);
  const [stickers, setStickers] = useState([]);
  const camera = useRef(null);
  const stage = useRef(null);
  const nextId = useRef(0);

  const back = <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />;

  if (!permission) return <Screen scroll={false}>{null}</Screen>;

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.pad}>
          {back}
          <AppText style={styles.center}>
            The photo booth needs camera access to show a live preview.
          </AppText>
          <Button label="Allow camera" onPress={requestPermission} style={styles.gap} />
        </View>
      </Screen>
    );
  }

  const shoot = async () => {
    const result = await camera.current?.takePictureAsync({ quality: 0.8 });
    if (result) setPhoto(result.uri);
  };

  const render = () => captureRef(stage, { format: 'jpg', quality: 0.92 });

  const saveToCameraRoll = async () => {
    const uri = await render();
    Alert.alert(
      (await saveToLibrary(uri)) ? 'Saved' : 'Permission needed',
      'Photos are saved to your camera roll when access is allowed.',
    );
  };

  const saveToJournal = async () => {
    const uri = await render();
    addPhoto(uri, { note: 'Photo booth' });
    router.back();
  };

  const retake = () => {
    setPhoto(null);
    setStickers([]);
  };

  return (
    <Screen scroll={false}>
      <ScrollView contentContainerStyle={styles.pad}>
        {back}
        <View
          ref={stage}
          collapsable={false}
          style={[styles.stage, { backgroundColor: colors.card }]}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <CameraView ref={camera} style={StyleSheet.absoluteFill} facing={facing} />
          )}
          {photo && stickers.map((s) => <Sticker key={s.id} source={s.source} />)}
          <Frame title={config.tagline.toUpperCase()} guide={config.guideTitle} />
        </View>

        {photo ? (
          <>
            <AppText style={styles.hint}>Tap a sticker to add it, then drag, pinch and rotate.</AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.palette}>
              {stickerOptions.map((o) => (
                <Pressable
                  key={o.key}
                  accessibilityRole="button"
                  accessibilityLabel="Add sticker"
                  onPress={() =>
                    setStickers((prev) => [...prev, { id: nextId.current++, source: o.source }])
                  }
                >
                  <Image source={o.source} style={styles.paletteImage} contentFit="contain" />
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.actions}>
              <Button label="Retake" variant="outline" onPress={retake} style={styles.flex} />
              <Button
                label="Undo"
                variant="outline"
                onPress={() => setStickers((prev) => prev.slice(0, -1))}
                disabled={!stickers.length}
                style={styles.flex}
              />
            </View>
            <View style={styles.actions}>
              <Button label="Save to journal" onPress={saveToJournal} style={styles.flex} />
              <Button label="Camera roll" onPress={saveToCameraRoll} style={styles.flex} />
            </View>
          </>
        ) : (
          <View style={styles.actions}>
            <Button
              label="Flip"
              variant="outline"
              onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
              style={styles.flex}
            />
            <Button label="Take photo" onPress={shoot} style={styles.flex} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pad: { padding: 16, paddingBottom: 40 },
  back: { alignSelf: 'flex-start', marginBottom: 12 },
  center: { textAlign: 'center', marginTop: 16 },
  gap: { marginTop: 16 },
  stage: {
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
  },
  frameBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 14,
    borderColor: 'rgba(0,0,0,0.85)',
    borderRadius: 12,
  },
  frameTitle: {
    position: 'absolute',
    bottom: 28,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontFamily: HKFont,
    fontSize: 20,
    letterSpacing: 6,
  },
  frameCredit: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
  },
  hint: { textAlign: 'center', marginTop: 12, fontSize: 14 },
  palette: { gap: 10, paddingVertical: 10 },
  paletteImage: { width: 56, height: 56 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
