import type { UsersPageProps } from "../../../interfaces";
import { SuperadminTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Superadmins = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={SuperadminTable}
    role="superadmin"
    pageCreateLabel="Nuevo entrenador"
  />
);
