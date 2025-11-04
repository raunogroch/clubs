import type { UsersPageProps } from "../../../interfaces";
import { SuperadminTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Superadmins = ({
  name,
  edit,
  restore,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={SuperadminTable}
    role="superadmin"
    edit={edit}
    restore={restore}
    delete={del}
    remove={remove}
  />
);
