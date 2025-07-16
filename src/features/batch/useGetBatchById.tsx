import { useQuery } from "@tanstack/react-query";
import { getBatchById, type BatchResponse } from "../../services/batch";


export const useGetBatch = (id: number) => {
  return useQuery<BatchResponse>({
    queryKey: ["batch", id],
    queryFn: () => getBatchById(id),
  });
};
