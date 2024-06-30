import path from "path-browserify";
import { VIDEO_EXTENSIONS, IMAGE_EXTENSIONS, AUDIO_EXTENSIONS } from "../config/general";

// export const filePath = (path: string) => new URL(`file?path=${encodeURIComponent(path)}`, SERVERS.FILES.url).toString();
export const filePath = (path: string) => `file://${path}`;

export const blobToBase64 = (blob: Blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};

export function generateID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (VIDEO_EXTENSIONS.includes(ext)) {
    return "video";
  } else if (IMAGE_EXTENSIONS.includes(ext)) {
    return "image";
  } else if (AUDIO_EXTENSIONS.includes(ext)) {
    return "audio";
  } else {
    return null;
  }
}

export function closestSubarray(longArray: string[], shortArray: string[]) {
  if (shortArray.length > longArray.length) {
    return 0;
  }

  let bestIndex = -1;
  let bestMatchCount = -1;

  for (let i = 0; i <= longArray.length - shortArray.length; i++) {
    let matchCount = 0;

    for (let j = 0; j < shortArray.length; j++) {
      if (longArray[i + j] === shortArray[j]) {
        matchCount++;
      }
    }

    if (matchCount > bestMatchCount) {
      bestIndex = i;
      bestMatchCount = matchCount;
    }
  }

  return bestIndex;
}

export function generateNumberRange(start: number, end: number) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

export async function hashString(input: string) {
  const msgUint8 = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
