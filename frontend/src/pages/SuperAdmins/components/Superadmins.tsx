import type { UsersPageProps } from "../../../interfaces";
import { SuperadminTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Superadmins = ({
  name,
  create,
  edit,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={SuperadminTable}
    role="superadmin"
    pageCreateLabel={create ? "Crear" : undefined}
    edit={edit}
    delete={del}
    remove={remove}
  />
);
