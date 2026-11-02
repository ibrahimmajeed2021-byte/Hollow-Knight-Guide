import { Image } from "expo-image";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

import { AppText } from "../../../components/hollow/app-text";
import { Button } from "../../../components/hollow/button";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import { charms } from "../../../data/charms";
import { charmImages } from "../../../data/images";
import { useJournal } from "../../../journal/journal-context";
import { useLoadouts } from "../../../loadouts/loadouts-context";
import { useHaptics, useSettings } from "../../../settings/settings-context";

const COLUMNS = 3;
const GAP = 8;
const TILE =
  (Dimensions.get("window").width - 32 - GAP * (COLUMNS - 1)) / COLUMNS;
const MIN_LIMIT = 3;
const MAX_LIMIT = 11;
const DEFAULT_LIMIT = 5;
const SORTS = [
  { value: "default", label: "Default" },
  { value: "asc", label: "Lowest first" },
  { value: "desc", label: "Highest first" },
];
const cost = (name) =>
  Number(charms.find((c) => c.name === name)?.notches ?? 0);

export default function LoadoutScreen() {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { collected } = useJournal();
  const { loadouts, saveLoadout, deleteLoadout } = useLoadouts();
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [onlyCollected, setOnlyCollected] = useState(false);
  const [sort, setSort] = useState("default");
  const cardRef = useRef(null);

  const used = selected.reduce((sum, n) => sum + cost(n), 0);
  const over = used > limit;
  const filtered = onlyCollected
    ? charms.filter((c) => collected[c.name])
    : charms;
  const data =
    sort === "default"
      ? filtered
      : [...filtered].sort((a, b) =>
          sort === "asc"
            ? Number(a.notches) - Number(b.notches)
            : Number(b.notches) - Number(a.notches),
        );

  const toggle = (charm) => {
    triggerHaptic();
    setSelected((prev) =>
      prev.includes(charm) ? prev.filter((n) => n !== charm) : [...prev, charm],
    );
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name needed", "Give this loadout a name before saving.");
      return;
    }
    setEditingId(
      saveLoadout({
        id: editingId ?? undefined,
        name: trimmed,
        limit,
        charms: selected,
      }),
    );
  };

  const load = (loadout) => {
    setSelected(loadout.charms);
    setLimit(loadout.limit);
    setName(loadout.name);
    setEditingId(loadout.id);
  };

  const share = async () => {
    if (!selected.length) {
      Alert.alert("Nothing to share", "Pick some charms first.");
      return;
    }
    try {
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing unavailable", "This device cannot share files.");
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        UTI: "public.png",
      });
    } catch {
      Alert.alert("Share failed", "Could not create the loadout image.");
    }
  };

  const clear = () => {
    setSelected([]);
    setName("");
    setEditingId(null);
  };

  const confirmDelete = (loadout) =>
    Alert.alert(`Delete "${loadout.name}"?`, "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteLoadout(loadout.id);
          if (loadout.id === editingId) setEditingId(null);
        },
      },
    ]);

  return (
    <Screen scroll={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <Button
              label="Back"
              variant="outline"
              onPress={() => router.back()}
              style={styles.back}
            />
            <Title>Loadouts</Title>
            <Body>
              Tap charms to build a loadout. Going over your notch limit is
              allowed.
            </Body>

            <View style={styles.stepper}>
              <AppText style={styles.label}>Notch limit</AppText>
              <View style={styles.stepperButtons}>
                <Button
                  label="−"
                  variant="outline"
                  disabled={limit <= MIN_LIMIT}
                  onPress={() => setLimit((l) => l - 1)}
                />
                <AppText style={styles.limit}>{limit}</AppText>
                <Button
                  label="+"
                  variant="outline"
                  disabled={limit >= MAX_LIMIT}
                  onPress={() => setLimit((l) => l + 1)}
                />
              </View>
            </View>

            <View
              style={[
                styles.counter,
                {
                  borderColor: over ? "#c0392b" : colors.border,
                  backgroundColor: colors.card,
                },
              ]}
              accessibilityLiveRegion="polite"
            >
              <AppText style={[styles.counterText, over && styles.overText]}>
                {used} / {limit} notches used
              </AppText>
              {over ? (
                <AppText style={styles.overText}>
                  Overcharmed: you take double damage
                </AppText>
              ) : null}
              <AppText style={[styles.small, { color: colors.muted }]}>
                {selected.length ? selected.join(", ") : "No charms selected"}
              </AppText>
            </View>

            <View style={styles.stepper}>
              <AppText style={styles.label}>
                Only charms I&apos;ve collected
              </AppText>
              <Switch
                value={onlyCollected}
                onValueChange={setOnlyCollected}
                accessibilityLabel="Only show collected charms"
                trackColor={{ true: colors.button }}
              />
            </View>

            <AppText style={styles.label}>Sort by notch cost</AppText>
            <View style={styles.sortRow} accessibilityRole="radiogroup">
              {SORTS.map((o) => {
                const on = sort === o.value;
                return (
                  <Pressable
                    key={o.value}
                    onPress={() => {
                      triggerHaptic();
                      setSort(o.value);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    style={[
                      styles.sortOption,
                      { borderColor: colors.border },
                      on && {
                        backgroundColor: colors.button,
                        borderColor: colors.button,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.sortText,
                        on && { color: colors.buttonText, fontWeight: "bold" },
                      ]}
                    >
                      {o.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {data.length === 0 ? (
            <AppText style={[styles.empty, { color: colors.muted }]}>
              No collected charms yet. Tick charms on the Charms page.
            </AppText>
          ) : (
            <View style={styles.grid}>
              {data.map((item) => {
                const isOn = selected.includes(item.name);
                return (
                  <Pressable
                    key={item.name}
                    onPress={() => toggle(item.name)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, ${item.notches} notches`}
                    accessibilityState={{ selected: isOn }}
                    style={[
                      styles.tile,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                      isOn && { borderColor: colors.accent, borderWidth: 3 },
                    ]}
                  >
                    <Image
                      source={charmImages[item.image]}
                      style={styles.tileImage}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                    />
                    <AppText style={styles.tileName} numberOfLines={2}>
                      {item.name}
                    </AppText>
                    <AppText style={[styles.cost, { color: colors.muted }]}>
                      {item.notches}{" "}
                      {item.notches === "1" ? "notch" : "notches"}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.footer}>
            <AppText style={styles.label}>
              {editingId ? "Editing loadout" : "Save loadout"}
            </AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Loadout name"
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border },
              ]}
            />
            <View style={styles.actions}>
              <Button
                label={editingId ? "Update" : "Save"}
                onPress={save}
                style={styles.flex}
              />
              <Button
                label="Clear"
                variant="outline"
                onPress={clear}
                style={styles.flex}
              />
            </View>
            <Button label="Share as image" variant="outline" onPress={share} />

            <AppText style={[styles.label, styles.savedTitle]}>
              Saved loadouts
            </AppText>
            {loadouts.length === 0 ? (
              <AppText style={{ color: colors.muted }}>
                Nothing saved yet.
              </AppText>
            ) : (
              loadouts.map((l) => (
                <View
                  key={l.id}
                  style={[
                    styles.saved,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.flex}>
                    <AppText style={styles.savedName}>{l.name}</AppText>
                    <AppText style={[styles.small, { color: colors.muted }]}>
                      {l.charms.length} charms ·{" "}
                      {l.charms.reduce((sum, n) => sum + cost(n), 0)} /{" "}
                      {l.limit} notches
                    </AppText>
                  </View>
                  <Button
                    label="Load"
                    variant="outline"
                    onPress={() => load(l)}
                  />
                  <Button
                    label="Delete"
                    variant="outline"
                    onPress={() => confirmDelete(l)}
                  />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.offscreen} pointerEvents="none">
        <View ref={cardRef} collapsable={false} style={styles.shareCard}>
          <AppText style={styles.shareTitle}>
            {name.trim() || "My loadout"}
          </AppText>
          <AppText style={styles.shareSub}>
            {used} / {limit} notches{over ? " · Overcharmed" : ""}
          </AppText>
          <View style={styles.shareGrid}>
            {selected.map((n) => {
              const charm = charms.find((c) => c.name === n);
              return (
                <View key={n} style={styles.shareItem}>
                  <Image
                    source={charmImages[charm?.image]}
                    style={styles.shareImg}
                    contentFit="contain"
                  />
                  <AppText style={styles.shareName} numberOfLines={2}>
                    {n}
                  </AppText>
                  <AppText style={styles.shareCost}>{charm?.notches}</AppText>
                </View>
              );
            })}
          </View>
          <AppText style={styles.shareFoot}>Hollow Knight Guide</AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  offscreen: { position: "absolute", left: -2000, top: 0 },
  shareCard: { width: 360, backgroundColor: "#0f0f1b", padding: 16, gap: 8 },
  shareTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  shareSub: { color: "#b8b8cc", fontSize: 14, textAlign: "center" },
  shareGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  shareItem: { width: 100, alignItems: "center" },
  shareImg: { width: 64, height: 64 },
  shareName: { color: "#ffffff", fontSize: 12, textAlign: "center" },
  shareCost: { color: "#b8b8cc", fontSize: 11 },
  shareFoot: {
    color: "#8a8aa0",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  header: { marginBottom: 12, gap: 12 },
  back: { alignSelf: "flex-start", marginTop: 8 },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperButtons: { flexDirection: "row", alignItems: "center", gap: 12 },
  limit: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 28,
    textAlign: "center",
  },
  label: { fontWeight: "bold", fontSize: 16 },
  counter: { borderWidth: 2, borderRadius: 12, padding: 12, gap: 4 },
  counterText: { fontSize: 20, fontWeight: "bold" },
  overText: { color: "#c0392b", fontWeight: "bold" },
  small: { fontSize: 13 },
  empty: { textAlign: "center", marginTop: 16 },
  sortRow: { flexDirection: "row", gap: 8 },
  sortOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  sortText: { fontSize: 14, textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP },
  tile: {
    width: TILE,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tileImage: { width: TILE - 40, height: TILE - 40 },
  tileName: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
  },
  cost: { fontSize: 12, marginTop: 2 },
  footer: { marginTop: 12, gap: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 16 },
  actions: { flexDirection: "row", gap: 10 },
  savedTitle: { marginTop: 12 },
  saved: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  savedName: { fontWeight: "bold", fontSize: 16 },
});
