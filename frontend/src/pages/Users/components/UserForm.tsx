import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const UserForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default UserForm;
