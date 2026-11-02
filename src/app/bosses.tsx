import { Image } from 'expo-image';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppFooter } from '@/components/hollow/app-footer';
import { EntryCard, Stat } from '@/components/hollow/entry-card';
import { Screen } from '@/components/hollow/screen';
import { Body, Title } from '@/components/hollow/section-text';
import { HK } from '@/constants/hollow';
import { bosses } from '@/data/bosses';
import { bossImages, locationImages } from '@/data/images';

export default function BossesScreen() {
  return (
    <Screen scroll={false}>
      <FlatList
        data={bosses}
        keyExtractor={(b) => b.name}
        initialNumToRender={6}
        contentContainerStyle={{ paddingTop: 16 }}
        ListHeaderComponent={
          <>
            <Title>Bosses</Title>
            <Body>
              Bosses in Hollow Knight play a crucial role in shaping the game&apos;s challenge,
              progression, and storytelling, acting as major skill checks that test a
              player&apos;s mastery of movement, timing, and combat. Each boss introduces unique
              attack patterns and mechanics, which can feel overwhelming for new players. This
              guide breaks down every boss and where they can be found so you can improve faster,
              build confidence, and enjoy the game without feeling stuck.
            </Body>
          </>
        }
        renderItem={({ item }) => (
          <EntryCard image={bossImages[item.image]} name={item.name} description={item.description}>
            <Stat label="Health" value={item.health} />
            <Stat label="Reward" value={item.reward} />
            <Text style={styles.locationLabel}>Location</Text>
            {item.locations.map((loc) => (
              <View key={loc.name} style={styles.location}>
                {loc.image ? (
                  <Image
                    source={locationImages[loc.image]}
                    style={styles.locationImage}
                    contentFit="contain"
                    accessibilityLabel={`${loc.name} map location`}
                  />
                ) : null}
                <Text style={styles.locationName}>{loc.name}</Text>
              </View>
            ))}
          </EntryCard>
        )}
        ListFooterComponent={<AppFooter />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  locationLabel: { marginTop: 8, fontWeight: 'bold', color: HK.muted, fontSize: 15 },
  location: { marginTop: 6, alignItems: 'center', gap: 4 },
  locationImage: { width: '100%', height: 160 },
  locationName: { color: HK.text, fontSize: 15 },
});
