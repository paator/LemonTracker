import { create } from "zustand";
import { createCursorSlice, CursorSlice } from "./cursor-slice";
import { devtools } from "zustand/middleware";
import { createModuleSlice, ModuleSlice } from "./module-slice";
import { createPatternSlice, PatternSlice } from "./pattern-slice"

type State = CursorSlice & ModuleSlice & PatternSlice;

export const useBoundStore = create<State>()(
  devtools((...args) => {
    return {
      ...createCursorSlice(...args),
      ...createModuleSlice(...args),
      ...createPatternSlice(...args),
    };
  })
);
