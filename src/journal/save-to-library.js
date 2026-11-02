import { Asset, requestPermissionsAsync } from 'expo-media-library';

export async function saveToLibrary(uri) {
  const permission = await requestPermissionsAsync(true);
  if (!permission.granted) return false;
  await Asset.create(uri);
  return true;
}
