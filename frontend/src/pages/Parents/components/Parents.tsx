import type { UsersPageProps } from "../../../interfaces";
import { UserListGeneric } from "../../../components/UserListGeneric";
import { ParentTable } from ".";

export const Parents = ({ name, edit, delete: canDelete, create }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={ParentTable}
    role="parent"
    pageCreateLabel={create ? "Nuevo padre" : undefined}
    // pass action flags so the table can enable/disable edit/delete links
    edit={edit}
    delete={canDelete}
  />
);

export default Parents;
