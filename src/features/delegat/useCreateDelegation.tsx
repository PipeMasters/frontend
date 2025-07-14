import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDelegation } from "../../services/delegat";

export const useCreateDelegation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDelegation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delegate"] });
    },
  });
};