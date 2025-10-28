import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const AssistantTable = ({ users }: UsersTableProps) => {
  return (
    <GenericUserTable users={users} showRole={false} allowRestore={false} />
  );
};

export default AssistantTable;
