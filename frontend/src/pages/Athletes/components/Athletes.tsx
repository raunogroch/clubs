import type { UsersPageProps } from "../../../interfaces";
import { AthleteTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Athletes = ({
  name,
  edit,
  delete: canDelete,
  create,
}: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={AthleteTable}
    role="athlete"
    pageCreateLabel={create ? "Nuevo atleta" : undefined}
    edit={edit}
    delete={canDelete}
  />
);
