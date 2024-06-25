export type AnnotationFlowType = "individual-then-group" | "group-then-individual";

export interface BaseAnnotationGroup {
  group_id: string;
  title: string;
  description: string;
  tags: Tag[];
  flow_type: AnnotationFlowType;
  cover_image_file_id?: string;
  date_description?: string;
  created_at: string;
  updated_at: string;
}

export interface AnnotationGroup extends BaseAnnotationGroup {
  files: FileAnnotation[];
}

export interface Tag {
  id?: string;
  tag: string;
  featured?: boolean;
}

export interface FileAnnotation {
  file_id: string;
  uri: string;
  description: string;
  tags: Tag[];
  annotated_at: string;
  added_at: string;
  status?: "idle" | "error" | "uploading" | "uploaded";
  date_description?: string;
  uploaded_at?: string;
  metadata?: any;
}
