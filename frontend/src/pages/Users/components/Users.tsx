import type { UsersPageProps } from "../../../interfaces";
import { UserTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Users = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={UserTable}
    pageCreateLabel="Nuevo usuario"
  />
);
