import GenericUserTable from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
  edit?: boolean;
  delete?: boolean;
  remove?: boolean;
}

export const SuperadminTable = ({
  users,
  edit,
  delete: del,
  remove,
}: UsersTableProps) => {
  return (
    <GenericUserTable
      users={users}
      showRole={true}
      allowRestore={true}
      allowEdit={edit}
      allowDelete={del}
      allowRemove={remove}
    />
  );
};

export default SuperadminTable;
