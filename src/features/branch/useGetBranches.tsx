import { useQuery } from "@tanstack/react-query";
import { getBranches } from "../../services/branch/branchService";
import type { BranchResponse } from "../../services/branch/model";

export const useGetBranches = () =>
  useQuery<BranchResponse[]>({
    queryKey: ["branches"],
    queryFn: getBranches,
  });
