import { StateCreator } from "zustand";
import Pattern from "../models/pattern";
import Module from "../models/module";

type ModuleActions = 'setModule' | 'setTitle' | 'setAuthor' | 'setInitSpeed' | 'setPatterns' | 'setSamples' | 'setOrnaments';

export interface ModuleSlice {
  title: string;
  author: string;
  initSpeed: number;
  patterns: Pattern[];
  samples: any[];
  ornaments: any[];

  setTitle: (newTitle: string) => void;
  setAuthor: (newAuthor: string) => void;
  setInitSpeed: (newSpeed: number) => void;
  setPatterns: (newPatterns: Pattern[]) => void;
  setSamples: (newSamples: any[]) => void;
  setOrnaments: (newOrnaments: any[]) => void;

  setModule: (moduleOrUpdater: Module | ((currentModule: Module) => Module)) => void;
}


export const createModuleSlice: StateCreator<
  ModuleSlice,
  [["zustand/devtools", never]],
  []
> = (set, get) => ({
  title: '',
  author: '',
  initSpeed: 3,
  patterns: [new Pattern(undefined, undefined, new Array(64))],
  samples: [],
  ornaments: [],

  setTitle: (newTitle: string) => set({ title: newTitle }),
  setAuthor: (newAuthor: string) => set({ author: newAuthor }),
  setInitSpeed: (newSpeed: number) => set({ initSpeed: newSpeed }),
  setPatterns: (newPatterns: Pattern[]) => set({ patterns: newPatterns }),
  setSamples: (newSamples: any[]) => set({ samples: newSamples }),
  setOrnaments: (newOrnaments: any[]) => set({ ornaments: newOrnaments }),

  setModule(moduleOrUpdater: Module | ((currentState: Omit<ModuleSlice, ModuleActions>) => Partial<ModuleSlice>)) {
    if (typeof moduleOrUpdater === "function") {
      const partialUpdate = moduleOrUpdater({
        title: get().title,
        author: get().author,
        initSpeed: get().initSpeed,
        patterns: get().patterns,
        samples: get().samples,
        ornaments: get().ornaments,
      });

      set(partialUpdate);
    } else {
      const { title, author, initSpeed, patterns, samples, ornaments } = moduleOrUpdater;
      set({
        title,
        author,
        initSpeed,
        patterns,
        samples,
        ornaments,
      });
    }
  },
});
