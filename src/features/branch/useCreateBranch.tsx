import { useMutation } from "@tanstack/react-query";
import { createBranch } from "../../services/branch";

export const useCreateBranch = () => {
  return useMutation({
    mutationFn: createBranch,
  });
};
