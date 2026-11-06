import { Image } from "expo-image";
import { useState } from "react";

// Use the API-controlled icon when online, while retaining an on-device
// fallback for offline access and failed third-party image requests.
export function ApiArtworkImage({ iconUrl, fallbackImage, ...props }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const online = typeof iconUrl === "string" && iconUrl.length > 0 &&
    failedUrl !== iconUrl;
  const source = online ? { uri: iconUrl } : fallbackImage;

  if (!source) return null;
  return (
    <Image
      {...props}
      source={source}
      onError={() => {
        if (online) setFailedUrl(iconUrl);
      }}
    />
  );
}
