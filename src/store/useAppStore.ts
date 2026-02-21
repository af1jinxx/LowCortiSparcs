import { create } from 'zustand';

interface AppState {
    theme: 'dark' | 'light';
    isHudOpen: boolean;
    activeVisualizerId: string;

    toggleTheme: () => void;
    toggleHud: () => void;
    setVisualizer: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    theme: 'dark',
    isHudOpen: true,
    activeVisualizerId: 'grid-wave',

    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    toggleHud: () => set((state) => ({ isHudOpen: !state.isHudOpen })),
    setVisualizer: (id) => set({ activeVisualizerId: id }),
}));
