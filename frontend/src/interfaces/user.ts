export interface User {
  _id: string;
  name: string;
  role: "coach" | "athlete" | "parent" | "admin" | "superadmin";
  image: string;
}
