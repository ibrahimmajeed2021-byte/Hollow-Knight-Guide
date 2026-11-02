import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/hollow/app-text';
import { Button } from '../../../components/hollow/button';
import { Screen } from '../../../components/hollow/screen';
import { Title } from '../../../components/hollow/section-text';
import { photoUri, useJournal } from '../../../journal/journal-context';
import { pickPhoto, takePhoto } from '../../../journal/take-photo';
import { useSettings } from '../../../settings/settings-context';

const COLUMNS = 3;
const GAP = 6;
const SIZE = (Dimensions.get('window').width - 32 - GAP * (COLUMNS - 1)) / COLUMNS;

export default function JournalScreen() {
  const { colors } = useSettings();
  const { photos, addPhoto } = useJournal();

  const add = async (getPhoto) => {
    const uri = await getPhoto();
    if (!uri) return;
    const id = addPhoto(uri);
    router.push(`/progress/photo/${id}`);
  };

  return (
    <Screen scroll={false}>
      <FlatList
        data={photos}
        keyExtractor={(p) => p.id}
        numColumns={COLUMNS}
        removeClippedSubviews
        windowSize={5}
        contentContainerStyle={styles.content}
        columnWrapperStyle={{ gap: GAP }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />
            <Title>Journal</Title>
            <View style={styles.row}>
              <Button label="Take photo" onPress={() => add(takePhoto)} style={styles.flex} />
              <Button
                label="Library"
                variant="outline"
                onPress={() => add(pickPhoto)}
                style={styles.flex}
              />
            </View>
            <Button
              label="Photo booth"
              onPress={() => router.push('/progress/booth')}
              style={styles.booth}
            />
          </View>
        }
        ListEmptyComponent={
          <AppText style={[styles.empty, { color: colors.muted }]}>
            No photos yet. Take one, pick one from your library, or try the photo booth.
          </AppText>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/progress/photo/${item.id}`)}
            accessibilityRole="button"
            accessibilityLabel={item.tag ? `Photo of ${item.tag.name}` : 'Journal photo'}
          >
            <Image
              source={{ uri: photoUri(item) }}
              style={[styles.thumb, { backgroundColor: colors.card }]}
              contentFit="cover"
              recyclingKey={item.id}
            />
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 8 },
  header: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 10, marginTop: 16 },
  flex: { flex: 1 },
  back: { alignSelf: 'flex-start', marginTop: 8 },
  booth: { marginTop: 10 },
  thumb: { width: SIZE, height: SIZE, borderRadius: 8, marginBottom: GAP },
  empty: { textAlign: 'center', marginTop: 24, paddingHorizontal: 20 },
});
