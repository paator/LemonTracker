import { StateCreator } from "zustand";
import Pattern from "../models/pattern";
import { ModuleSlice } from "./module-slice";

export interface PatternSlice {
  currentPattern: Pattern;
  currentPatternIndex: number;
  setPattern: (index: number) => void;
}

export const createPatternSlice: StateCreator<
  PatternSlice & ModuleSlice,
  [["zustand/devtools", never]],
  [],
  PatternSlice
> = (set, get) => ({
  currentPattern: new Pattern(),
  currentPatternIndex: 0,
  setPattern(index: number) {
    const state = get(); // Access the entire state
    set(
      {
        currentPattern: state.patterns[index],
        currentPatternIndex: index,
      },
      false,
      "setPattern"
    );
  },
});
