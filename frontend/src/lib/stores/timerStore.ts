import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TimerMode = 'timer' | 'chronometer';

interface TimerState {
  mode: TimerMode;
  isRunning: boolean;
  timeInSeconds: number;
  selectedDuration: number;
  chronometerTime: number;
  startTime: number | null;
  isStarting: boolean;
  countdown: number;
  timerStartTime: number | null;
  lastSyncTime: number | null;
  
  // Actions
  setMode: (mode: TimerMode) => void;
  setIsRunning: (isRunning: boolean) => void;
  setTimeInSeconds: (time: number) => void;
  setSelectedDuration: (duration: number) => void;
  setChronometerTime: (time: number) => void;
  setStartTime: (time: number | null) => void;
  setIsStarting: (isStarting: boolean) => void;
  setCountdown: (countdown: number) => void;
  setTimerStartTime: (time: number | null) => void;
  setLastSyncTime: (time: number | null) => void;
  resetTimer: () => void;
  syncTimerState: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'timer',
      isRunning: false,
      timeInSeconds: 25 * 60,
      selectedDuration: 25,
      chronometerTime: 0,
      startTime: null,
      isStarting: false,
      countdown: 0,
      timerStartTime: null,
      lastSyncTime: null,

      setMode: (mode) => set({ mode }),
      setIsRunning: (isRunning) => {
        if (!isRunning) {
          set({ isRunning, timerStartTime: null, lastSyncTime: null });
        } else {
          set({ 
            isRunning,
            timerStartTime: Date.now(),
            lastSyncTime: Date.now(),
          });
        }
      },
      setTimeInSeconds: (timeInSeconds) => {
        const state = get();
        if (state.mode === 'timer') {
          set({ timeInSeconds });
        }
      },
      setSelectedDuration: (selectedDuration) => {
        const state = get();
        if (!state.isRunning && state.mode === 'timer') {
          set({ 
            selectedDuration, 
            timeInSeconds: selectedDuration * 60 
          });
        }
      },
      setChronometerTime: (chronometerTime) => {
        const state = get();
        if (state.mode === 'chronometer') {
          set({ chronometerTime });
        }
      },
      setStartTime: (startTime) => set({ startTime }),
      setIsStarting: (isStarting) => set({ isStarting }),
      setCountdown: (countdown) => set({ countdown }),
      setTimerStartTime: (timerStartTime) => set({ timerStartTime }),
      setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
      resetTimer: () => {
        const state = get();
        set({
          isRunning: false,
          timerStartTime: null,
          timeInSeconds: state.mode === 'timer' ? state.selectedDuration * 60 : 0,
          chronometerTime: 0,
          startTime: null,
          isStarting: false,
          countdown: 0,
          lastSyncTime: null,
        });
      },
      syncTimerState: () => {
        const state = get();
        if (!state.isRunning || !state.timerStartTime) return;

        const now = Date.now();
        const elapsedSinceStart = Math.floor((now - state.timerStartTime) / 1000);
        
        if (state.mode === 'timer') {
          const initialSeconds = state.selectedDuration * 60;
          const remainingSeconds = Math.max(0, initialSeconds - elapsedSinceStart);
          set({ 
            timeInSeconds: remainingSeconds,
            isRunning: remainingSeconds > 0,
          });
        } else {
          set({ 
            chronometerTime: state.chronometerTime + elapsedSinceStart,
          });
        }
      },
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        selectedDuration: state.selectedDuration,
        timeInSeconds: state.timeInSeconds,
        chronometerTime: state.chronometerTime,
      }),
    }
  )
);