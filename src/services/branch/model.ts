export interface BranchRequest {
  id: number;
  name: string;
  parent?: BranchParent;
}

export interface BranchParent {
  id: number;
  name: string;
}

export interface BranchResponse {
  id: number;
  name: string;
  parentId: number;
}