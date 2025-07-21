import { useQuery } from "@tanstack/react-query";
import { type TranscriptsMediaResponse, getTranscriptsMedia } from "../../services/transcripts";

export const useGetMediaTranscript = (mediaFileId: number) => {
  return useQuery<TranscriptsMediaResponse[]>({
    queryKey: ["transcript-media", mediaFileId],
    queryFn: () => getTranscriptsMedia(mediaFileId),
    enabled: !!mediaFileId,
  });
};