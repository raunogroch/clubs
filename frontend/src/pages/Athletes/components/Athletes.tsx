import type { UsersPageProps } from "../../../interfaces";
import { AthleteTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Athletes = ({ name, edit, delete: canDelete }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={AthleteTable}
    role="athlete"
    edit={edit}
    delete={canDelete}
    restore={false}
    remove={canDelete}
  />
);
