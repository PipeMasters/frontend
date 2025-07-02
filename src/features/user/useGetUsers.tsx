import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../../services/user/userService";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
