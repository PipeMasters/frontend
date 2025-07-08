  import client from "../baseApi";
  import type { FileRequest } from "./model";

  export const uploadFile = async (fileData: FileRequest): Promise<string> => {
    const response = await client.post("files/upload-url", fileData);
    return response.data;
  };

  export const getFileUrl = async (fileId: number): Promise<string> => {
    const response = await client.get(`files/download-url?mediaFileId=${fileId}`);
    return response.data;
  };

  export const uploadToPresignedUrl = async (
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> => {
    const response = await client.put(url, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        if (onProgress) onProgress(percent);
      },
    });

    return response;
  };
