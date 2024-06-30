export const flattenObjectValues = (obj: Record<string, any>): string[] => {
  return Object.values(obj).reduce((acc: string[], value) => {
    if (typeof value === "object" && value !== null) {
      return acc.concat(flattenObjectValues(value));
    } else {
      return acc.concat(String(value));
    }
  }, []);
};
