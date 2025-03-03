import { create } from 'zustand';

const useStore = create((set) => ({
  timersData: {},
  removeAllTimers: () => set({ timersData: {} }), 
  updateTimers: (updatedTimer) =>
    set((state) => ({
      timersData: {
        ...state.timersData, 
        [updatedTimer.id]: updatedTimer,
      },
    })),
}));

export default useStore;
