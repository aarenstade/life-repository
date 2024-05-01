export interface GroupFileAnnotation {
  file_uris: string[];
  title: string;
  description: string;
  tags: string[];
}

export interface IndividualFileAnnotation {
  file_uri: string;
  description: string;
  tags: string[];
}
