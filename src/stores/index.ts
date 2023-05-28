import { create } from "zustand";
import { createCursorSlice, CursorSlice } from "./cursor-slice";
import { devtools } from "zustand/middleware";
import { createPatternSlice, ModuleSlice } from "./module-slice";

type State = CursorSlice & ModuleSlice;

export const useBoundStore = create<State>()(
  devtools((...args) => {
    return {
      ...createCursorSlice(...args),
      ...createPatternSlice(...args),
    };
  })
);
