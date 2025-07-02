import client from "../baseApi";
import type { UserResponse } from "./model";

export const getUser = async (id: number): Promise<UserResponse> => {
  const response = await client.get<UserResponse>(`/users/${id}`);
  return response.data;
};

export const fetchUsers = async (): Promise<UserResponse[]> => {
  const response = await client.get<UserResponse[]>("/users");
  return response.data;
};