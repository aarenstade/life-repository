import { format } from "date-fns";
import moment from "moment";

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

export function utcNow() {
  return moment.utc().format("YYYY-MM-DD HH:mm:ss.SSS");
}
