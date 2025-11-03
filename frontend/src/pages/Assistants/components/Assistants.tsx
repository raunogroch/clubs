import { UserListGeneric } from "../../../components/UserListGeneric";
import type { UsersPageProps } from "../../../interfaces";
import AssistantTable from "./AssistantTable";

export const Assistants = ({ name }: UsersPageProps) => (
  <UserListGeneric
    name={name}
    TableComponent={AssistantTable}
    role="assistant"
    pageCreateLabel="Nuevo asistente"
  />
);

export default Assistants;
