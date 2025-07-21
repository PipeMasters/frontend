import client from "../baseApi";
import type { TrainResponse, TrainScheduleUploadResponse } from "./model";

export const getTrains = async (): Promise<TrainResponse[]> => {
  const response = await client.get("/train");
  return response.data;
};

export const getTrain = async (id: number): Promise<TrainResponse> => {
  const response = await client.get(`/train/${id}`);
  return response.data;
};

export const createTrain = async (trainData: TrainResponse): Promise<TrainResponse> => {
  const response = await client.post("/train", trainData);
  return response.data;
};

export async function uploadTrainSchedulesExcel(file: File): Promise<TrainScheduleUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await client.post<TrainScheduleUploadResponse>("/train-schedules/upload/excel", 
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}
