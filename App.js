import React from "react";
import AudioSettings from "./components/AudioSettings";
import { AudioProvider } from "./context/AudioContext";

export default function App() {
  return (
    <AudioProvider>
      <AudioSettings />
    </AudioProvider>
  );
}
