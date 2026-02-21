import { create } from 'zustand';

interface AudioState {
    isPlaying: boolean;
    volume: number;
    currentTrack: { name: string; url: string } | null;

    setPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    setTrack: (track: { name: string; url: string }) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    isPlaying: false,
    volume: 1.0,
    currentTrack: null,

    setPlaying: (isPlaying) => set({ isPlaying }),
    setVolume: (volume) => set({ volume }),
    setTrack: (track) => set({ currentTrack: track }),
}));
