import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const SuperadminForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default SuperadminForm;
