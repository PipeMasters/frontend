import client from "../baseApi";
import type { Tag } from "./model";

export const getAllTags = async (): Promise<Tag[]> => {
  const response = await client.get<Tag[]>("/tag/all");
  return response.data;
};