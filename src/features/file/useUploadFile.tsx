import { useMutation } from "@tanstack/react-query";
import {
  uploadFile, 
  uploadToPresignedUrl,
} from "../../services/file";

export const useUploadFile = () => {
  const mutation = useMutation({
    mutationFn: uploadFile,
  });

  return {
    getPresignedUrlAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    uploadToPresignedUrl,
  };
};
