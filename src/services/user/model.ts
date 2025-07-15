export enum RoleEnum {
  USER = "USER",
  BRANCH_ADMIN = "BRANCH_ADMIN",
  ADMIN = "ADMIN",
}

export interface UserResponse {
  id?: number;
  name: string;
  surname: string;
  patronymic: string;
  roles: RoleEnum[]; 
  branchId: number;
}
