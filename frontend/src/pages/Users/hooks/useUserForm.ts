import { useState } from "react";
import type { User, UserErrors } from "../interfaces/userTypes";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createUser, updateUser } from "../../../store/usersThunks"; // ✅ Added createUser
import { setMessage } from "../../../store";
export const useUserForm = (initialData?: User) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<User>(
    initialData || {
      image: "",
      role: "",
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

  /**
   * Maneja el cambio de los campos del formulario.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };

      // ✅ Si cambia el campo 'ci', actualizar también 'password'
      if (name === "ci") {
        newFormData.password = value; // Hacer que password sea igual a ci
      }

      return newFormData;
    });

    // ✅ Clear error for this field
    if (errors[name as keyof UserErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }

    // ✅ También limpiar error de password si estamos cambiando ci
    if (name === "ci" && errors.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: undefined,
      }));
    }
  };

  /**
   * Valida los datos del formulario antes de enviar.
   */
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
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Envía el formulario para crear o editar usuario.
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (formData._id) {
        await dispatch(updateUser(formData)).unwrap();
        dispatch(
          setMessage({
            message: "Usuario actualizado correctamente",
            type: "success",
          })
        );
      } else {
        await dispatch(createUser(formData)).unwrap();
        dispatch(
          setMessage({
            message: "Usuario creado correctamente",
            type: "success",
          })
        );
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Error de conexión";
      dispatch(setMessage({ message: errorMessage, type: "danger" }));
      return false;
    }
  };

  /**
   * Actualiza manualmente los datos del formulario.
   */
  const updateFormData = (newData: Partial<User>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData: updateFormData, // ✅ Better naming
  };
};
