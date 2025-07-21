import { useQuery } from "@tanstack/react-query";
import { searchTranscripts } from "../../services/transcripts";

export const useGetTranscript = (
  query: string,
  uploadBatchSearch: boolean = true
) => {
  return useQuery({
    queryKey: ["transcript", query, uploadBatchSearch],
    queryFn: () => searchTranscripts(query, uploadBatchSearch),
    enabled: !!query && query.length > 0,
  });
};
