import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile, uploadToPresignedUrl, type FileRequest } from "../../services/file";

export const useUploadFile = (batchId?: number) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (fileData: {
      fileData: FileRequest;
      file: File;
      onProgress?: (progress: number) => void;
    }) => {
      const presignedUrl = await uploadFile(fileData.fileData);
      await uploadToPresignedUrl(
        presignedUrl, 
        fileData.file, 
        fileData.onProgress
      );
      
      return { presignedUrl, fileData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      if (batchId) {
        queryClient.invalidateQueries({
          queryKey: ["batch", batchId],
        });
      }
    },
  });

  return {
    uploadFileAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};