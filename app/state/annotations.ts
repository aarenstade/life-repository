import { create } from "zustand";
import { AnnotationFlowType, AnnotationGroup, BaseAnnotationGroup, FileAnnotation, Tag } from "../types/annotation";
import shortid from "shortid";

interface AnnotationGroupsState {
  draftGroups: BaseAnnotationGroup[];
  setDraftGroups: (draftGroups: BaseAnnotationGroup[]) => void;
}

export const useAnnotationGroups = create<AnnotationGroupsState>((set) => ({
  draftGroups: [],
  setDraftGroups: (draftGroups) => set({ draftGroups }),
}));

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

const defaultGroup: AnnotationGroup = {
  group_id: shortid.generate(),
  title: "",
  description: "",
  tags: [],
  num_files: 0,
  flow_type: "individual-then-group",
  created_at: "",
  updated_at: "",
  files: [],
};

export const useActiveAnnotation = create<ActiveAnnotationState>((set) => ({
  group: defaultGroup,
  setGroup: (group) => set({ group }),
  setGroupTags: (tags) => set((state) => ({ group: { ...state.group, tags } })),
  setFlowType: (flowType) => set((state) => ({ group: { ...state.group, flow_type: flowType } })),
  setFiles: (files) => set((state) => ({ group: { ...state.group, files } })),
  updateFile: (file) => set((state) => ({ group: { ...state.group, files: state.group.files.map((f) => (f.uri === file.uri ? file : f)) } })),
  removeFile: (fileUri) => set((state) => ({ group: { ...state.group, files: state.group.files.filter((file) => file.uri !== fileUri) } })),
  step: "add-type",
  setStep: (step) => set({ step }),
}));
