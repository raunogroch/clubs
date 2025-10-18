import GenericUserForm from "../../../components/GenericUserForm";
import type { UserFormProps } from "../../../interfaces";

export const AthleteForm = (props: UserFormProps) => {
  return <GenericUserForm {...props} />;
};

export default AthleteForm;
