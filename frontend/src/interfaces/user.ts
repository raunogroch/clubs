export interface User {
  _id?: string;
  images?: {
    small: string;
    medium: string;
    large: string;
  };
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
  onSuccess?: (role?: string) => void; // Updated to accept a role parameter
  onCancel?: () => void;
}

export interface UsersPageProps {
  name: string;
  sub?: string;
  // optional flags used by list pages to enable actions/UI
  edit?: boolean;
  restore?: boolean;
  remove?: boolean;
  delete?: boolean;
}
