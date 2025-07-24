import { useQuery } from "@tanstack/react-query";
import { getChiefs } from "../../services/train";
import type { UserResponse } from "../../services/user";

export const useGetChiefs = () =>
  useQuery<UserResponse[]>({
    queryKey: ["chiefs"],
    queryFn: getChiefs,
  });