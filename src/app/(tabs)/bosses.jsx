import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EntryCard, Stat } from '../../components/hollow/entry-card';
import { SearchFilter } from '../../components/hollow/search-filter';
import { Screen } from '../../components/hollow/screen';
import { Body, Title } from '../../components/hollow/section-text';
import { AppText } from '../../components/hollow/app-text';
import { useJournal } from '../../journal/journal-context';
import { useSettings } from '../../settings/settings-context';
import { BossExtras, BossSummary } from '../../components/hollow/progress-extras';
import { bosses } from '../../data/bosses';
import { bossImages, locationImages } from '../../data/images';
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'Not defeated' },
  { value: 'done', label: 'Defeated' },
];

export default function BossesScreen() {
  const { colors } = useSettings();
  const { defeated } = useJournal();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bosses.filter(
      (b) =>
        (!q || b.name.toLowerCase().includes(q)) &&
        (filter === 'all' || (filter === 'done') === !!defeated[b.name]),
    );
  }, [query, filter, defeated]);
  return (
    <Screen scroll={false}>
      <SearchFilter
        value={query}
        onChangeText={setQuery}
        placeholder="Search bosses"
        filters={FILTERS}
        filter={filter}
        onFilter={setFilter}
      />
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<AppText style={styles.empty}>No bosses match.</AppText>}
        keyExtractor={(b) => b.name}
        initialNumToRender={6}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            <Title>Bosses</Title>
            <Body>
              Bosses in Hollow Knight play a crucial role in shaping the game&apos;s challenge,
              progression, and storytelling, acting as major skill checks that test a player&apos;s
              mastery of movement, timing, and combat. Each boss introduces unique attack patterns
              and mechanics, which can feel overwhelming for new players. This guide breaks down
              every boss and where they can be found so you can improve faster, build confidence,
              and enjoy the game without feeling stuck.
            </Body>
          </>
        }
        renderItem={({ item }) => (
          <EntryCard
            image={bossImages[item.image]}
            name={item.name}
            description={item.description}
            summary={<BossSummary name={item.name} health={item.health} />}
          >
            <Stat label="Reward" value={item.reward} />
            <AppText style={[styles.locationLabel, { color: colors.muted }]}>Location</AppText>
            {item.locations.map((loc) => (
              <View key={loc.name} style={styles.location}>
                {loc.image ? (
                  <Image
                    source={locationImages[loc.image]}
                    style={styles.locationImage}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    accessibilityLabel={`${loc.name} map location`}
                  />
                ) : null}
                <AppText style={styles.locationName}>{loc.name}</AppText>
              </View>
            ))}
            <BossExtras name={item.name} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 24 },
  locationLabel: { marginTop: 8, fontWeight: 'bold', fontSize: 15 },
  location: { marginTop: 6, alignItems: 'center', gap: 4 },
  locationImage: { width: '100%', height: 160 },
  locationName: { fontSize: 15 },
});
