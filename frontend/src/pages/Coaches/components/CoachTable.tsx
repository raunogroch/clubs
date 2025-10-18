import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const CoachTable = ({ users }: UsersTableProps) => {
  return (
    <GenericUserTable users={users} showRole={false} allowRestore={true} />
  );
};
