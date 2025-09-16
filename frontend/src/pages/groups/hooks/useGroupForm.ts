import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage, type AppDispatch } from "../../../store";
import type { Group, GroupErrors } from "../interface/group.Interface";
import type { User } from "../../../interfaces";
import { useParams } from "react-router-dom";
import { createGroup, updateGroup } from "../../../store/groupsThunks";
import { fetchEntities } from "../../../store/entitiesThunks";

export const initialGroupData: Group = {
  name: "",
  dailySchedules: [],
  place: "",
  coaches: [],
  athletes: [],
  active: true,
};

export const useGroupForm = (initialData?: Group) => {
  const { clubId } = useParams<{ clubId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { coaches, athletes } = useSelector((state: any) => state.entities);

  const [formData, setFormData] = useState<Group>(
    initialData ?? initialGroupData
  );

  useEffect(() => {
    dispatch(fetchEntities()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        coaches: (initialData.coaches ?? []).map((c: any) =>
          typeof c === "object"
            ? c
            : coaches.find((u: any) => String(u._id ?? u.id) === String(c)) || c
        ),
        athletes: (initialData.athletes ?? []).map((a: any) =>
          typeof a === "object"
            ? a
            : athletes.find((u: any) => String(u._id ?? u.id) === String(a)) ||
              a
        ),
      });
    }
  }, [initialData, coaches, athletes]);

  const [errors, setErrors] = useState<GroupErrors>({});

  const addSchedule = () => {
    if (formData.dailySchedules.length >= 7) return;
    setFormData((prev) => ({
      ...prev,
      dailySchedules: [
        ...prev.dailySchedules,
        { day: "", turn: "", startTime: "", endTime: "", active: true },
      ],
    }));
  };

  const removeSchedule = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      dailySchedules: prev.dailySchedules.filter((_, i) => i !== idx),
    }));
  };

  const handleScheduleChange = (idx: number, field: string, value: any) => {
    setFormData((prev) => {
      const newSchedules = prev.dailySchedules.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      );
      return { ...prev, dailySchedules: newSchedules };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === "checkbox" && (name === "coaches" || name === "athletes")) {
      const sourceList: User[] =
        name === "coaches" ? coaches ?? [] : athletes ?? [];
      let updatedArr = Array.isArray(formData[name as keyof Group])
        ? [...(formData as any)[name]]
        : [];
      const userObj = sourceList.find(
        (u: any) => String(u._id ?? u.id) === String(value)
      );
      if (checked) {
        if (
          userObj &&
          !updatedArr.some((u: any) => String(u._id ?? u.id) === String(value))
        ) {
          updatedArr.push(userObj);
        }
      } else {
        updatedArr = updatedArr.filter(
          (u: any) => String(u._id ?? u.id) !== String(value)
        );
      }
      setFormData((prev) => ({ ...prev, [name]: updatedArr }));
      if (errors[name as keyof GroupErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof GroupErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  function validateForm(): boolean {
    const newErrors: GroupErrors = {};
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "El nombre del grupo es requerido";
    }
    if (!formData.dailySchedules || formData.dailySchedules.length === 0) {
      newErrors.dailySchedules = "Debe agregar al menos un horario";
    } else {
      const daysSet = new Set<string>();
      formData.dailySchedules.forEach((ds, idx) => {
        if (!ds.day) {
          newErrors[`dailySchedules_${idx}_day`] = `El día es requerido`;
        } else if (daysSet.has(String(ds.day))) {
          newErrors[
            `dailySchedules_${idx}_day`
          ] = `El día ya está asignado en otro horario`;
        } else {
          daysSet.add(String(ds.day));
        }
        if (!ds.turn) {
          newErrors[`dailySchedules_${idx}_turn`] = `El turno es requerido`;
        }
        if (!ds.startTime) {
          newErrors[
            `dailySchedules_${idx}_startTime`
          ] = `La hora de inicio es requerida`;
        }
        if (!ds.endTime) {
          newErrors[
            `dailySchedules_${idx}_endTime`
          ] = `La hora de fin es requerida`;
        }
      });
    }
    if (!formData.place || formData.place.trim() === "") {
      newErrors.place = "El lugar es requerido";
    }
    if (!formData.coaches || formData.coaches.length === 0) {
      newErrors.coaches = "Debe asignar al menos un entrenador";
    }
    if (!formData.athletes || formData.athletes.length === 0) {
      newErrors.athletes = "Debe asignar al menos un atleta";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validateForm()) return false;
    try {
      if (initialData && initialData._id) {
        await dispatch(updateGroup({ clubId, group: formData })).unwrap();
        dispatch(
          setMessage({ message: "Grupo creado exitosamente", type: "success" })
        );
      } else {
        await dispatch(createGroup({ clubId, group: formData })).unwrap();
        dispatch(
          setMessage({ message: "Grupo creado exitosamente", type: "success" })
        );
      }

      return true;
    } catch (error) {
      dispatch(
        setMessage({
          message: "Ocurrió un error, inténtalo nuevamente",
          type: "danger",
        })
      );
      return false;
    }
  }

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    addSchedule,
    removeSchedule,
    handleScheduleChange,
    coaches,
    athletes,
  };
};

export default useGroupForm;
