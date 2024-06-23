import { useState } from "react";
import { useActiveAnnotation } from "../state/annotations";
import useConfig from "./useConfig";
import { AnnotationGroup, FileAnnotation } from "../types/annotation";
import * as FileSystem from "expo-file-system";
import fetchAPI from "../lib/api";

const useGroupUploader = () => {
  const { group, updateFile } = useActiveAnnotation((store) => ({ group: store.group, updateFile: store.updateFile }));
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessageStream, setStatusMessageStream] = useState<{ type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"; text: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const { api_url } = useConfig();

  const uploadFile = async (file: FileAnnotation, apiUrl: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const fileUri = file.uri;
      const fileName = fileUri.split("/").pop();
      const fileType = fileName.split(".").pop();

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      const fileSize = fileInfo.size || 0;
      if (fileSize > 10000000) {
        throw new Error("File size exceeds limit of 10MB");
      }

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: `image/${fileType}`,
      } as any);

      formData.append("metadata", JSON.stringify(file.metadata));

      const endpoint = `${apiUrl.trim()}/paths/upload-file/`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || "File upload failed");
      }

      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const writeFileData = async (file: FileAnnotation, path: string) => {
    const data = { file, path };
    const response = await fetchAPI(api_url, "annotations/insert/file", data, "POST");

    if (!response.success) {
      throw new Error(response.message || "Failed to write file data");
    }

    return response.data;
  };

  const writeGroupData = async (group: AnnotationGroup) => {
    const response = await fetchAPI(api_url, "annotations/insert/group", group, "POST");

    if (!response.success) {
      throw new Error(response.message || "Failed to write group data");
    }

    return response.data;
  };

  const handleFile = async (file: FileAnnotation) => {
    try {
      updateFile({ ...file, status: "uploading" });
      setStatusMessageStream((prev) => [...prev, { type: "INFO", text: `Uploading file ${file.uri}` }]);
      const result = await uploadFile(file, api_url);
      if (result.success && result.data.path) {
        await writeFileData(file, result.data.path);
        updateFile({ ...file, status: "uploaded" });
        setStatusMessageStream((prev) => [...prev, { type: "SUCCESS", text: `File ${file.uri} uploaded` }]);
      } else {
        updateFile({ ...file, status: "error" });
        setStatusMessageStream((prev) => [...prev, { type: "ERROR", text: `File ${file.uri} upload failed: ${result.error}` }]);
      }
    } catch (error) {
      updateFile({ ...file, status: "error" });
      setStatusMessageStream((prev) => [...prev, { type: "ERROR", text: `File ${file.uri} upload failed: ${error.message}` }]);
    }
  };

  const uploadGroup = async () => {
    setIsUploading(true);

    const batchSize = 10;
    let { files } = group;

    setStatusMessageStream([]);

    const filesToUpload = files.filter((file) => file.status != "uploaded");
    if (filesToUpload.length == 0) {
      setIsSuccess(true);
      return;
    }

    setStatusMessageStream((prev) => [...prev, { type: "INFO", text: `Group contains ${files.length} files` }]);
    setStatusMessageStream((prev) => [...prev, { type: "INFO", text: `Uploading ${filesToUpload.length} files` }]);

    try {
      for (let i = 0; i < filesToUpload.length; i += batchSize) {
        setStatusMessageStream((prev) => [
          ...prev,
          { type: "INFO", text: `Uploading batch ${i / batchSize + 1} of ${Math.ceil(filesToUpload.length / batchSize)}` },
        ]);
        const batch = files.slice(i, i + batchSize);
        const uploadPromises = batch.map((file) => handleFile(file));
        await Promise.all(uploadPromises);
      }
      setStatusMessageStream((prev) => [...prev, { type: "SUCCESS", text: "All files uploaded successfully" }]);
      await writeGroupData(group);
      setIsSuccess(true);
    } catch (error) {
      setStatusMessageStream((prev) => [...prev, { type: "ERROR", text: `Error uploading files: ${error.message}` }]);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, isSuccess, uploadGroup, statusMessageStream };
};

export default useGroupUploader;
