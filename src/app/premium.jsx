import { router } from "expo-router";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { AppText } from "../components/hollow/app-text";
import { Screen } from "../components/hollow/screen";
import { Title } from "../components/hollow/section-text";
import { usePurchases } from "../purchases/PurchasesContext";
import { useSettings } from "../settings/SettingsContext";

function packageName(item) {
  const id = (item.identifier + " " + item.product.identifier).toLowerCase();
  if (id.includes("lifetime")) return "Lifetime Premium";
  if (id.includes("yearly") || id.includes("annual")) return "Yearly Premium";
  if (id.includes("monthly")) return "Monthly Premium";
  return item.product.title || item.identifier;
}

export default function PremiumScreen() {
  const { colors } = useSettings();
  const {
    ready, busy, error, clearError, isPremium, actualIsPremium, previewFree, setPreviewFree, customerInfo, offerings,
    purchasePackage, restorePurchases, presentPaywall, presentCustomerCenter,
  } = usePurchases();

  const packages = offerings?.current?.availablePackages || [];
  const activeEntitlement = customerInfo?.entitlements?.active?.hollow_knight_guide_pro;
  const expiresAt = activeEntitlement?.expirationDate;

  return (
    <Screen>
      <View style={styles.content}>
        <Title>Premium</Title>
        {__DEV__ ? (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <AppText style={styles.heading}>Developer testing</AppText>
            <View style={styles.testRow}>
              <View style={{ flex: 1, gap: 4 }}>
                <AppText style={{ fontWeight: "bold" }}>Preview Free Mode</AppText>
                <AppText style={{ color: colors.muted, fontSize: 13 }}>
                  {actualIsPremium
                    ? "Simulate a free user to test locked themes, selector music and ads. Your test purchase remains active in RevenueCat."
                    : "No active Premium entitlement is detected. You can still preview Free Mode."}
                </AppText>
              </View>
              <Switch
                accessibilityLabel="Preview Free Mode"
                value={previewFree}
                onValueChange={setPreviewFree}
                trackColor={{ true: colors.button }}
              />
            </View>
            {previewFree ? (
              <AppText style={{ color: colors.muted, fontSize: 13 }}>
                Free preview is ON. Turn it off to return to your actual Premium status.
                A debug app reload resets this switch.
              </AppText>
            ) : null}
          </View>
        ) : null}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText style={styles.heading}>
            {isPremium ? "Premium is active" : ready ? "Unlock Premium" : "Checking your purchases…"}
          </AppText>
          <AppText style={{ color: colors.muted }}>
            {isPremium
              ? "Thanks for supporting Hollow Knight Guide. Your Premium features are unlocked."
              : "Keep the entire guide and music player free. Premium adds special themes and extra game-selector tracks."}
          </AppText>
          {isPremium && expiresAt ? (
            <AppText style={{ color: colors.muted }}>
              {activeEntitlement?.willRenew
                ? "Current subscription period ends: "
                : "Premium access until: "}
              {new Date(expiresAt).toLocaleDateString()}
            </AppText>
          ) : null}
          <AppText>✓ Hollow Knight and Silksong appearance styles</AppText>
          <AppText>✓ All additional game-selector music</AppText>
          <AppText>✓ Same Premium access with monthly, yearly or lifetime purchase</AppText>
        </View>

        {error ? (
          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <AppText accessibilityRole="alert">{error}</AppText>
            <Pressable onPress={clearError} accessibilityRole="button">
              <AppText style={{ color: colors.accent, fontWeight: "bold" }}>Dismiss message</AppText>
            </Pressable>
          </View>
        ) : null}

        {!isPremium ? (
          <>
            <Pressable
              disabled={!ready || busy || !offerings?.current}
              accessibilityRole="button"
              onPress={presentPaywall}
              style={[styles.primary, { backgroundColor: colors.button, opacity: !ready || busy ? 0.6 : 1 }]}
            >
              <AppText style={[styles.primaryText, { color: colors.buttonText }]}>
                {busy ? "Please wait…" : "View Premium paywall"}
              </AppText>
            </Pressable>

            <AppText style={styles.heading}>Purchase options</AppText>
            {packages.length ? packages.map((item) => (
              <Pressable
                key={item.identifier}
                disabled={!ready || busy}
                accessibilityRole="button"
                accessibilityLabel={`Buy ${packageName(item)}, ${item.product.priceString || "price shown at checkout"}`}
                onPress={() => purchasePackage(item)}
                style={[styles.purchaseRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.packageText}>
                  <AppText style={styles.productTitle}>{packageName(item)}</AppText>
                  <AppText style={{ color: colors.muted, fontSize: 13 }}>
                    {item.product.identifier}
                  </AppText>
                </View>
                <AppText style={{ color: colors.accent, fontWeight: "bold" }}>
                  {item.product.priceString || "Choose"}
                </AppText>
              </Pressable>
            )) : (
              <AppText style={{ color: colors.muted }}>
                {ready
                  ? "No purchase options found. In RevenueCat, add monthly, yearly and lifetime products to a Current offering."
                  : "Loading available purchases…"}
              </AppText>
            )}
          </>
        ) : null}

        <Pressable
          disabled={!ready || busy}
          onPress={restorePurchases}
          accessibilityRole="button"
          style={[styles.secondary, { borderColor: colors.border }]}
        >
          <AppText style={{ color: colors.text, fontWeight: "bold" }}>Restore purchases</AppText>
        </Pressable>

        {isPremium ? (
          <Pressable
            disabled={busy}
            onPress={presentCustomerCenter}
            accessibilityRole="button"
            style={[styles.secondary, { borderColor: colors.border }]}
          >
            <AppText style={{ color: colors.text, fontWeight: "bold" }}>
              Manage subscription / Customer Center
            </AppText>
          </Pressable>
        ) : null}

        <AppText style={[styles.note, { color: colors.muted }]}>
          Purchases are managed by RevenueCat. Test Store purchases are simulated and do not charge real money. A monthly or yearly subscription renews until cancelled; lifetime is a one-time purchase.
        </AppText>
        <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.back}>
          <AppText style={{ color: colors.accent }}>Back to settings</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, gap: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  heading: { fontSize: 20, fontWeight: "bold" },
  primary: { paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", minHeight: 52, justifyContent: "center" },
  primaryText: { fontSize: 16, fontWeight: "bold" },
  purchaseRow: { borderWidth: 1, borderRadius: 12, minHeight: 68, padding: 14, alignItems: "center", flexDirection: "row", gap: 12 },
  packageText: { flex: 1, gap: 4 },
  testRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  productTitle: { fontSize: 17, fontWeight: "bold" },
  secondary: { borderWidth: 1, borderRadius: 12, minHeight: 48, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  note: { fontSize: 13, lineHeight: 19 },
  back: { alignSelf: "center", paddingVertical: 8 },
});
