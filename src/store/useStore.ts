import { create } from 'zustand';
import { Profile } from '../types/database';

interface Store {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
}

export const useStore = create<Store>((set) => ({
  currentProfile: null,
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
}));