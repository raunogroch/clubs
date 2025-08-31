export interface User {
  id: string;
  name: string;
  role: "coach" | "athlete" | "parent" | "admin" | "superadmin";
  image: string;
}
