import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/user/userService";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUsers,
  });
};
