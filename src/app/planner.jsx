import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Button } from "../components/hollow/button";
import { ProgressBar } from "../components/hollow/progress-bar";
import { Screen } from "../components/hollow/screen";
import { Body, Title } from "../components/hollow/section-text";
import { useGame } from "../games/game-context";
import { useJournal } from "../journal/journal-context";
import { useGuidedMode } from "../premium/guided-context";
import { buildSuggestedPlan, FEATURED_GOALS, listGoalEntries, getEntry } from "../premium/planner-logic.mjs";
import { usePurchases } from "../purchases/PurchasesContext";
import { useSettings } from "../settings/SettingsContext.jsx";
import { layout, radius, space, type } from "../ui/design-system";

function destination(kind, entry, gameId) {
  if (kind === "boss") return "/bosses";
  if (kind === "item") return "/charms";
  if (gameId === "silksong") {
    return ["wishes", "objectives"].includes(entry.group) ? "/quests" : "/charms";
  }
  return "/progress/collectibles";
}

export default function PlannerScreen() {
  const { colors } = useSettings();
  const { isPremium } = usePurchases();
  const { config } = useGame();
  const { defeated, collected, toggleDefeated, toggleCollected } = useJournal();
  const guided = useGuidedMode();
  const [query, setQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [expandedHints, setExpandedHints] = useState({});

  const featured = useMemo(() => (FEATURED_GOALS[config.id] || [])
    .map((goal) => ({ ...goal, found: getEntry(config, goal.kind + ":" + goal.name) }))
    .filter((goal) => goal.found && guided.isVisible(goal.kind, goal.found.entry)),
  [config, guided]);

  const choices = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return listGoalEntries(config)
      .filter(({ kind, entry }) =>
        guided.isVisible(kind, entry) &&
        (entry.name.toLowerCase().includes(term) ||
         String(entry.location || "").toLowerCase().includes(term)),
      )
      .slice(0, 16);
  }, [query, config, guided]);

  const plan = useMemo(() =>
    buildSuggestedPlan(config, guided.goal, defeated, collected),
  [config, guided.goal, defeated, collected]);
  const completed = plan.filter((step) => step.completed).length;
  const progress = plan.length ? Math.round(completed / plan.length * 100) : 0;

  const pickGoal = (kind, entry) => {
    guided.chooseGoal({ kind, name: entry.name });
    setQuery("");
    setShowPicker(false);
    setExpandedHints({});
  };

  const markStep = (step) => {
    if (step.kind === "boss") toggleDefeated(step.entry.name);
    else toggleCollected((step.kind === "collectible" ? "c:" : "") + step.entry.name);
  };

  if (!isPremium) return (
    <Screen>
      <Title>Smart progression planner</Title>
      <Body>Premium creates a personalised, progress-aware checklist from your guide and its suggested preparation chains.</Body>
      <Button label="Explore Premium" onPress={() => router.push("/premium")} style={styles.button} />
    </Screen>
  );

  return (
    <Screen>
      <Button label="Back" variant="outline" onPress={() => router.back()} style={styles.back} />
      <Title>Smart progression planner</Title>
      <Body>Choose a goal in {config.title}. Your suggested steps adapt to the bosses and collectibles you've already completed. Nothing is marked complete automatically.</Body>

      <View style={[styles.panel, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <AppText style={styles.heading}>Suggested goals</AppText>
        <View style={styles.featuredGrid}>
          {featured.map((goal) => (
            <Pressable
              key={goal.kind + ":" + goal.name}
              onPress={() => pickGoal(goal.kind, goal.found.entry)}
              accessibilityRole="button"
              style={[styles.goalOption, { borderColor: guided.goal?.name === goal.name && guided.goal?.kind === goal.kind ? colors.accent : colors.border }]}
            >
              <AppText style={styles.goalName}>{goal.title}</AppText>
              <AppText style={[styles.goalHint, { color: colors.muted }]}>{goal.name}</AppText>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => setShowPicker((v) => !v)}
          accessibilityRole="button"
          style={[styles.action, { borderColor: colors.border }]}
        >
          <AppText style={[styles.link, { color: colors.accent }]}>
            {showPicker ? "Close goal search" : "Choose any boss, item, ability or collectible"}
          </AppText>
        </Pressable>
        {showPicker ? (
          <>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search for a goal"
              placeholderTextColor={colors.muted}
              autoCorrect={false}
              accessibilityLabel="Search for a progression goal"
              style={[styles.search, { color: colors.text, borderColor: colors.border }]}
            />
            {choices.map(({ kind, entry }) => (
              <Pressable
                key={kind + ":" + entry.name}
                onPress={() => pickGoal(kind, entry)}
                accessibilityRole="button"
                style={[styles.searchRow, { borderBottomColor: colors.border }]}
              >
                <AppText style={[styles.flex, { color: colors.text }]}>{entry.name}</AppText>
                <AppText style={{ color: colors.muted }}>{kind}</AppText>
              </Pressable>
            ))}
            {!query.trim() ? (
              <AppText style={[styles.help, { color: colors.muted }]}>Type a name to find an entry in the current game.</AppText>
            ) : !choices.length ? (
              <AppText style={[styles.help, { color: colors.muted }]}>No visible goals match. Guided Mode may hide later discoveries.</AppText>
            ) : null}
          </>
        ) : null}
      </View>

      {guided.goal && plan.length ? (
        <View style={[styles.panel, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <AppText style={styles.heading}>Your personalised route</AppText>
          <AppText style={[styles.help, { color: colors.muted }]}>
            {completed} of {plan.length} suggested steps completed. This is a recommended preparation chain, not a mandatory or shortest route.
          </AppText>
          <ProgressBar pct={progress} label="Progression goal checklist" />
          {plan.map((step, index) => {
            const visible = guided.isVisible(step.kind, step.entry);
            const showHint = expandedHints[step.id] === true;
            return (
              <View key={step.id} style={[styles.step, { borderColor: colors.border }]}>
                <View style={styles.stepHeader}>
                  <AppText style={[styles.number, { color: colors.accent }]}>
                    {step.completed ? "✓" : index + 1}
                  </AppText>
                  <View style={styles.flex}>
                    <AppText style={[styles.stepName, { color: colors.text }]}>
                      {visible ? step.entry.name : guided.hiddenLabel(step.kind)}
                    </AppText>
                    <AppText style={[styles.help, { color: colors.muted }]}>
                      {step.completed ? "Completed" : step.goal ? "Your goal" : "Suggested preparation"}
                    </AppText>
                  </View>
                </View>
                {!visible ? (
                  <Pressable
                    onPress={() => guided.revealEntry(step.kind, step.entry)}
                    accessibilityRole="button"
                    style={[styles.action, { borderColor: colors.border }]}
                  >
                    <AppText style={[styles.link, { color: colors.accent }]}>Reveal this step (spoiler)</AppText>
                  </Pressable>
                ) : (
                  <>
                    {showHint ? (
                      <AppText style={[styles.hintText, { color: colors.text }]}>
                        {step.entry.requires
                          ? "Suggested requirements: " + step.entry.requires + "\n"
                          : ""}
                        {step.entry.location || step.entry.locations?.map((x) => x.name).join(", ") || "Open the guide for detailed acquisition information."}
                      </AppText>
                    ) : null}
                    <View style={styles.actions}>
                      <Pressable
                        onPress={() => setExpandedHints((p) => ({ ...p, [step.id]: !showHint }))}
                        accessibilityRole="button"
                        style={[styles.action, { borderColor: colors.border }]}
                      >
                        <AppText style={[styles.link, { color: colors.accent }]}>{showHint ? "Hide hints" : "Location hints"}</AppText>
                      </Pressable>
                      <Pressable
                        onPress={() => router.push({ pathname: destination(step.kind, step.entry, config.id), params: { query: step.entry.name } })}
                        accessibilityRole="button"
                        style={[styles.action, { borderColor: colors.border }]}
                      >
                        <AppText style={[styles.link, { color: colors.accent }]}>Open guide</AppText>
                      </Pressable>
                      <Pressable
                        onPress={() => markStep(step)}
                        accessibilityRole="button"
                        accessibilityLabel={(step.completed ? "Undo completion for " : "Mark completed: ") + step.entry.name}
                        style={[styles.action, { borderColor: colors.accent }]}
                      >
                        <AppText style={[styles.link, { color: colors.accent }]}>
                          {step.completed ? "Undo ✓" : "Mark done"}
                        </AppText>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            );
          })}
          <Pressable
            onPress={() => guided.chooseGoal(null)}
            accessibilityRole="button"
            style={[styles.action, { borderColor: colors.border }]}
          >
            <AppText style={[styles.link, { color: colors.accent }]}>Clear current goal</AppText>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.panel, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <AppText style={[styles.help, { color: colors.muted }]}>
            {guided.goal
              ? "That goal is no longer available in the current guide data. Choose another one."
              : "Pick one of the goals above to generate your personalised checklist."}
          </AppText>
        </View>
      )}
      <AppText style={[styles.disclaimer, { color: colors.muted }]}>
        Preparation suggestions are based on the existing field guide. Hollow Knight and Silksong both allow non-linear exploration; suggested steps may be optional, and some detailed requirements may need checking in the linked guide.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: "flex-start", marginHorizontal: 16, marginTop: 8 },
  button: { marginHorizontal: 16, marginTop: 16 },
  panel: { marginHorizontal: layout.gutter, marginTop: space.lg, padding: layout.cardPadding, borderRadius: radius.card, borderWidth: 1, gap: space.md },
  heading: { ...type.subheading },
  featuredGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  goalOption: { padding: space.md, borderWidth: 1, borderRadius: radius.control, minWidth: 130, minHeight: 68, flexGrow: 1, width: "46%", gap: space.xs },
  goalName: { fontSize: 15, fontWeight: "700" },
  goalHint: { fontSize: 12, lineHeight: 16 },
  action: { borderWidth: 1, borderRadius: radius.control, paddingHorizontal: space.md, paddingVertical: space.sm, minHeight: layout.touchTarget, justifyContent: "center", alignSelf: "flex-start" },
  link: { fontSize: 14, fontWeight: "700" },
  search: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 48, fontSize: 16 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 9 },
  flex: { flex: 1 },
  help: { fontSize: 13, lineHeight: 20 },
  step: { borderWidth: 1, borderRadius: radius.control, padding: space.md, gap: space.md },
  stepHeader: { flexDirection: "row", gap: 10, alignItems: "center" },
  number: { fontSize: 20, fontWeight: "900", minWidth: 22 },
  stepName: { fontSize: 16, fontWeight: "800" },
  hintText: { fontSize: 14, lineHeight: 22 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  disclaimer: { fontSize: 13, lineHeight: 19, marginHorizontal: 20, marginVertical: 20 },
});
