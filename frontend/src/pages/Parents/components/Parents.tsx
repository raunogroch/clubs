import type { UsersPageProps } from "../../../interfaces";
import { UserListGeneric } from "../../../components/UserListGeneric";
import { ParentTable } from ".";

export const Parents = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={ParentTable}
    role="parent"
    pageCreateLabel="Nuevo padre"
  />
);

export default Parents;
