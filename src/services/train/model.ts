export interface TrainResponse {
  id?: number;
  trainNumber: number;
  routeMessage: string;
  consistCount: number;
  chiefId: number;
  branchId: number;
}

export interface TrainScheduleUploadResponse {
  totalRecords: number;
  successfullyParsed: number;
  recordsWithError: number;
  existingRecordsInDb: number;
  updatedRecords: number;
  errorMessages: string[];
}
