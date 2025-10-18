import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const SuperadminTable = ({ users }: UsersTableProps) => {
  return <GenericUserTable users={users} showRole={true} allowRestore={true} />;
};

export default SuperadminTable;
