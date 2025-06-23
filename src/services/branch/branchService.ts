import client from "../baseApi";
import type { BranchRequest } from "./model";

export const createBranch = async (branchData: BranchRequest): Promise<BranchRequest> => {
  const response = await client.post("/branch", branchData);
  return response.data;
};
