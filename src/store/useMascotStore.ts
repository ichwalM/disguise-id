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
  // FSM State
  currentState: MascotState;
  setState: (state: MascotState) => void;
  
  // Interaction State
  interaction: InteractionState;
  setInteraction: (interaction: InteractionState) => void;

  // Cinematic Progress (0 to 1) mapped from GSAP ScrollTrigger
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  
  // Section index tracker
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
}

export const useMascotStore = create<MascotStore>((set) => ({
  currentState: 'IDLE',
  setState: (state) => set({ currentState: state }),
  
  interaction: 'NONE',
  setInteraction: (interaction) => set({ interaction }),

  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  activeSectionIndex: 0,
  setActiveSectionIndex: (index) => set({ activeSectionIndex: index }),
}));
