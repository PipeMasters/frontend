import client from "../baseApi";
import type { BatchResponse, BatchVideo, BatchRequest } from "./model";

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
