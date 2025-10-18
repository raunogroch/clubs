import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const CoachForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default CoachForm;
