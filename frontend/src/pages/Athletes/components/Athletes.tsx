import type { UsersPageProps } from "../../../interfaces";
import { AthleteTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Athletes = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={AthleteTable}
    role="athlete"
    pageCreateLabel="Nuevo usuario"
  />
);
