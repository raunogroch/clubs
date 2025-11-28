import { useState } from "react";
import type { User, UserErrors } from "../../../interfaces";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createUser, updateUser } from "../../../store/usersThunks";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

type UserFormModel = Partial<User> & { image?: string };

export const useUserForm = (initialData?: User) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isPasswordModified, setIsPasswordModified] = useState(false);

  const defaultData: UserFormModel = initialData
    ? {
        ...initialData,
        image: (initialData.images as any)?.small || "",
      }
    : {
        image: "",
        role: "",
        ci: "",
        name: "",
        lastname: "",
        birth_date: "",
        active: true,
        username: "",
        password: "",
      };

  const [formData, setFormData] = useState<UserFormModel>(defaultData);

  const [errors, setErrors] = useState<UserErrors>({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target as { name: string; value: any };

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "password") {
      setIsPasswordModified(true);
    }

    if ((errors as any)[name as keyof UserErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: UserErrors = {};

    if (!formData.role) newErrors.role = "Seleccione un rol";
    if (!formData.ci) newErrors.ci = "La cédula es requerida";
    if (!formData.name) newErrors.name = "El nombre es requerido";
    if (!formData.lastname) newErrors.lastname = "El apellido es requerido";
    if (!formData.birth_date)
      newErrors.birth_date = "La fecha de nacimiento es requerida";

    // email field removed
    if (!formData.username)
      newErrors.username = "El nombre de usuario es requerido";

    if (!initialData && !formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (isPasswordModified && (formData.password || "").length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (formData._id) {
        const updateData: any = { ...formData };

        if (!isPasswordModified) {
          delete updateData.password;
        }

        const result: any = await dispatch(
          updateUser(updateData as any)
        ).unwrap();
        if (result && result.imageProcessingSkipped) {
          toastr.warning(
            "Usuario actualizado, pero la imagen no pudo procesarse (servicio de imágenes no disponible)"
          );
        } else {
          toastr.success("Usuario actualizado correctamente");
        }
      } else {
        const result: any = await dispatch(
          createUser(formData as any)
        ).unwrap();
        if (result && result.imageProcessingSkipped) {
          toastr.warning(
            "Usuario creado, pero la imagen no pudo procesarse (servicio de imágenes no disponible)"
          );
        } else {
          toastr.success("Usuario creado correctamente");
        }
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Error de conexión";
      toastr.error(errorMessage);
      return false;
    }
  };

  const updateFormData = (newData: Partial<UserFormModel>) => {
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
