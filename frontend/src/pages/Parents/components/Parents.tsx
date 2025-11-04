import type { UsersPageProps } from "../../../interfaces";
import { UserListGeneric } from "../../../components/UserListGeneric";
import { ParentTable } from "./ParentTable";

export const Parents = ({
  name,
  edit,
  restore,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={ParentTable}
    role="parent"
    edit={edit}
    restore={restore}
    delete={del}
    remove={remove}
  />
);

export default Parents;
