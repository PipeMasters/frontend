export interface DelegationRequest {
  delegatorId: number;
  substituteId: number;
  fromDate: string; 
  toDate: string;   
}

export interface DelegationResponse {
  delegatorId: number;
  substituteId: number;
  fromDate: string;
  toDate: string;
}