export enum FileType {
  VIDEO,
  AUDIO,
  IMAGE,
  DOCUMENT,
  OTHER,
}

export interface FileRequest {
  uploadBatchId: number;
  filename: string;
  fileType: FileType;
}
