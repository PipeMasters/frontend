import client from "../baseApi";
import type { BranchRequest, BranchParent } from "./model";

export const createBranch = async (branchData: BranchRequest): Promise<BranchRequest> => {
  const response = await client.post("/branch", branchData);
  return response.data;
};

export const fetchBranchParents = async (): Promise<BranchParent[]> => {
  const response = await client.get("/branch/parents");
  return response.data;
};