import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile, uploadToPresignedUrl } from "../../services/file";

export const useUploadFile = (batchId?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      // queryClient.invalidateQueries({
      //   queryKey: ["batch", batchId],
      // });
    },
  });

  return {
    getPresignedUrlAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    uploadToPresignedUrl,
  };
};
