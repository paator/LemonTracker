import { StateCreator } from "zustand";
import Pattern from "../models/pattern";
import Module from "../models/module";

export interface ModuleSlice {
  module: Module;
  currentPattern: Pattern;
  currentPatternIndex: number;
  setPattern: (index: number) => void;
  setModule: (module: Module) => void;
}

export const createPatternSlice: StateCreator<
  ModuleSlice,
  [["zustand/devtools", never]],
  []
> = (set, get) => ({
  module: new Module(),
  currentPattern: new Pattern(),
  currentPatternIndex: 0,
  setPattern(index: number) {
    set(
      {
        currentPattern: get().module.patterns[index],
        currentPatternIndex: index,
      },
      false,
      "setPattern"
    );
  },
  setModule(module: Module) {
    set({ module }, false, "setModule");
  },
});
