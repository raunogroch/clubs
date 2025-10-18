import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const AdminTable = ({ users }: UsersTableProps) => {
  return (
    <GenericUserTable users={users} showRole={false} allowRestore={true} />
  );
};
