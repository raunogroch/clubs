import type { UsersPageProps } from "../interfaces";
import { UserListGeneric } from "../../../components/UserListGeneric";
import { AdminTable } from ".";

export const Admins = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={AdminTable}
    role="admin"
    pageCreateLabel="Nuevo administrador"
  />
);
