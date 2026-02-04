import { calculateAge } from "./athleteUtils";

export interface ValidationError {
  field?: string;
  message: string;
}

export const validateAthlete = (form: any): ValidationError | null => {
  if (!form.name || !form.name.trim()) {
    return { field: "name", message: "El nombre es requerido" };
  }
  if (!form.lastname || !form.lastname.trim()) {
    return { field: "lastname", message: "El apellido es requerido" };
  }
  if (!form.ci || !form.ci.trim()) {
    return { field: "ci", message: "El CI es requerido" };
  }
  if (!form.gender) {
    return { field: "gender", message: "El género es requerido" };
  }
  if (!form.birth_date) {
    return {
      field: "birth_date",
      message: "La fecha de nacimiento es requerida",
    };
  }

  const age = calculateAge(form.birth_date);
  if (age < 18) {
    if (!form.parent.name || !form.parent.name.trim()) {
      return {
        field: "parent.name",
        message: "El nombre del tutor es requerido para menores de edad",
      };
    }
    if (!form.parent.lastname || !form.parent.lastname.trim()) {
      return {
        field: "parent.lastname",
        message: "El apellido del tutor es requerido para menores de edad",
      };
    }
    if (!form.parent.ci || !form.parent.ci.trim()) {
      return {
        field: "parent.ci",
        message: "El CI del tutor es requerido para menores de edad",
      };
    }
    if (!form.parent.phone || !form.parent.phone.trim()) {
      return {
        field: "parent.phone",
        message: "El teléfono del tutor es requerido para menores de edad",
      };
    }
  } else {
    if (!form.phone || !form.phone.trim()) {
      return { field: "phone", message: "El teléfono es requerido" };
    }
  }

  return null;
};
