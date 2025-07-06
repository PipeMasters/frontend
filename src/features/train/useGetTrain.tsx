import { useQuery } from "@tanstack/react-query";
import { getTrain, type TrainResponse } from "../../services/train";


export const useGetTrain = (id: number) =>
  useQuery<TrainResponse>({
    queryKey: ["trains", id],
    queryFn: () => getTrain(id),
  });
