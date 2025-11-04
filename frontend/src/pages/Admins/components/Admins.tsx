import type { UsersPageProps } from "../../../interfaces";
import { UserListGeneric } from "../../../components/UserListGeneric";
import { AdminTable } from ".";

export const Admins = ({
  name,
  edit,
  restore,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={AdminTable}
    role="admin"
    edit={edit}
    restore={restore}
    delete={del}
    remove={remove}
  />
);
