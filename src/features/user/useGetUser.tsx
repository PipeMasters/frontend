import { useQuery } from "@tanstack/react-query";
import { getUser, type UserResponse } from "../../services/user";

export const useGetUser = (id: number) =>
  useQuery<UserResponse>({
    queryKey: ["user", id],
    queryFn: () => getUser(id)
  });