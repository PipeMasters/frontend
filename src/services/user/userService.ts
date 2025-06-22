import client from "../baseApi";
import type { UserResponse } from "./model";

export const getUser = async (id: number) => {
  const response = await client.get<UserResponse>(`/users/${id}`);
  return response.data;
};
