import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "../../services/branch";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBranch,
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};

