  export interface TrainResponse {
    trainId: Key | null | undefined;
    id?: number;
    trainNumber: number;
    routeMessage: string;
    consistCount: number;
    chiefId: number;
    branchId: number;
  }
