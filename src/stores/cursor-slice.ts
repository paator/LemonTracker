import { StateCreator } from "zustand";

export interface CursorSlice {
  posX: number;
  posY: number;
  decrementXBy: (amount: number) => void;
  decrementYBy: (amount: number) => void;
  incrementXBy: (amount: number) => void;
  incrementYBy: (amount: number) => void;
  setPosition: (x: number, y: number) => void;
}

export const createCursorSlice: StateCreator<
  CursorSlice,
  [["zustand/devtools", never]],
  []
> = (set) => ({
  posX: 0,
  posY: 0,
  decrementXBy: (amount: number) =>
    set((state) => ({ posX: state.posX - amount })),
  decrementYBy: (amount: number) =>
    set((state) => ({ posY: state.posY - amount })),
  incrementXBy: (amount: number) =>
    set((state) => ({ posX: state.posX + amount })),
  incrementYBy: (amount: number) =>
    set((state) => ({ posY: state.posY + amount })),
  setPosition: (x: number, y: number) => set({ posX: x, posY: y }),
});
