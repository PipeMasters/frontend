export type MetricsResponse = {
  uploadsByBranch: Record<string, number>; 
  percentChangeByBranch: Record<string, number>; 
  totalStorage: number; 
  currentPeriodStorage: number; 
  previousPeriodStorage: number; 
  storageChangePercent: number; 
};
