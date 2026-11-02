import { Image } from 'expo-image';
import { FlatList, StyleSheet, View } from 'react-native';
import { EntryCard, Stat } from '../components/hollow/entry-card';
import { Screen } from '../components/hollow/screen';
import { Body, Title } from '../components/hollow/section-text';
import { AppText } from '../components/hollow/app-text';
import { useSettings } from '../settings/settings-context';
import { BossExtras, BossSummary } from '../components/hollow/boss-extras';
import { bosses } from '../data/bosses';
import { bossImages, locationImages } from '../data/images';
export default function BossesScreen() {
  const { colors } = useSettings();
  return (
    <Screen scroll={false}>
      <FlatList
        data={bosses}
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
  locationLabel: { marginTop: 8, fontWeight: 'bold', fontSize: 15 },
  location: { marginTop: 6, alignItems: 'center', gap: 4 },
  locationImage: { width: '100%', height: 160 },
  locationName: { fontSize: 15 },
});
