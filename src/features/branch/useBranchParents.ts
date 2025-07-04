import { useQuery } from "@tanstack/react-query";
import { getBranchParents } from "../../services/branch";

export const useBranchParents = () => {
  return useQuery({
    queryKey: ["branch", "parents"],
    queryFn: getBranchParents,
  });
};
