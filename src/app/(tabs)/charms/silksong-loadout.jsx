import { Image } from "expo-image";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { downloadOnWeb } from "../../../utils/web-download";
import { AppText } from "../../../components/hollow/app-text";
import { Button } from "../../../components/hollow/button";
import { Screen } from "../../../components/hollow/screen";
import { Body, Title } from "../../../components/hollow/section-text";
import { silksongItems } from "../../../data/silksong-items";
import { silksongItemImages } from "../../../data/silksong-images";
import { useLoadouts } from "../../../loadouts/loadouts-context";
import { useHaptics, useSettings } from "../../../settings/SettingsContext.jsx";

const CRESTS = [
  { name: "Hunter Crest", slots: { red: 2, blue: 1, yellow: 1 } },
  { name: "Reaper Crest", slots: { red: 1, blue: 2, yellow: 1 } },
  { name: "Wanderer Crest", slots: { red: 2, blue: 0, yellow: 2 } },
  { name: "Beast Crest", slots: { red: 3, blue: 1, yellow: 0 } },
  { name: "Witch Crest", slots: { red: 1, blue: 2, yellow: 1 } },
  { name: "Architect Crest", slots: { red: 1, blue: 1, yellow: 3 } },
  { name: "Shaman Crest", slots: { red: 0, blue: 1, yellow: 3 } },
  { name: "Cursed Crest", slots: { red: 0, blue: 0, yellow: 0 } },
  { name: "Cloakless Crest", slots: { red: 0, blue: 0, yellow: 0 } },
];
const COLORS = [
  { id: "red", label: "Red Tools", kind: "Red Tool", color: "#c84c4c" },
  { id: "blue", label: "Blue Tools", kind: "Blue Tool", color: "#4c83c8" },
  { id: "yellow", label: "Yellow Tools", kind: "Yellow Tool", color: "#c59b37" },
];
const MAX_SLOTS = 6;
const cardWidth = Math.min(Dimensions.get("window").width - 48, 420);

function crestSlots(name) {
  return CRESTS.find((crest) => crest.name === name)?.slots ?? CRESTS[0].slots;
}

function makeSlots(counts) {
  return Object.fromEntries(
    COLORS.map(({ id }) => [id, Array.from({ length: counts[id] ?? 0 }, () => null)]),
  );
}

function normalizeSlots(value, crest) {
  const base = makeSlots(crestSlots(crest));
  if (!value) return base;
  return Object.fromEntries(
    COLORS.map(({ id }) => {
      const count = Math.max(0, Math.min(MAX_SLOTS, Number(value[id]?.length ?? base[id].length)));
      return [id, Array.from({ length: count }, (_, index) => value[id]?.[index] ?? null)];
    }),
  );
}

export default function SilksongLoadoutScreen() {
  const { colors } = useSettings();
  const triggerHaptic = useHaptics();
  const { loadouts, saveLoadout, deleteLoadout } = useLoadouts();
  const [crest, setCrest] = useState("Hunter Crest");
  const [slots, setSlots] = useState(() => makeSlots(crestSlots("Hunter Crest")));
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [toolSearch, setToolSearch] = useState("");
  const cardRef = useRef(null);

  const crestData = useMemo(
    () => silksongItems.find((item) => item.name === crest),
    [crest],
  );
  const tools = useMemo(
    () => silksongItems.filter((item) => item.kind && item.kind !== "Crest"),
    [],
  );
  const availableTools = useMemo(() => {
    if (!activeSlot) return [];
    const kind = COLORS.find((item) => item.id === activeSlot.color)?.kind;
    const query = toolSearch.trim().toLowerCase();
    return tools.filter(
      (tool) => tool.kind === kind && (!query || tool.name.toLowerCase().includes(query)),
    );
  }, [activeSlot, toolSearch, tools]);

  const selectedCount = COLORS.reduce(
    (sum, color) => sum + slots[color.id].filter(Boolean).length,
    0,
  );

  const changeCrest = (nextCrest) => {
    triggerHaptic();
    setCrest(nextCrest);
    setSlots(makeSlots(crestSlots(nextCrest)));
    setActiveSlot(null);
  };

  const resizeSlots = (color, amount) => {
    triggerHaptic();
    setSlots((previous) => {
      const next = [...previous[color]];
      if (amount > 0 && next.length < MAX_SLOTS) next.push(null);
      if (amount < 0 && next.length > 0) next.pop();
      return { ...previous, [color]: next };
    });
  };

  const assignTool = (tool) => {
    if (!activeSlot) return;
    setSlots((previous) => ({
      ...previous,
      [activeSlot.color]: previous[activeSlot.color].map((item, index) =>
        index === activeSlot.index ? tool.name : item,
      ),
    }));
    setActiveSlot(null);
    setToolSearch("");
    triggerHaptic();
  };

  const clearSlot = (color, index) => {
    setSlots((previous) => ({
      ...previous,
      [color]: previous[color].map((item, i) => (i === index ? null : item)),
    }));
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name needed", "Give this loadout a name before saving.");
      return;
    }
    const id = saveLoadout({
      id: editingId ?? undefined,
      name: trimmed,
      crest,
      slots,
      tools: COLORS.flatMap(({ id: color }) => slots[color].filter(Boolean)),
    });
    setEditingId(id);
    Alert.alert("Loadout saved", `"${trimmed}" has been saved.`);
  };

  const load = (item) => {
    const nextCrest = CRESTS.some((entry) => entry.name === item.crest)
      ? item.crest
      : "Hunter Crest";
    setCrest(nextCrest);
    setSlots(normalizeSlots(item.slots, nextCrest));
    setName(item.name);
    setEditingId(item.id);
    setActiveSlot(null);
  };

  const clear = () => {
    setCrest("Hunter Crest");
    setSlots(makeSlots(crestSlots("Hunter Crest")));
    setName("");
    setEditingId(null);
    setActiveSlot(null);
  };

  const confirmDelete = (item) =>
    Alert.alert(`Delete "${item.name}"?`, "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteLoadout(item.id);
          if (item.id === editingId) setEditingId(null);
        },
      },
    ]);

  const share = async () => {
    if (!selectedCount && !crest) {
      Alert.alert("Nothing to share", "Choose a crest and add some tools first.");
      return;
    }
    try {
      if (Platform.OS === "web") {
        const dataUri = await captureRef(cardRef, { format: "png", result: "data-uri" });
        downloadOnWeb(dataUri, "silksong-loadout.png");
        return;
      }
      const uri = await captureRef(cardRef, { format: "png", quality: 1 });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing unavailable", "This device cannot share files.");
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: "image/png", UTI: "public.png" });
    } catch {
      Alert.alert("Share failed", "Could not create the loadout image.");
    }
  };

  const renderSlot = (color, index, shareMode = false) => {
    const toolName = slots[color.id][index];
    const tool = tools.find((item) => item.name === toolName);
    const image = tool ? silksongItemImages[tool.image] : null;
    return (
      <View
        key={`${color.id}-${index}`}
        style={[
          styles.slot,
          { borderColor: color.color, backgroundColor: shareMode ? "#171a20" : colors.card },
        ]}
      >
        {shareMode ? (
          <>
            {image ? <Image source={image} style={styles.slotImage} contentFit="contain" /> : null}
            <AppText style={styles.slotName}>{toolName || "Empty slot"}</AppText>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => {
                setActiveSlot({ color: color.id, index });
                setToolSearch("");
              }}
              style={styles.slotButton}
              accessibilityRole="button"
              accessibilityLabel={toolName ? `Change ${toolName} in ${color.label} slot ${index + 1}` : `Choose tool for ${color.label} slot ${index + 1}`}
            >
              {image ? <Image source={image} style={styles.slotImage} contentFit="contain" /> : <AppText style={styles.emptySlot}>＋</AppText>}
              <AppText style={styles.slotName} numberOfLines={2}>{toolName || "Choose tool"}</AppText>
            </Pressable>
            {toolName ? (
              <Pressable onPress={() => clearSlot(color.id, index)} style={styles.clearSlot}>
                <AppText style={styles.clearText}>Remove</AppText>
              </Pressable>
            ) : null}
          </>
        )}
      </View>
    );
  };

  return (
    <Screen scroll={false}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />
        <Title>Silksong Loadout Builder</Title>
        <Body>Choose a Crest, configure its tool spaces, then assign matching Red, Blue and Yellow Tools. Crest selection sets the starting layout, and you can customise every slot count.</Body>

        <Title style={styles.sectionTitle}>1. Choose your Crest</Title>
        <View style={styles.crestGrid}>
          {CRESTS.map((item) => {
            const selected = crest === item.name;
            const imageKey = item.name.replaceAll(" ", "").replace("Crest", "Crest");
            const image = silksongItemImages[imageKey];
            return (
              <Pressable
                key={item.name}
                onPress={() => changeCrest(item.name)}
                style={[
                  styles.crestTile,
                  { backgroundColor: colors.card, borderColor: selected ? colors.accent : colors.border },
                  selected && styles.selectedTile,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                {image ? <Image source={image} style={styles.crestImage} contentFit="contain" /> : <View style={styles.crestPlaceholder}><AppText style={styles.crestInitial}>{item.name[0]}</AppText></View>}
                <AppText style={styles.crestName}>{item.name}</AppText>
                <AppText style={[styles.slotSummary, { color: colors.muted }]}>
                  R {item.slots.red} · B {item.slots.blue} · Y {item.slots.yellow}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {crestData?.description ? <Body>{crestData.description}</Body> : null}

        <Title style={styles.sectionTitle}>2. Configure tool spaces</Title>
        <Body>The Crest pre-fills these counts. Use + or − to customise your build (up to {MAX_SLOTS} slots of each colour).</Body>
        {COLORS.map((color) => (
          <View key={color.id} style={[styles.colorPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.colorHeading}>
              <View style={[styles.colorDot, { backgroundColor: color.color }]} />
              <AppText style={styles.colorTitle}>{color.label}</AppText>
              <View style={styles.stepper}>
                <Button label="−" variant="outline" disabled={slots[color.id].length === 0} onPress={() => resizeSlots(color.id, -1)} />
                <AppText style={styles.slotCount}>{slots[color.id].length}</AppText>
                <Button label="+" variant="outline" disabled={slots[color.id].length >= MAX_SLOTS} onPress={() => resizeSlots(color.id, 1)} />
              </View>
            </View>
            <View style={styles.slotGrid}>
              {slots[color.id].map((_, index) => renderSlot(color, index))}
              {slots[color.id].length === 0 ? <AppText style={{ color: colors.muted }}>No {color.label.toLowerCase()} equipped.</AppText> : null}
            </View>
          </View>
        ))}

        <Title style={styles.sectionTitle}>3. Save and share</Title>
        <AppText style={[styles.label, { color: colors.text }]}>{editingId ? "Editing saved loadout" : "Save loadout"}</AppText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Loadout name"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <View style={styles.actions}>
          <Button label={editingId ? "Update" : "Save"} onPress={save} style={styles.flex} />
          <Button label="Clear" variant="outline" onPress={clear} style={styles.flex} />
        </View>
        <Button label="Share as image" variant="outline" onPress={share} />
        <Title style={styles.sectionTitle}>Saved Silksong loadouts</Title>
        {loadouts.filter((item) => item.crest).length === 0 ? (
          <AppText style={{ color: colors.muted }}>No Silksong loadouts saved yet.</AppText>
        ) : loadouts.filter((item) => item.crest).map((item) => (
          <View key={item.id} style={[styles.saved, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.flex}>
              <AppText style={styles.savedName}>{item.name}</AppText>
              <AppText style={{ color: colors.muted, fontSize: 12 }}>{item.crest} · {item.tools?.length ?? 0} tools</AppText>
            </View>
            <Button label="Load" variant="outline" onPress={() => load(item)} />
            <Button label="Delete" variant="outline" onPress={() => confirmDelete(item)} />
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!activeSlot} animationType="slide" onRequestClose={() => setActiveSlot(null)}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Title>Choose a {activeSlot ? COLORS.find((item) => item.id === activeSlot.color)?.label : "Tool"}</Title>
            <Button label="Close" variant="outline" onPress={() => setActiveSlot(null)} />
          </View>
          <TextInput
            value={toolSearch}
            onChangeText={setToolSearch}
            placeholder="Search tools"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <ScrollView contentContainerStyle={styles.toolList}>
            {availableTools.map((tool) => (
              <Pressable
                key={tool.name}
                onPress={() => assignTool(tool)}
                style={[styles.toolRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Image source={silksongItemImages[tool.image]} style={styles.toolImage} contentFit="contain" />
                <View style={styles.flex}>
                  <AppText style={styles.toolName}>{tool.name}</AppText>
                  <AppText style={{ color: colors.muted, fontSize: 12 }}>{tool.description}</AppText>
                </View>
              </Pressable>
            ))}
            {availableTools.length === 0 ? <AppText style={{ color: colors.muted }}>No matching tools.</AppText> : null}
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.offscreen} pointerEvents="none">
        <View ref={cardRef} collapsable={false} style={[styles.shareCard, { width: cardWidth }]}>
          <AppText style={styles.shareEyebrow}>HOLLOW KNIGHT: SILKSONG</AppText>
          <AppText style={styles.shareTitle}>{name.trim() || "My Silksong Loadout"}</AppText>
          <View style={styles.shareCrest}>
            {crestData && silksongItemImages[crestData.image] ? <Image source={silksongItemImages[crestData.image]} style={styles.shareCrestImage} contentFit="contain" /> : null}
            <AppText style={styles.shareCrestName}>{crest}</AppText>
          </View>
          {COLORS.map((color) => (
            <View key={color.id} style={styles.shareSection}>
              <AppText style={[styles.shareSectionTitle, { color: color.color }]}>{color.label} · {slots[color.id].length} slots</AppText>
              <View style={styles.shareGrid}>
                {slots[color.id].map((_, index) => renderSlot(color, index, true))}
              </View>
            </View>
          ))}
          <AppText style={styles.shareFoot}>Silksong Loadout Builder · Hollow Knight Guide</AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 48, gap: 10 },
  back: { alignSelf: "flex-start", marginTop: 8 },
  sectionTitle: { fontSize: 21, marginTop: 18 },
  crestGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  crestTile: { width: "31.5%", borderWidth: 1, borderRadius: 12, padding: 8, alignItems: "center", gap: 4 },
  selectedTile: { borderWidth: 3 },
  crestImage: { width: 54, height: 54 },
  crestPlaceholder: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#414653", alignItems: "center", justifyContent: "center" },
  crestInitial: { color: "#fff", fontSize: 25, fontWeight: "bold" },
  crestName: { fontSize: 12, fontWeight: "bold", textAlign: "center" },
  slotSummary: { fontSize: 10 },
  colorPanel: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 12 },
  colorHeading: { flexDirection: "row", alignItems: "center", gap: 8 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  colorTitle: { fontSize: 16, fontWeight: "bold", flex: 1 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 8 },
  slotCount: { minWidth: 18, textAlign: "center", fontSize: 17, fontWeight: "bold" },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { width: "31.5%", minHeight: 112, borderWidth: 1.5, borderRadius: 10, padding: 6, alignItems: "center", justifyContent: "center", gap: 3 },
  slotButton: { width: "100%", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" },
  slotImage: { width: 48, height: 48 },
  slotName: { color: "#fff", fontSize: 10, textAlign: "center", fontWeight: "bold" },
  emptySlot: { fontSize: 32, color: "#aab0bd" },
  clearSlot: { paddingVertical: 3, paddingHorizontal: 8 },
  clearText: { color: "#e58b8b", fontSize: 10 },
  label: { fontSize: 15, fontWeight: "bold" },
  input: { borderWidth: 1, borderRadius: 10, padding: 11, fontSize: 16 },
  actions: { flexDirection: "row", gap: 10 },
  saved: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, padding: 10 },
  savedName: { fontSize: 15, fontWeight: "bold" },
  modal: { flex: 1, padding: 16, paddingTop: 54, gap: 12 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  toolList: { gap: 8, paddingBottom: 30 },
  toolRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderWidth: 1, borderRadius: 10 },
  toolImage: { width: 56, height: 56 },
  toolName: { fontSize: 15, fontWeight: "bold" },
  offscreen: { position: "absolute", left: -2000, top: 0 },
  shareCard: { backgroundColor: "#0d1119", padding: 18, gap: 10 },
  shareEyebrow: { color: "#91a4c0", fontSize: 10, letterSpacing: 2, textAlign: "center" },
  shareTitle: { color: "#fff", fontSize: 24, fontWeight: "bold", textAlign: "center" },
  shareCrest: { alignItems: "center", gap: 4, paddingVertical: 6 },
  shareCrestImage: { width: 70, height: 70 },
  shareCrestName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  shareSection: { gap: 6, marginTop: 6 },
  shareSectionTitle: { fontSize: 13, fontWeight: "bold" },
  shareGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  shareFoot: { color: "#8590a3", fontSize: 10, textAlign: "center", marginTop: 8 },
});
