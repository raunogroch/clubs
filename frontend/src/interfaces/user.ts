export interface User {
  _id?: string;
  image?: string;
  role?:
    | "coach"
    | "athlete"
    | "parent"
    | "assistant"
    | "admin"
    | "superadmin"
    | string;
  ci?: string;
  name?: string;
  lastname?: string;
  birth_date?: string;
  username?: string;
  password?: string;
  active?: boolean;
  phone?: string;
  bio?: string;
  sport?: string;
  club?: string;
  groups?: any[];
  coaches?: any[];
  athletes?: any[];
}

export type UserErrors = {
  [key in keyof User]?: string;
};

export interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface UsersPageProps {
  name: string;
  sub?: string;
}
