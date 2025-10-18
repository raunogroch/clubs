import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const AdminForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default AdminForm;
