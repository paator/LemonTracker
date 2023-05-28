import { StateCreator } from "zustand";
import { ModuleSlice } from "./module-slice";

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
  CursorSlice & ModuleSlice,
  [["zustand/devtools", never]],
  [],
  CursorSlice
> = (set) => ({
  posX: 0,
  posY: 0,
  decrementXBy: (amount: number) =>
    set(
      (state) => {
        if (state.posX - amount < 0) {
          return { posX: 0 };
        } else {
          return { posX: state.posX - amount };
        }
      },
      false,
      "decrementXBy"
    ),
  decrementYBy: (amount: number) =>
    set(
      (state) => {
        if (state.posY - amount < 0) {
          return { posY: 0 };
        } else {
          return { posY: state.posY - amount };
        }
      },
      false,
      "decrementYBy"
    ),
  incrementXBy: (amount: number) =>
    set(
      (state) => {
        //32 is the max value we can go to the right
        if (state.posX + amount > 32) {
          return { posX: state.posX };
        } else {
          return { posX: state.posX + amount };
        }
      },
      false,
      "incrementXBy"
    ),
  incrementYBy: (amount: number) =>
    set(
      (state) => {
        if (state.posY + amount > state.currentPattern.length - 1) {
          return { posY: state.posY };
        } else {
          return { posY: state.posY + amount };
        }
      },
      false,
      "incrementYBy"
    ),
  setPosition: (x: number, y: number) =>
    set(
      (state) => {
        if (x > 32) {
          x = state.posX;
        } else if (x < 0) {
          x = 0;
        }

        if (y > state.module.patterns.length - 1) {
          y = state.posY;
        } else if (y < 0) {
          y = 0;
        }
        return { posX: x, posY: y };
      },
      false,
      "setPosition"
    ),
});
