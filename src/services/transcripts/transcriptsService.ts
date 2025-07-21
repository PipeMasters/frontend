import client from "../baseApi";
import type {
  TranscriptsMediaResponse,
  TranscriptsBatchResponse,
  TranscriptsSearchResponse,
} from "./model";

export const getTranscriptsMedia = async (
  mediaFileId: number
): Promise<TranscriptsMediaResponse[]> => {
  const response = await client.get(`/transcripts/media/${mediaFileId}`);
  return response.data;
};

export const searchBatchTranscripts = async (
  uploadBatchId: number,
  query: string
): Promise<TranscriptsBatchResponse[]> => {
  const response = await client.get(
    `/transcripts/batch/${uploadBatchId}/search`,
    { params: { q: query } }
  );
  return response.data;
};

export const searchTranscripts = async (
  query: string,
  uploadBatchSearch: boolean = true
): Promise<TranscriptsSearchResponse[]> => {
  const response = await client.get("/transcripts/search", {
    params: { q: query, uploadBatchSearch },
  });
  return response.data;
};
