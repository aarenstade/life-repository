import useConfigStore from "../../../state/config";

export const transcribeRecording = async (uri: string): Promise<string | null> => {
  if (!uri) return "";

  const api_url = useConfigStore.getState().api_url;

  if (!api_url) {
    throw new Error("No API URL provided");
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

  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    throw new Error("Failed to transcribe audio");
  }

  const data = await response.json();
  if ("text" in data) {
    return data["text"];
  } else {
    throw new Error("Failed to transcribe audio");
  }
};
