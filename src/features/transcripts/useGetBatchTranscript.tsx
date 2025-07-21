import { useQuery } from "@tanstack/react-query";
import { type TranscriptsBatchResponse, searchBatchTranscripts } from "../../services/transcripts";

export const useGetBatchTranscript = (uploadBatchId: number, query: string) => {
  return useQuery<TranscriptsBatchResponse[]>({
    queryKey: ["transcript-batch", uploadBatchId, query],
    queryFn: () => searchBatchTranscripts(uploadBatchId, query),
    enabled: !!uploadBatchId && !!query && query.length > 0,
  });
};