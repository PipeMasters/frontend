import { useQueries } from "@tanstack/react-query";
import { getFileUrl } from "../../services/file";

export const useGetFileUrls = (fileIds: number[]) => {
  return useQueries({
    queries: fileIds.map((id) => ({
      queryKey: ["files", id],
      queryFn: () => getFileUrl(id),
      enabled: !!id,
      staleTime: 570 * 1000,
      refetchInterval: 570 * 1000,
      refetchIntervalInBackground: true,
    })),
  });
};
