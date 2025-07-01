export enum FileType {
  VIDEO,
  AUDIO,
  IMAGE,
  DOCUMENT,
  OTHER,
}

export const FILE_TYPE_MAP: Record<string, FileType> = {
  mp4: FileType.VIDEO,
  mov: FileType.VIDEO,

  mp3: FileType.AUDIO,
  wav: FileType.AUDIO,

  jpg: FileType.IMAGE,
  jpeg: FileType.IMAGE,
  png: FileType.IMAGE,
  gif: FileType.IMAGE,

  pdf: FileType.DOCUMENT,
  doc: FileType.DOCUMENT,
  docx: FileType.DOCUMENT,
  xls: FileType.DOCUMENT,
  xlsx: FileType.DOCUMENT,
  txt: FileType.DOCUMENT,

  other: FileType.OTHER,
};
export interface FileRequest {
  uploadBatchId: number;
  filename: string;
  fileType: FileType;
}
