import { GenericUserTable } from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
}

export const AthleteTable = ({
  users,
  edit,
  delete: canDelete,
}: UsersTableProps & { edit?: boolean; delete?: boolean }) => {
  return (
    <GenericUserTable
      users={users}
      showRole={false}
      allowRestore={false}
      allowEdit={edit}
      allowDelete={canDelete}
    />
  );
};
