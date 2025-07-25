import { useQuery } from "@tanstack/react-query";
import { getAllTags } from "../../services/tag";

export const useGetTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
    staleTime: 1000 * 60 * 5, 
  });
};