import { format, formatDistanceToNowStrict } from "date-fns";
import { DATETIME_FORMAT } from "../config/general";
import uuid from "react-native-uuid";

export const utcNow = (): string => {
  const now = new Date();
  const utcDate = new Date(now.toUTCString().substring(0, 25));
  return format(utcDate, DATETIME_FORMAT);
};

export const generate_id = (): string => {
  return uuid.v4().toString();
};

export const formatTimestampDistanceToNow = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } else {
      throw new Error("Invalid date");
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Date not available";
  }
};

export const formatDatetime = (datetime: string): string => {
  try {
    const parsedDate = new Date(datetime);
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid datetime:", datetime);
      return "";
    }
    const year = parsedDate.getFullYear().toString().padStart(4, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const hours = parsedDate.getHours().toString().padStart(2, "0");
    const minutes = parsedDate.getMinutes().toString().padStart(2, "0");
    const seconds = parsedDate.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "";
  }
};
