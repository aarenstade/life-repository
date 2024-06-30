import { useEffect, useMemo, useState } from "react";
import { useActiveAnnotation } from "../state/annotations";
import { AnnotationGroup, FileAnnotation } from "../types/annotation";
import * as FileSystem from "expo-file-system";
import fetchAPI from "../lib/api";
import useConfigStore from "../state/config";
import { MAX_UPLOAD_FILE_SIZE_BYTES } from "../config/general";
import _ from "lodash";

const useAnnotationsGroupUploader = () => {
  const { group, updateFile } = useActiveAnnotation((store) => ({ group: store.group, updateFile: store.updateFile }));
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const api_url = useConfigStore((state) => state.api_url);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {
      timeout = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  const uploadStats = useMemo(() => {
    if (!group || !group.files) return { totalFiles: 0, uploadedFiles: 0, pendingFiles: 0 };

    const totalFiles = group.files.length;
    const uploadedFiles = group.files.filter((file) => file.status == "uploaded").length;
    const pendingFiles = totalFiles - uploadedFiles;

    return { totalFiles, uploadedFiles, pendingFiles };
  }, [group]);

  const uploadFile = async (
    file: Partial<FileAnnotation>,
    apiUrl: string
  ): Promise<{ success: boolean; data: Record<string, any>; error?: string }> => {
    try {
      console.log("Starting upload of file", file.file_id);
      const fileUri = file.uri;
      const fileName = fileUri.split("/").pop();
      const fileType = fileName.split(".").pop();

      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        console.log("File does not exist", file.file_id);
        throw new Error("File does not exist");
      }

      const fileSize = fileInfo.size || 0;

      if (fileSize > MAX_UPLOAD_FILE_SIZE_BYTES) {
        console.log("File size exceeds limit of 10MB", file.file_id);
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
      return { success: false, error: error.message, data: null };
    }
  };

  const writeFileData = async (file: FileAnnotation, path: string) => {
    const data = { file, path };
    const response = await fetchAPI(api_url, "annotations/insert/file", data, "POST");

    if (!response.success) {
      throw new Error(response.message || "Failed to write file data");
    }

    return response;
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

  const checkFileExists = async (
    file: FileAnnotation
  ): Promise<{ exists: boolean; exists_path: boolean; exists_db: boolean; path: string; file_id: string }> | null => {
    const response = await fetchAPI(api_url, "paths/file-exists/", { file_id: file.file_id }, "GET");
    return response.code == 200 ? response.data : null;
  };

  const uploadAndWriteFile = async (file: FileAnnotation): Promise<{ status: "success" | "error"; file: FileAnnotation }> => {
    try {
      const fileExists = await checkFileExists(file);
      let filePath = fileExists.path || null;

      if (fileExists && fileExists.exists) {
        return { status: "success", file: { ...file, status: "uploaded" } };
      }

      let uploadResult = { success: true, data: null };
      let writeResult = { success: true };

      if (!fileExists.exists_path) {
        uploadResult = await uploadFile(file, api_url);
        if (uploadResult.success && uploadResult.data) {
          filePath = uploadResult.data?.path || null;
        }
      }

      if (!fileExists.exists_db) {
        writeResult = await writeFileData(file, filePath);
        if (writeResult.success) {
          await updateFileDescriptionAndTags(file);
        }
      }

      console.log({ uploadResult, writeResult });

      if (uploadResult.success && writeResult.success) {
        return { status: "success", file: { ...file, status: "uploaded" } };
      } else {
        return { status: "error", file: { ...file, status: "error" } };
      }
    } catch (error) {
      return { status: "error", file: { ...file, status: "error" } };
    }
  };

  const updateFileDescriptionAndTags = async (file: FileAnnotation): Promise<{ status: "success" | "error"; file: FileAnnotation }> => {
    const [descriptionResponse, tagsResponse] = await Promise.all([
      fetchAPI(api_url, "/annotations/update/file_descriptions", file, "POST"),
      fetchAPI(api_url, "/annotations/update/file_tags", file, "POST"),
    ]);

    if (descriptionResponse.success && tagsResponse.success) {
      return { status: "success", file: { ...file, status: "uploaded" } };
    } else {
      return { status: "error", file: { ...file, status: "error" } };
    }
  };

  const getGroupStatus = async (
    group_id: string,
    files: FileAnnotation[]
  ): Promise<{ file_id: string; exists_db: boolean; exists_path: boolean }[]> => {
    const res = await fetchAPI(api_url, "/annotations/group/status", { group_id, file_ids: files.map((file) => file.file_id) }, "POST");
    return res.data || [];
  };

  const uploadGroup = async (newGroup: AnnotationGroup, config: { filter_uploaded_files: boolean } = { filter_uploaded_files: true }) => {
    await writeGroupData(newGroup);
    console.log("STARTING GROUP UPLOAD!");
    const groupStatus = await getGroupStatus(newGroup.group_id, newGroup.files);
    console.log({ groupStatus });

    const filesToUpdate = groupStatus.filter((file) => file.exists_db && file.exists_path);
    const filesToUpload = groupStatus.filter((file) => !file.exists_db || !file.exists_path);

    console.log(`Number of files to update: ${filesToUpdate.length}`);
    console.log(`Number of files to upload: ${filesToUpload.length}`);

    setIsUploading(true);

    for (let i = 0; i < filesToUpload.length; i += 12) {
      const batch = filesToUpload.slice(i, i + 12).map((file) => file.file_id);
      const batchFiles = newGroup.files.filter((file) => batch.includes(file.file_id));
      batchFiles.forEach((file) => updateFile({ ...file, status: "uploading" }));
      const results = await Promise.all(batchFiles.map(uploadAndWriteFile));
      results.forEach((res) => updateFile(res.file));
    }

    const updateFiles = filesToUpdate.map((file) => newGroup.files.find((f) => f.file_id === file.file_id) as FileAnnotation);
    const results = await Promise.all(updateFiles.map(updateFileDescriptionAndTags));
    results.forEach((res) => updateFile(res.file));

    await writeFileGroups(newGroup);

    setIsSuccess(true);
    setIsUploading(false);

    // const batchSize = 12;
    // let { files } = newGroup;

    // await writeGroupData(newGroup);

    // const uploadFileBatch = async (batch: FileAnnotation[]) => {
    //   const concurrentUploads = batch.map(async (file) => {
    //     try {
    //       const response = await uploadAndWriteFile(file);
    //       if (response.status === "success") {
    //         updateFile({ ...file, status: "uploaded" });
    //       } else {
    //         updateFile({ ...file, status: "error" });
    //       }
    //     } catch {
    //       updateFile({ ...file, status: "error" });
    //     }
    //   });

    //   await Promise.all(concurrentUploads);
    // };

    // try {
    //   for (let i = 0; i < files.length; i += batchSize) {
    //     console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(files.length / batchSize)}`);
    //     const batch = files.slice(i, i + batchSize);
    //     batch.forEach((file) => updateFile({ ...file, status: "uploading" }));
    //     await uploadFileBatch(batch);
    //   }
    //   setIsSuccess(true);
    // } catch (error) {
    //   console.error("Error processing files", error);
    // } finally {
    //   setIsUploading(false);
    // }

    // await writeFileGroups(newGroup);
  };

  return { isUploading, isSuccess, uploadStats, uploadGroup, uploadFile, uploadAndWriteFile, updateFileDescriptionAndTags };
};

export default useAnnotationsGroupUploader;
