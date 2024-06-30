export function formatBytesToHumanReadable(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const base = 1024;
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
  const size = Number.parseFloat((bytes / Math.pow(base, exponent)).toFixed(2));
  const unit = units[exponent];
  return `${size} ${unit}`;
}

export const formatToSnakeCase = (label: string) => {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const ellipsesText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
