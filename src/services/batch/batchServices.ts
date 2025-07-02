import client from "../baseApi";
import type { BatchVideo} from "./model";

export const getBatchVideos = async (): Promise<BatchVideo[]> => {
  const response = await client.get<BatchVideo[]>("/batch/all");
  return response.data;
};
