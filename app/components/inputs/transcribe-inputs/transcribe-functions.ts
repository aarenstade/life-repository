import useConfigStore from "../../../state/config";

import { IErrorResponse } from "../../../types/error";

export const transcribeRecording = async (uri: string): Promise<string | IErrorResponse> => {
  if (!uri) return { status: "error", message: "No URI provided" };

  const api_url = useConfigStore.getState().api_url;

  if (!api_url) {
    return { status: "error", message: "No API URL provided" };
  }

  let apiUrl = new URL("transcribe/audio", api_url);
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  // @ts-ignore
  formData.append("file", {
    uri,
    name: `recording_${Date.now()}.${fileType}`,
    type: `audio/x-${fileType}`,
  });

  let options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await fetch(apiUrl.toString(), options);

    if (!response.ok) {
      return { status: "error", message: "Failed to transcribe audio" };
    }

    const data = await response.json();
    if ("text" in data) {
      return data["text"];
    } else {
      return { status: "error", message: "Failed to transcribe audio" };
    }
  } catch (error) {
    return { status: "error", message: "An error occurred during transcription" };
  }
};
