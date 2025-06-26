import { useQuery } from "@tanstack/react-query";
import { fetchBranchParents } from "../../services/branch";

export const useBranchParents = () => {
  return useQuery({
    queryKey: ["branch", "parents"],
    queryFn: fetchBranchParents,
  });
};
