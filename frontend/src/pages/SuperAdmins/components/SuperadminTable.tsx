import { GenericUserTable } from "../../../components/GenericUserTable";
import type { User } from "../../../interfaces";

interface UsersTableProps {
  users: User[];
  edit?: boolean;
  restore?: boolean;
  delete?: boolean;
  remove?: boolean;
}

export const SuperadminTable = ({
  users,
  edit,
  restore: res,
  delete: del,
  remove,
}: UsersTableProps) => {
  return (
    <GenericUserTable
      users={users}
      showRole={false}
      allowRestore={res}
      allowEdit={edit}
      allowDelete={del}
      allowRemove={remove}
    />
  );
};
