import client from "../baseApi";

export const getImotioStatus = async (): Promise<boolean> => {
  const response = await client.get("/imotio/status");
  return response.data;
};

export const setImotioStatus = async (newStatus: boolean): Promise<boolean> => {
  const response = await client.post(`/imotio/status/${newStatus}`);
  return response.data;
};