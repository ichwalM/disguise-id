import { create } from 'zustand';

export type MascotState = 
  | 'IDLE' 
  | 'PROBLEM' 
  | 'SCANNING' 
  | 'ANALYZING' 
  | 'RECONSTRUCTING' 
  | 'MATCH_FOUND' 
  | 'REPORTING';

export type InteractionState = 
  | 'NONE'
  | 'HOVER_MASCOT'
  | 'DEMO_OPEN'
  | 'MOBILE_PREVIEW_OPEN'
  | 'ARCHITECTURE_OPEN';

interface MascotStore {
  currentState: MascotState;
  setState: (state: MascotState) => void;
  
  interaction: InteractionState;
  setInteraction: (interaction: InteractionState) => void;

  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

export const useMascotStore = create<MascotStore>((set) => ({
  currentState: 'IDLE',
  setState: (state) => set({ currentState: state }),
  
  interaction: 'NONE',
  setInteraction: (interaction) => set({ interaction }),

  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));
