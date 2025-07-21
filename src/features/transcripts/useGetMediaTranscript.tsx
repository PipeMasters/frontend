import { useQueries } from "@tanstack/react-query";
import { getTranscriptsMedia } from "../../services/transcripts";

export const useGetMediaTranscript = (mediaFileIds: number[]) => {
  return useQueries({
    queries: mediaFileIds.map((id) => ({
      queryKey: ["transcript-media", id, "files"],
      queryFn: () => getTranscriptsMedia(id),
      enabled: !!id,
    })),
  });
};