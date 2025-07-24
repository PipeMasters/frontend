import type { FileType } from "../file";
import type { UserResponse } from "../user";

export interface BatchVideo {
  id: number;
  dateDeparted: string;
  dateArrived: string;
  trainNumber: number;
  chiefName: string;
  branchName: string;
}

export interface FileInBatch {
  id: number;
  filename: string;
  fileType: FileType;
  uploadedAt: string;
  source: {
    id: number;
    name: string;
    filename: "string";
    fileType: FileType;
  };
}

export interface AbsenseInBatch {
  id?: number;
  cause: Cause;
  comment: string;
}

export enum Cause {
  DEVICE_FAILURE = "DEVICE_FAILURE",
  REGULATORY_EXEMPT = "REGULATORY_EXEMPT",
  HUMAN_FACTOR = "HUMAN_FACTOR",
  OTHER = "OTHER",
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
};

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
  files: FileInBatch[];
  absence: AbsenseInBatch;
}

export interface BatchRequest {
  uploadedById: number;
  trainDeparted: string;
  trainArrived: string;
  trainId: number;
  comment: string;
  branchId: number;
  absence?: AbsenseInBatch;
}

export interface BatchQueryParams {
  departureDateFrom?: string;
  departureDateTo?: string;
  specificDate?: string;
  arrivalDateFrom?: string;
  arrivalDateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  trainId?: number;
  chiefId?: number;
  uploadedById?: number;
  branchId?: number;
  keywords?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface BatchPageResponse {
  content: BatchVideo[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
