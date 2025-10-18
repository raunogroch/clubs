import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const AthleteTable = ({ users }: UsersTableProps) => {
  return (
    <GenericUserTable users={users} showRole={true} allowRestore={false} />
  );
};
