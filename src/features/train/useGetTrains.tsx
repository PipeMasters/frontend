import { useQuery } from "@tanstack/react-query";
import { getTrains, type TrainResponse } from "../../services/train";

export const useGetTrains = () =>
  useQuery<TrainResponse[]>({
    queryKey: ["trains"],
    queryFn: getTrains
  });