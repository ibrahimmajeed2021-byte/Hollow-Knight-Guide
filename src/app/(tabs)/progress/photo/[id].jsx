import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '../../../../components/hollow/app-text';
import { Button } from '../../../../components/hollow/button';
import { Screen } from '../../../../components/hollow/screen';
import { useGame } from '../../../../games/game-context';
import { photoUri, useJournal } from '../../../../journal/journal-context';
import { saveToLibrary } from '../../../../journal/save-to-library';
import { useSettings } from '../../../../settings/settings-context';

export default function PhotoScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useSettings();
  const { config } = useGame();
  const tagTypes = [
    { type: 'boss', label: 'Boss', items: config.bosses },
    { type: 'charm', label: config.itemLabel, items: config.items },
  ];
  const { photos, updatePhoto, removePhoto } = useJournal();
  const photo = photos.find((p) => p.id === id);
  const [pickerType, setPickerType] = useState(photo?.tag?.type ?? 'boss');

  if (!photo) {
    return (
      <Screen>
        <Button label="Back" onPress={() => router.back()} style={styles.back} />
        <AppText style={styles.missing}>This photo no longer exists.</AppText>
      </Screen>
    );
  }

  const uri = photoUri(photo);
  const items = tagTypes.find((t) => t.type === pickerType).items;

  const save = async () => {
    if (!(await saveToLibrary(uri))) {
      Alert.alert('Permission needed', 'Allow photo access to save this photo.');
      return;
    }
    Alert.alert('Saved', 'The photo was saved to your camera roll.');
  };

  const confirmDelete = () =>
    Alert.alert('Delete photo?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          removePhoto(photo.id);
        },
      },
    ]);

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />
          <Image
            source={{ uri }}
            style={[styles.photo, { backgroundColor: colors.card }]}
            contentFit="contain"
            accessibilityLabel={photo.tag ? `Photo tagged ${photo.tag.name}` : 'Journal photo'}
          />

          <AppText style={styles.label}>Note</AppText>
          <TextInput
            defaultValue={photo.note}
            onChangeText={(note) => updatePhoto(photo.id, { note })}
            placeholder="Add a note..."
            placeholderTextColor={colors.muted}
            multiline
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <AppText style={styles.label}>
            Tag: {photo.tag ? photo.tag.name : 'None'}
          </AppText>
          <View style={styles.chips}>
            {tagTypes.map((t) => (
              <Chip
                key={t.type}
                label={t.label}
                selected={pickerType === t.type}
                onPress={() => setPickerType(t.type)}
              />
            ))}
            <Chip
              label="Clear"
              selected={false}
              onPress={() => updatePhoto(photo.id, { tag: null })}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {items.map((item) => (
              <Chip
                key={item.name}
                label={item.name}
                selected={photo.tag?.type === pickerType && photo.tag?.name === item.name}
                onPress={() => updatePhoto(photo.id, { tag: { type: pickerType, name: item.name } })}
              />
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <Button label="Save to Photos" onPress={save} style={styles.flex} />
            <Button label="Delete" variant="outline" onPress={confirmDelete} style={styles.flex} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Chip({ label, selected, onPress }) {
  const { colors } = useSettings();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        { borderColor: colors.border },
        selected && { backgroundColor: colors.button, borderColor: colors.button },
      ]}
    >
      <AppText style={[styles.chipText, selected && { color: colors.buttonText, fontWeight: 'bold' }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  back: { alignSelf: 'flex-start', marginBottom: 12 },
  missing: { textAlign: 'center', marginTop: 24 },
  photo: { width: '100%', height: 360, borderRadius: 12 },
  label: { marginTop: 16, marginBottom: 6, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { borderWidth: 1, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
});
