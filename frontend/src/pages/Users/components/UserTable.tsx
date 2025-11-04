import { GenericUserTable } from "../../../components/GenericUserTable";

export const UserTable = ({
  users,
  edit,
  restore: res,
  delete: del,
  remove,
}) => {
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
