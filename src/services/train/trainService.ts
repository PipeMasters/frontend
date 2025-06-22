import client from "../baseApi";
import type { TrainResponse } from "./model";

export const getTrains = async (): Promise<TrainResponse[]> => {
  const response = await client.get("train");
  return response.data;
};
