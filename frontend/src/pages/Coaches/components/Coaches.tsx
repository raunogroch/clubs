import type { UsersPageProps } from "../../../interfaces";
import { CoachTable } from ".";
import { UserListGeneric } from "../../../components/UserListGeneric";

export const Coaches = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={CoachTable}
    role="coach"
    pageCreateLabel="Nuevo entrenador"
  />
);
