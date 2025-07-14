export enum RoleEnum {
  USER = "Рабоник",
  BRANCH_ADMIN = "Начальник филиала",
  ADMIN = "Начальник",
}

export interface UserResponse {
  id?: number;
  name: string;
  surname: string;
  patronymic: string;
  roles: RoleEnum[]; 
  branchId: number;
}
