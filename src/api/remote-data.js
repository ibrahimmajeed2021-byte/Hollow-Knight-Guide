import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web"
    ? "/api"
    : "https://hollow-knight-guide-ibrahim.surge.sh/api";
const CACHE_PREFIX = "hollow-knight-guide:api:";
const TIMEOUT_MS = 8000;

const valid = (data) =>
  Array.isArray(data) &&
  data.every((entry) => entry && typeof entry.name === "string");

export async function readCached(path) {
  try {
    const [raw, at] = await Promise.all([
      AsyncStorage.getItem(CACHE_PREFIX + path),
      AsyncStorage.getItem(`${CACHE_PREFIX}${path}:at`),
    ]);
    const data = raw ? JSON.parse(raw) : null;
    return valid(data) ? { data, at: at ? Number(at) : null } : null;
  } catch {
    return null;
  }
}

export async function fetchRemote(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}/${path}`, {
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!valid(data)) return null;
    AsyncStorage.setItem(CACHE_PREFIX + path, JSON.stringify(data)).catch(
      () => {},
    );
    AsyncStorage.setItem(`${CACHE_PREFIX}${path}:at`, String(Date.now())).catch(
      () => {},
    );
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}


// Media metadata is a small JSON object rather than an array of entries.
// The bundled artwork remains available if the server or cached metadata fails.
const validMediaManifest = (value) =>
  !!value && typeof value === "object" &&
  typeof value.games?.hollow?.heroImageUrl === "string" &&
  typeof value.games?.silksong?.heroImageUrl === "string";

export async function readCachedMediaManifest() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + "media.json");
    const value = raw ? JSON.parse(raw) : null;
    return validMediaManifest(value) ? value : null;
  } catch {
    return null;
  }
}

export async function fetchMediaManifest() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(BASE_URL + "/media.json", {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return null;
    const value = await response.json();
    if (!validMediaManifest(value)) return null;
    AsyncStorage.setItem(CACHE_PREFIX + "media.json", JSON.stringify(value)).catch(() => {});
    return value;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
