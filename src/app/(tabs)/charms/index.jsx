import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../../components/hollow/button';
import { EntryCard } from '../../../components/hollow/entry-card';
import { CharmExtras, CharmSummary } from '../../../components/hollow/progress-extras';
import { AppText } from '../../../components/hollow/app-text';
import { SearchFilter } from '../../../components/hollow/search-filter';
import { useTabInset } from '../../../hooks/use-tab-inset';
import { Screen } from '../../../components/hollow/screen';
import { Body, Title } from '../../../components/hollow/section-text';
import { charms } from '../../../data/charms';
import { charmImages } from '../../../data/images';
import { useJournal } from '../../../journal/journal-context';
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'Not collected' },
  { value: 'done', label: 'Collected' },
];

export default function CharmsScreen() {
  const { collected } = useJournal();
  const inset = useTabInset();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return charms.filter(
      (c) =>
        (!q || c.name.toLowerCase().includes(q)) &&
        (filter === 'all' || (filter === 'done') === !!collected[c.name]),
    );
  }, [query, filter, collected]);
  return (
    <Screen scroll={false}>
      <SearchFilter
        value={query}
        onChangeText={setQuery}
        placeholder="Search charms"
        filters={FILTERS}
        filter={filter}
        onFilter={setFilter}
      />
      <FlatList
        data={data}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AppText style={{ textAlign: 'center', marginTop: 24 }}>No charms match.</AppText>
        }
        keyExtractor={(c) => c.name}
        initialNumToRender={8}
        removeClippedSubviews
        windowSize={7}
        maxToRenderPerBatch={6}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: inset + 16 }}
        ListHeaderComponent={
          <>
            <Title>Charms</Title>
            <Button
              label="Loadout builder"
              onPress={() => router.push('/charms/loadout')}
              style={{ marginHorizontal: 16, marginTop: 12 }}
            />
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
            summary={<CharmSummary name={item.name} notches={item.notches} />}
          >
            <CharmExtras name={item.name} />
          </EntryCard>
        )}
      />
    </Screen>
  );
}
