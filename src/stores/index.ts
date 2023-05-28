import { create } from "zustand";
import { createCursorSlice, CursorSlice } from "./cursor-slice";
import { devtools } from "zustand/middleware";

type State = CursorSlice;

export const useStore = create<State>()(
  devtools((...args) => {
    return {
      ...createCursorSlice(...args),
    };
  })
);
