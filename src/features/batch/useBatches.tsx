import { useQuery } from "@tanstack/react-query";
import { getBatches } from "../../services/batch";
import type { BatchPageResponse, BatchQueryParams } from "../../services/batch";

export function useBatches(params: BatchQueryParams) {
  return useQuery<BatchPageResponse>({
    queryKey: ["batch", params],
    queryFn: () => getBatches(params),
    staleTime: 1000 * 30,
  });
}
