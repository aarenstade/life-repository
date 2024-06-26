import { AnnotationFlowType } from "../types/annotation";
import { generate_id, utcNow } from "../utilities/general";

export const createDefaultGroup = (flowType: AnnotationFlowType) => {
  return {
    group_id: generate_id(),
    title: "",
    description: "",
    files: [],
    tags: [],
    created_at: utcNow(),
    updated_at: utcNow(),
    flow_type: flowType,
  };
};
