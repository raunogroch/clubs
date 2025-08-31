export interface User {
  _id?: string;
  image: string;
  role: string;
  ci: string;
  name: string;
  lastname: string;
  email: string;
  birth_date: string;
  username: string;
  password?: string;
}

export type UserErrors = {
  [key in keyof User]?: string;
};

export interface UserFormProps {
  initialData?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface UsersPageProps {
  name: string;
  sub?: string;
}
