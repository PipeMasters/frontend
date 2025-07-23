import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setImotioStatus } from "../../services/imotio";

export const useSetImotioStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setImotioStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imotio"] });
    },
  });
};
