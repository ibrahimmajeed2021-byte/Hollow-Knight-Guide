import * as ImagePicker from 'expo-image-picker';

const options = { mediaTypes: ['images'], quality: 0.8 };

export async function takePhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;
  const result = await ImagePicker.launchCameraAsync(options);
  return result.canceled ? null : result.assets[0].uri;
}

export async function pickPhoto() {
  const result = await ImagePicker.launchImageLibraryAsync(options);
  return result.canceled ? null : result.assets[0].uri;
}
