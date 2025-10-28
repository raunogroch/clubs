import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const AssistantForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default AssistantForm;
