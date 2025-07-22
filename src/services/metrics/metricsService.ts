import client from "../baseApi";
import type { MetricsResponse } from "./model";

export const getMetrics = async (period: "week" | "month" | "year" = "week"): Promise<MetricsResponse> => {
  const response = await client.get<MetricsResponse>("/metrics", 
    { params: { period }, 
  });
  return response.data;
};