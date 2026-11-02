import { FlatList } from 'react-native';
import { EntryCard, Stat } from '../components/hollow/entry-card';
import { Screen } from '../components/hollow/screen';
import { Body, Title } from '../components/hollow/section-text';
import { charms } from '../data/charms';
import { charmImages } from '../data/images';
export default function CharmsScreen() {
  return (
    <Screen scroll={false}>
      <FlatList
        data={charms}
        keyExtractor={(c) => c.name}
        initialNumToRender={8}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            <Title>Charms</Title>
            <Body>
              Charms are a very important component in Hollow Knight. Equipping charms can alter
              your gameplay and can help you when you are stuck. Charms allow players to have
              freedom in the way they play. Charms can be found in various places across the game.
              However, with the amount of charms there are in the game it can be hard to figure out
              what each one does and which ones are the best to use. Below is an overview of every
              charm in the game, what they do and how many notches they cost.
            </Body>
          </>
        }
        renderItem={({ item }) => (
          <EntryCard
            image={charmImages[item.image]}
            name={item.name}
            description={item.description}
          >
            <Stat label="Notches" value={item.notches} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}
