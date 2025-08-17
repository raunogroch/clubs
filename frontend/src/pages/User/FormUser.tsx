import { useState } from "react";
import { userService } from "../../services/userServices";
import { UserPersonalInfo } from "./UserPersonalInfo";
import { UserRoleSelector } from "./UserRoleSelector";
import { CustomMessage } from "../../components/CustomMessage";

interface FormUserProps {
  onSuccess?: () => void;
  initialData?: UserData;
}

export type UserData = {
  roles: string[];
  ci: string;
  name: string;
  lastname: string;
  email: string;
  birth_date: string;
  username: string;
  password: string;
};

export type UserErrors = {
  roles: string;
  ci: string;
  name: string;
  lastname: string;
  email: string;
  birth_date: string;
  username: string;
  password: string;
};

export const FormUser = ({ onSuccess, initialData }: FormUserProps) => {
  const [formData, setFormData] = useState<UserData>(
    initialData || {
      roles: [""],
      ci: "",
      name: "",
      lastname: "",
      email: "",
      birth_date: "",
      username: "",
      password: "",
    }
  );

  const [errors, setErrors] = useState<UserErrors>({
    roles: "",
    ci: "",
    name: "",
    lastname: "",
    email: "",
    birth_date: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState<{ message: string; kind: string }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && !value.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, roles: [role] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await userService.create(formData);

    if (response.code === 201 && onSuccess) {
      onSuccess();
    } else if (response.code === 500) {
      setMessage({
        message: "El usuario ya se encuentra registrado",
        kind: "warning",
      });
    }
  };

  return (
    <>
      {message && (
        <CustomMessage message={message.message} kind={message.kind} />
      )}
      <form onSubmit={handleSubmit}>
        <UserRoleSelector
          selectedRole={formData.roles[0]}
          onRoleChange={handleRoleChange}
        />

        <UserPersonalInfo
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        <div className="form-group row">
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">
              Registrar Usuario
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
