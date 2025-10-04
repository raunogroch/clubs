import { useState } from "react";
import type { User, UserErrors } from "../interfaces/adminTypes";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createUser, updateUser } from "../../../store/usersThunks";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export const useAdminForm = (initialData?: User) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isPasswordModified, setIsPasswordModified] = useState(false);

  const [formData, setFormData] = useState<User>(
    initialData || {
      image: "",
      role: "coach",
      ci: "",
      name: "",
      lastname: "",
      email: "",
      birth_date: "",
      username: "",
      password: "",
    }
  );

  const [errors, setErrors] = useState<UserErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "password") {
      setIsPasswordModified(true);
    }

    if (errors[name as keyof UserErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: UserErrors = {};

    if (!formData.image) newErrors.image = "Carga una imagen";
    if (!formData.role) newErrors.role = "Seleccione un rol";
    if (!formData.ci) newErrors.ci = "La cédula es requerida";
    if (!formData.name) newErrors.name = "El nombre es requerido";
    if (!formData.lastname) newErrors.lastname = "El apellido es requerido";
    if (!formData.birth_date)
      newErrors.birth_date = "La fecha de nacimiento es requerida";

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.username)
      newErrors.username = "El nombre de usuario es requerido";

    if (!initialData && !formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (isPasswordModified && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (formData._id) {
        const updateData = { ...formData };

        if (!isPasswordModified) {
          delete updateData.password;
        }

        await dispatch(updateUser(updateData)).unwrap();
        toastr.success("Usuario actualizado correctamente");
      } else {
        await dispatch(createUser(formData)).unwrap();
        toastr.success("Usuario creado correctamente");
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Error de conexión";
      toastr.error(errorMessage);
      return false;
    }
  };

  const updateFormData = (newData: Partial<User>) => {
    setFormData((prev) => ({ ...prev, ...newData }));

    if (newData.password === initialData?.password) {
      setIsPasswordModified(false);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData: updateFormData,
    isPasswordModified,
  };
};
