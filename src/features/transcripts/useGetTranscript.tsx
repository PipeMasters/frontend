import { useQuery } from "@tanstack/react-query";
import { searchTranscripts } from "../../services/transcripts";

export const useGetTranscript = (
  query: string,
  uploadBatchSearch: boolean = true
) => {
  return useQuery({
    queryKey: ["transcript-global", query, uploadBatchSearch],
    queryFn: () => searchTranscripts(query, uploadBatchSearch),
    enabled: false,
  });
};
