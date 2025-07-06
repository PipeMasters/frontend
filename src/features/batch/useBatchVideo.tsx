import { useQuery } from "@tanstack/react-query";
import { getBatchVideos } from "../../services/batch";

export const useBatchVideo = () => {
  return useQuery({
    queryKey: ["batch"],
    queryFn: getBatchVideos,
  });
};
