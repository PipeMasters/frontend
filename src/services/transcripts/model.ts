export interface TranscriptsBatchResponse {
  mediafileId: number;
  fragmentsIds: number[];
}

export interface TranscriptsMediaResponse {
  id: number;
  begin: number;
  end: number;
  text: string;
  fragment_id: number;
}

export interface TranscriptsSearchResponse {
  id: number;
  dateDeparted: string;
  dateArrived: string;
  trainNumber: number;
  chiefName: string;
  branchName: string;
  files: TranscriptsBatchResponse[];
}
