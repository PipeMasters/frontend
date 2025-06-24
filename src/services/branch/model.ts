export interface BranchRequest {
  id: number;
  name: string;
  parent?: BranchParent;
}

export interface BranchParent {
  id: number;
  name: string;
}

