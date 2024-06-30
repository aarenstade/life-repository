export interface FieldDifference<T> {
  originalValue: T;
  modifiedValue: T;
  isDifferent: boolean;
}

export interface DeepComparisonState<T> {
  original: T;
  modified: T;
  differences: { [K in keyof T]?: FieldDifference<T[K]> };
  isChanged: () => boolean;
}
