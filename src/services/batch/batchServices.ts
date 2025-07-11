import client from "../baseApi";
import type { BatchResponse, BatchVideo, BatchRequest, BatchQueryParams, BatchPageResponse } from "./model";

export const getBatchVideos = async (): Promise<BatchVideo[]> => {
  const response = await client.get<BatchVideo[]>("/batch/all");
  return response.data;
};

export const getBatchById = async (id: number): Promise<BatchResponse> => {
  const response = await client.get(`/batch/${id}`);
  return response.data;
};

export const createBatch = async (batchData: BatchRequest): Promise<BatchResponse> => {
  const response = await client.post("/batch", batchData);
  return response.data;
};


export async function getBatches(params: BatchQueryParams): Promise<BatchPageResponse> {
  const response = await client.get<BatchPageResponse>("/batch", { params });
  return response.data;
}