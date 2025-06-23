import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrain } from "../../services/train";

export const useCreateTrain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
  });
};
