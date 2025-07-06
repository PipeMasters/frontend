import client from "../baseApi";
import type { TrainResponse } from "./model";

export const getTrains = async (): Promise<TrainResponse[]> => {
  const response = await client.get("/train");
  return response.data;
};

export const getTrain = async (id: number): Promise<TrainResponse> => {
  const response = await client.get(`/train/${id}`);
  return response.data;
};

export const createTrain = async (trainData: TrainResponse): Promise<TrainResponse> => {
  const response = await client.post("/train", trainData);
  return response.data;
};

