import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadTrainSchedulesExcel } from "../../services/train";

export function useUploadTrainSchedules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadTrainSchedulesExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["train-schedules"] });
    },
  });
}