import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AnnotationFlowType, AnnotationGroup, FileAnnotation, Tag } from "../types/annotation";
import shortid from "shortid";
import { utcNow } from "../utilities/general";

interface AnnotationDraftsState {
  draftGroups: AnnotationGroup[];
  setDraftGroups: (draftGroups: AnnotationGroup[]) => void;
}

export const useAnnotationDrafts = create<AnnotationDraftsState>()(
  persist(
    (set) => ({
      draftGroups: [],
      setDraftGroups: (draftGroups) => set({ draftGroups }),
    }),
    {
      name: "draft-annotation-groups",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface ActiveAnnotationState {
  step: string;
  setStep: (step: string) => void;
  group: AnnotationGroup | null;
  setGroup: (group: AnnotationGroup | null) => void;
  setGroupTags: (tags: Tag[]) => void;
  setFlowType: (flowType: AnnotationFlowType) => void;
  setFiles: (files: FileAnnotation[]) => void;
  updateFile: (file: FileAnnotation) => void;
  removeFile: (fileUri: string) => void;
}

export const useActiveAnnotation = create<ActiveAnnotationState>()(
  persist(
    (set) => ({
      group: null,
      setGroup: (group) => set({ group }),
      setGroupTags: (tags) => set((state) => ({ group: { ...state.group, tags } })),
      setFlowType: (flowType) => set((state) => ({ group: { ...state.group, flow_type: flowType } })),
      setFiles: (files) => set((state) => ({ group: { ...state.group, files } })),
      updateFile: (file) => set((state) => ({ group: { ...state.group, files: state.group.files.map((f) => (f.uri === file.uri ? file : f)) } })),
      removeFile: (fileUri) => set((state) => ({ group: { ...state.group, files: state.group.files.filter((file) => file.uri !== fileUri) } })),
      step: "add-type",
      setStep: (step) => set({ step }),
    }),
    {
      name: "active-annotation",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
