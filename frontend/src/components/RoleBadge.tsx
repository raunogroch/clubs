import { Role } from "../interfaces/roleEnum";

export const RoleBadge = ({ role }: { role: string }) => (
  <span className="btn btn-warning btn-rounded btn-outline mx-1">
    {Role[role as keyof typeof Role] || role}
  </span>
);
