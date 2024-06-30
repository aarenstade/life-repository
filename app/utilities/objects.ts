import _ from "lodash";

export interface ChangeDetail<T> {
  oldValue: T;
  newValue: T;
}

export interface ArrayChangeDetail<T> extends ChangeDetail<T> {
  index: number;
}

export type Changes<T> = {
  [K in keyof T]?: T[K] extends Array<infer U> ? ArrayChangeDetail<U>[] : T[K] extends object ? Changes<T[K]> : ChangeDetail<T[K]>;
};

export const deepIdentifyChanges = <T extends object>(oldData: T, newData: T): Changes<T> => {
  const changes: Changes<T> = {};
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)] as Array<keyof T>);

  allKeys.forEach((key) => {
    const oldValue = oldData[key];
    const newValue = newData[key];

    if (_.isArray(oldValue) && _.isArray(newValue)) {
      const arrayChanges: ArrayChangeDetail<any>[] = [];
      const maxLength = Math.max(oldValue.length, newValue.length);

      for (let i = 0; i < maxLength; i++) {
        if (!_.isEqual(oldValue[i], newValue[i])) {
          arrayChanges.push({ index: i, oldValue: oldValue[i], newValue: newValue[i] });
        }
      }

      if (arrayChanges.length > 0) {
        changes[key] = arrayChanges as any;
      }
    } else if (_.isObject(oldValue) && _.isObject(newValue) && !_.isArray(oldValue) && !_.isArray(newValue)) {
      const nestedChanges = deepIdentifyChanges(oldValue, newValue);
      if (!_.isEmpty(nestedChanges)) {
        changes[key] = nestedChanges as any;
      }
    } else if (!_.isEqual(oldValue, newValue)) {
      changes[key] = { oldValue, newValue } as any;
    }
  });

  return changes;
};

export const changePlaceholderValue = <T>(object: T | T[], placeholderValue: string, newValue: any): T | T[] => {
  const replaceValue = (item: any): any => {
    if (Array.isArray(item)) {
      return item.map(replaceValue);
    } else if (typeof item === "object" && item !== null) {
      return Object.keys(item).reduce((acc, key) => {
        acc[key] = replaceValue(item[key]);
        return acc;
      }, {} as any);
    } else if (item === placeholderValue) {
      return newValue;
    } else {
      return item;
    }
  };

  return replaceValue(object);
};

export const recursivelyProcess = (input: any, processFunction: (value: any) => any): any => {
  try {
    if (Array.isArray(input)) {
      return input.map((item) => recursivelyProcess(item, processFunction));
    } else if (typeof input === "object" && input !== null) {
      return Object.keys(input).reduce((acc, key) => {
        acc[key] = recursivelyProcess(input[key], processFunction);
        return acc;
      }, {} as any);
    } else {
      return processFunction(input);
    }
  } catch {
    return input;
  }
};
