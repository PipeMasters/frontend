import client from "../baseApi";
import type { BranchRequest, BranchParent, BranchResponse } from "./model";

export const createBranch = async (branchData: BranchRequest): Promise<BranchRequest> => {
  const response = await client.post("/branch", branchData);
  return response.data;
};

export const getBranchParents = async (): Promise<BranchParent[]> => {
  const response = await client.get("/branch/parents");
  return response.data;
};

export const getBranches = async (): Promise<BranchResponse[]> => {
  const response = await client.get<BranchResponse[]>("/branch/all");
  return response.data;
};