import { UserListGeneric } from "../../../components/UserListGeneric";
import type { UsersPageProps } from "../../../interfaces";
import { AssistantTable } from "./AssistantTable";

export const Assistants = ({
  name,
  edit,
  restore,
  delete: del, // Renamed to avoid reserved keyword conflict
  remove,
}: UsersPageProps & { remove?: boolean }) => (
  <UserListGeneric
    name={name}
    TableComponent={AssistantTable}
    role="assistant"
    edit={edit}
    restore={restore}
    delete={del}
    remove={remove}
  />
);

export default Assistants;
