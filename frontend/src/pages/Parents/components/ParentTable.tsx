import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
  edit?: boolean;
  delete?: boolean;
}

export const ParentTable = ({
  users,
  edit,
  delete: canDelete,
}: UsersTableProps) => {
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

export default ParentTable;
