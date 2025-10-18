import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const UserTable = ({ users }: UsersTableProps) => {
  return (
    <GenericUserTable users={users} showRole={true} allowRestore={false} />
  );
};
