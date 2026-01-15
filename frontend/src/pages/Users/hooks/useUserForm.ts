import { useState } from "react";
import type { User, UserErrors } from "../../../interfaces";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createUser, updateUser } from "../../../store/usersThunks";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import {
  getFieldsForRole,
  doesRoleRequireCredentials,
} from "../../../config/roleFieldsConfig";

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
    const fields = getFieldsForRole(formData.role || "");

    // Validar rol
    if (!formData.role) newErrors.role = "Seleccione un rol";

    // Validar campos dinámicos según el rol
    fields.forEach((field) => {
      const value = (formData as any)[field.name];

      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[
          field.name as keyof UserErrors
        ] = `${field.label} es requerido`;
      }

      // Validación específica para fecha
      if (field.type === "date" && value && !isValidDate(value)) {
        newErrors[field.name as keyof UserErrors] = "Fecha inválida";
      }
    });

    // Validaciones específicas para roles que requieren credenciales
    if (doesRoleRequireCredentials(formData.role || "")) {
      if (!formData.username) {
        newErrors.username = "El nombre de usuario es requerido";
      }

      if (!initialData && !formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (isPasswordModified && (formData.password || "").length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      // Limpiar campos que no corresponden al rol
      const cleanedData = { ...formData };
      const fieldsForRole = getFieldsForRole(formData.role || "");
      const validFieldNames = fieldsForRole.map((f) => f.name);

      // Mantener siempre estos campos base
      const alwaysKeep = ["_id", "role", "active"];

      Object.keys(cleanedData).forEach((key) => {
        if (
          !validFieldNames.includes(key) &&
          !alwaysKeep.includes(key) &&
          key !== "image"
        ) {
          delete cleanedData[key as keyof typeof cleanedData];
        }
      });

      if (formData._id) {
        const updateData: any = { ...cleanedData };

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
          createUser(cleanedData as any)
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
