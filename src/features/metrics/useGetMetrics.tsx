import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "../../services/metrics/metricsService";
import type { MetricsResponse } from "../../services/metrics/model";

export const useMetrics = (period: "week" | "month" | "year" = "week") =>
  useQuery<MetricsResponse>({
    queryKey: ["metrics", period],
    queryFn: () => getMetrics(period),
  });