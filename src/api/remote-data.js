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
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + path);
    const data = raw ? JSON.parse(raw) : null;
    return valid(data) ? data : null;
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
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
