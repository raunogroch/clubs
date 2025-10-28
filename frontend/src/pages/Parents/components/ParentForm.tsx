import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const ParentForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default ParentForm;
