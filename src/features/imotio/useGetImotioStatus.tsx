import { useQuery } from "@tanstack/react-query";
import { getImotioStatus } from "../../services/imotio";

export const useGetImotioStatus = () =>
  useQuery<boolean>({
    queryKey: ["imotio"],
    queryFn: getImotioStatus,
  });
