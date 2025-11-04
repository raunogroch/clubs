import type { UsersPageProps } from "../../../interfaces";
import { CoachTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Coaches = ({
  name,
  edit,
  restore,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={CoachTable}
    role="coach"
    edit={edit}
    restore={restore}
    delete={del}
    remove={remove}
  />
);
