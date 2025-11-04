import type { UsersPageProps } from "../../../interfaces";
import { UserListGeneric } from "../../../components/UserListGeneric";
import { UserTable } from "./UserTable";

export const Users = ({
  name,
  edit,
  restore,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={UserTable}
    role="users"
    edit={edit}
    restore={restore}
    delete={del}
    remove={remove}
  />
);
