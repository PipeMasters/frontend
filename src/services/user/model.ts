export interface UserResponse {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  roles: string[];
  branch: {
    id: number;
    name: string;
    parent: {};
  };
}
