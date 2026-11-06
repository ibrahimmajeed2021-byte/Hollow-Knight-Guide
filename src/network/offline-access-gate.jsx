import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../components/hollow/app-text";
import { useOnlineAccess } from "./online-access-context";
import { setSoundPlaybackAllowed } from "../sound/game-sounds";
import { useSettings } from "../settings/SettingsContext.jsx";
import { usePurchases } from "../purchases/PurchasesContext";

// Absolute overlay sits above the game picker, splash transition and tabs.
// Premium is exempt and can keep using the bundled/cached guide offline.
export function OfflineAccessGate() {
  const { blocked, status, checking, retry } = useOnlineAccess();
  const { colors } = useSettings();
  const { ready, busy, previewFree, restorePurchases } = usePurchases();
  const [restoreMessage, setRestoreMessage] = useState("");

  useEffect(() => {
    setSoundPlaybackAllowed(!blocked);
    if (!blocked) setRestoreMessage("");
  }, [blocked]);

  if (!blocked) return null;
  const pending = status === "checking";

  return (
    <View
      style={[styles.overlay, { backgroundColor: colors.background }]}
      accessibilityViewIsModal
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <AppText style={styles.symbol}>{pending ? "⌛" : "📶"}</AppText>
        <AppText accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {pending ? "Checking your connection" : "Internet connection required"}
        </AppText>
        <AppText style={[styles.description, { color: colors.text }]}>
          {pending
            ? "Connecting to Hollow Knight Guide…"
            : "The free guide needs an active internet connection to continue. Turn on Wi-Fi or mobile data, then try again."}
        </AppText>
        {!pending ? (
          <>
            <AppText style={[styles.hint, { color: colors.muted }]}>
              We couldn't reach the guide service. If you're already connected, check your signal and try again.
            </AppText>
            <AppText style={[styles.premium, { color: colors.muted }]}>
              Premium works offline after the purchase has been verified on this device while connected.
            </AppText>
            <Pressable
              onPress={retry}
              disabled={checking}
              accessibilityRole="button"
              accessibilityLabel="Check internet connection again"
              style={[styles.button, { backgroundColor: colors.button, opacity: checking ? 0.65 : 1 }]}
            >
              {checking ? <ActivityIndicator color={colors.buttonText} /> : null}
              <AppText style={[styles.buttonText, { color: colors.buttonText }]}>
                {checking ? "Checking…" : "Try again"}
              </AppText>
            </Pressable>
            {Platform.OS !== "web" && !previewFree ? (
              <Pressable
                onPress={async () => {
                  setRestoreMessage("");
                  const success = await restorePurchases();
                  if (!success) {
                    setRestoreMessage(
                      "We couldn't verify a Premium purchase. Connect to the internet and try again.",
                    );
                  }
                }}
                disabled={!ready || busy}
                accessibilityRole="button"
                accessibilityLabel="Restore an existing Premium purchase"
                style={[styles.restoreButton, { borderColor: colors.border, opacity: busy ? 0.6 : 1 }]}
              >
                <AppText style={[styles.restoreText, { color: colors.accent }]}>
                  {busy ? "Restoring…" : "Restore Premium purchase"}
                </AppText>
              </Pressable>
            ) : null}
            {restoreMessage ? (
              <AppText accessibilityRole="alert" style={[styles.hint, { color: colors.muted }]}>
                {restoreMessage}
              </AppText>
            ) : null}
          </>
        ) : (
          <ActivityIndicator size="large" color={colors.accent} style={styles.progress} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3000,
    elevation: 3000,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 14,
  },
  symbol: { fontSize: 38 },
  title: { fontSize: 23, fontWeight: "800", textAlign: "center" },
  description: { fontSize: 16, lineHeight: 24, textAlign: "center" },
  hint: { fontSize: 14, lineHeight: 21, textAlign: "center" },
  premium: { fontSize: 13, lineHeight: 20, textAlign: "center" },
  button: { width: "100%", minHeight: 52, borderRadius: 12, flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center", marginTop: 6 },
  buttonText: { fontSize: 17, fontWeight: "700" },
  restoreButton: { width: "100%", minHeight: 48, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center", marginTop: 2 },
  restoreText: { fontSize: 15, fontWeight: "700" },
  progress: { marginTop: 12 },
});
