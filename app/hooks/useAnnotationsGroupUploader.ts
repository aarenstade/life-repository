import { useState } from "react";
import { useActiveAnnotation } from "../state/annotations";
import { AnnotationGroup, FileAnnotation } from "../types/annotation";
import * as FileSystem from "expo-file-system";
import fetchAPI from "../lib/api";
import useConfigStore from "../state/config";

const useAnnotationsGroupUploader = () => {
  const { group, updateFile } = useActiveAnnotation((store) => ({ group: store.group, updateFile: store.updateFile }));
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessageStream, setStatusMessageStream] = useState<{ type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"; text: string }[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const api_url = useConfigStore((state) => state.api_url);

  const uploadFile = async (file: Partial<FileAnnotation>, apiUrl: string): Promise<{ success: boolean; data?: any; error?: string }> => {
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
      formData.append("file_id", file.file_id);

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

  const writeFileGroups = async (group: AnnotationGroup) => {
    console.log("inserting file groups");
    const response = await fetchAPI(api_url, "annotations/insert/file_groups", group, "POST");
    return response;
  };

  const uploadAndWriteFile = async (file: FileAnnotation) => {
    try {
      updateFile({ ...file, status: "uploading" });
      const result = await uploadFile(file, api_url);
      if (result.success && result.data.path) {
        await writeFileData(file, result.data.path);
        updateFile({ ...file, status: "uploaded" });
      } else {
        updateFile({ ...file, status: "error" });
      }
    } catch (error) {
      updateFile({ ...file, status: "error" });
    }
  };

  const updateFileDescriptionAndTags = async (file: FileAnnotation) => {
    console.log("Updating file description and tags", file);
    const promises = [
      fetchAPI(api_url, "/annotations/update/file_descriptions", file, "POST"),
      fetchAPI(api_url, "/annotations/update/file_tags", file, "POST"),
    ];

    await Promise.all(promises);
  };

  const uploadGroup = async () => {
    setIsUploading(true);
    console.log("STARTING GROUP UPLOAD!");

    const batchSize = 7;
    let { files } = group;

    const filesToUpload = files.filter((file) => file.status != "uploaded");
    const filesToUpdate = files.filter((file) => file.status === "uploaded");

    if (filesToUpload.length == 0 && filesToUpdate.length == 0) {
      setIsSuccess(true);
      return;
    }

    try {
      for (let i = 0; i < filesToUpdate.length; i += batchSize) {
        setStatusMessageStream((prev) => [
          ...prev,
          { type: "INFO", text: `Updating batch ${i / batchSize + 1} of ${Math.ceil(filesToUpdate.length / batchSize)}` },
        ]);
        const batch = filesToUpdate.slice(i, i + batchSize);
        const updatePromises = batch.map((file) => updateFileDescriptionAndTags(file));
        await Promise.all(updatePromises);
      }
    } catch (error) {
      console.error("Error updating files", error);
    }

    await writeGroupData(group);

    try {
      for (let i = 0; i < filesToUpload.length; i += batchSize) {
        setStatusMessageStream((prev) => [
          ...prev,
          { type: "INFO", text: `Uploading batch ${i / batchSize + 1} of ${Math.ceil(filesToUpload.length / batchSize)}` },
        ]);
        const batch = files.slice(i, i + batchSize);
        const uploadPromises = batch.map((file) => uploadAndWriteFile(file));
        await Promise.all(uploadPromises);
      }
      await writeFileGroups(group);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error uploading files", error);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, isSuccess, uploadGroup, uploadFile, uploadAndWriteFile, statusMessageStream };
};

export default useAnnotationsGroupUploader;
