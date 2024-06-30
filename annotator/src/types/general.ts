export interface SettingOption {
  icon: JSX.Element;
  label: string;
  value: string;
  method?: () => void;
}

export interface Selectable<T> {
  selected: boolean;
  message?: string;
  data: T;
}
