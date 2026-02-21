import React, { useState } from 'react';
import VisualizerCanvas from './components/visualizer/VisualizerCanvas';
import { audioController } from './core/audio/AudioController';
import { useAudioStore } from './store/useAudioStore';

function App() {
  const { setPlaying, setTrack } = useAudioStore();
  const [hasStarted, setHasStarted] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      audioController.loadAudio(url);
      audioController.play();

      setTrack({ name: file.name, url });
      setPlaying(true);
      setHasStarted(true);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* Background Visualizer */}
      <VisualizerCanvas />

      {/* Foreground UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex flex-col items-start pointer-events-none">
        <h1 className="text-4xl font-bold tracking-tighter mb-4 pointer-events-auto">
          LowCortiSparcs
        </h1>

        {!hasStarted && (
          <div className="pointer-events-auto bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
            <p className="mb-4 text-sm opacity-80">Upload an MP3 to start the experience</p>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
