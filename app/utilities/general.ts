import { format } from "date-fns";
import { DATETIME_FORMAT } from "../config/general";

export const utcNow = (): string => {
  const now = new Date();
  const utcDate = new Date(now.toUTCString().substring(0, 25));
  return format(utcDate, DATETIME_FORMAT);
};
