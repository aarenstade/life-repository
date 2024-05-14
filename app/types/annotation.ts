export type AnnotationFlowType = "individual-then-group" | "group-then-individual";

export interface BaseAnnotationGroup {
  group_id: string;
  title: string;
  description: string;
  tags: Tag[];
  num_files: number;
  flow_type: AnnotationFlowType;
  created_at: string;
  updated_at: string;
}

export interface AnnotationGroup extends BaseAnnotationGroup {
  files: FileAnnotation[];
}

export interface Tag {
  id?: string;
  tag: string;
}

export interface FileAnnotation {
  uri: string;
  description: string;
  tags: Tag[];
  annotated_at: string;
  added_at: string;
}
