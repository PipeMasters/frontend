import client from "../baseApi";
import type {DelegationRequest } from "./model";


export const createDelegation = async (delegateData: DelegationRequest): Promise<DelegationRequest> => {
  const response = await client.post<DelegationRequest>("/delegation/delegate", delegateData);
  return response.data;
}
