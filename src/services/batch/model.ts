import type { FileType } from "../file";
import type { UserResponse } from "../user";

export interface BatchVideo {
  id: number;
  dateDeparted: string;
  dateArrived: string;
  trainNumber: number;
  chiefName: string;
}

export interface FileInBatch {
  id: number;
  filename: string;
  fileType: FileType;
  uploadedAt: string;
  source: string;
}

export interface AbsenseInBatch {
  id: number;
  cause: Cause;
  comment: "string";
}

export enum Cause {
  DEVICE_FAILURE = "DEVICE_FAILURE",
  REGULATORY_EXEMPT = "REGULATORY_EXEMPT",
  HUMAN_FACTOR = "HUMAN_FACTOR",
  OTHER = "OTHER"
}

export const getCauseLabel = (cause: Cause): string => {
  switch (cause) {
    case Cause.DEVICE_FAILURE:
      return "Сбой устройства";
    case Cause.REGULATORY_EXEMPT:
      return "Освобождение по регламенту";
    case Cause.HUMAN_FACTOR:
      return "Человеческий фактор";
    case Cause.OTHER:
      return "Другое";
    default:
      return "Неизвестно";
  }
}

export interface BatchResponse {
  id: number;
  directory: string;
  uploadedBy: UserResponse;
  chief: UserResponse;
  createdAt: string;
  trainDeparted: string;
  trainArrived: string;
  trainId: number;
  comment: string;
  keywords: string[];
  branchId: number;
  archived: boolean;
  deletedAt: string;
  deleted: boolean;
  file: FileInBatch[];
  absence: AbsenseInBatch;
}

export interface BatchRequest {
  uploadedById: number; 
  trainDeparted: string; 
  trainArrived: string;  
  trainId: number;
  comment: string;
  branchId: number;
  absence?: {
  cause: string;
  comment: string;
  };
}
