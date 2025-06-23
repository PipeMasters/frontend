export interface BranchRequest {
  id: number;
  name: string;
  parent?: {
    id: number;
    name: string;
  }
}