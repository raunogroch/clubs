import React, { useEffect } from "react";
import { CheckBoxList, Input, SelectorList, Button } from "../../../components";
import { FormField } from "../../Clubs/components";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { fetchEntities } from "../../../store/entitiesThunks";
import { Turn, WeekDays, type IGroup } from "../interface/groupTypes";
import { useGroup } from "../hooks/useGroup";

/**
 * Props para GroupForm
 */
interface GroupFormProps {
  initialData?: IGroup;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Función auxiliar para extraer valores de forma segura
 */
const getValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "value" in value) {
    return value.value;
  }
  return value;
};

/**
 * Formulario para crear/editar un grupo
 */
export const GroupForm: React.FC<GroupFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // Obtiene la lista de entrenadores y atletas del store
  const { coaches: coachesList, athletes: athletesList } = useSelector(
    (state: any) => state.entities
  );
  // Custom hook para manejar el estado y lógica del formulario
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    addSchedule,
    removeSchedule,
    handleScheduleChange,
  } = useGroup(initialData);

  // Ordenar dailySchedules para mostrar siempre en orden
  const DAYS_ORDER = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Sabado",
    "Domingo",
  ];
  const getDayValue = (day: any) => {
    if (typeof day === "string") return day;
    if (day && typeof day === "object" && "value" in day) return day.value;
    return "";
  };
  const sortedSchedules = [...formData.dailySchedules].sort((a, b) => {
    const idxA = DAYS_ORDER.findIndex(
      (d) => d.toLowerCase() === getDayValue(a.day).toLowerCase()
    );
    const idxB = DAYS_ORDER.findIndex(
      (d) => d.toLowerCase() === getDayValue(b.day).toLowerCase()
    );
    return idxA - idxB;
  });

  // Carga los entrenadores y atletas al montar el componente
  useEffect(() => {
    dispatch(fetchEntities()).unwrap();
  }, [dispatch]);

  // Handler para submit del formulario
  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Campo: Nombre del grupo */}
      <FormField
        title="Nombre del grupo"
        type="text"
        name="name"
        value={formData.name}
        error={errors.name}
        handleChange={handleChange}
        placeholder="Grupo..."
      />

      {/* Cronograma semanal dinámico */}
      <div className="form-group row">
        <label htmlFor="WeekSchedule" className="col-sm-2 col-form-label">
          Cronograma semanal
        </label>
        <div className="col-sm-10">
          <div className="mb-3">
            {sortedSchedules.map((schedule, idx) => (
              <div className="row mb-2" key={idx}>
                <div className="col">
                  <SelectorList
                    name={`dia_${idx}`}
                    selected={getValue(schedule.day)}
                    onItemsChange={(value) =>
                      handleScheduleChange(idx, "day", value)
                    }
                    errors={errors[`dailySchedules_${idx}_day`] || ""}
                    items={Object.values(WeekDays).map((day) => ({
                      value: day,
                      label: day,
                    }))}
                  />
                </div>

                <div className="col">
                  <SelectorList
                    name={`turno_${idx}`}
                    selected={getValue(schedule.turn)}
                    onItemsChange={(value) =>
                      handleScheduleChange(idx, "turn", value)
                    }
                    errors={errors[`dailySchedules_${idx}_turn`] || ""}
                    items={Object.values(Turn).map((turn) => ({
                      value: turn,
                      label: turn,
                    }))}
                  />
                </div>

                {/* Hora de inicio */}
                <div className="col">
                  <Input
                    type="time"
                    className="form-control"
                    value={schedule.startTime || ""}
                    onChange={(e) =>
                      handleScheduleChange(idx, "startTime", e.target.value)
                    }
                    placeholder="Inicio"
                  />
                  {errors[`dailySchedules_${idx}_startTime`] && (
                    <div className="text-danger small">
                      {errors[`dailySchedules_${idx}_startTime`]}
                    </div>
                  )}
                </div>

                <div className="col">
                  <Input
                    type="time"
                    className="form-control"
                    value={schedule.endTime || ""}
                    onChange={(e) =>
                      handleScheduleChange(idx, "endTime", e.target.value)
                    }
                    placeholder="Fin"
                  />
                  {errors[`dailySchedules_${idx}_endTime`] && (
                    <div className="text-danger small">
                      {errors[`dailySchedules_${idx}_endTime`]}
                    </div>
                  )}
                </div>

                <div className="col-auto">
                  <Button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeSchedule(idx)}
                    icon="trash"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              className="btn btn-success"
              onClick={addSchedule}
              name="Agregar cronograma"
            />

            {/* Mensaje de error para dailySchedules - Solución simplificada */}
            {errors.dailySchedules && (
              <div className="text-danger small mt-2">
                {typeof errors.dailySchedules === "string"
                  ? errors.dailySchedules
                  : "Hay errores en el cronograma semanal"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lugar de entrenamiento */}
      <FormField
        title="Lugar de entrenamiento"
        type="text"
        name="place"
        value={formData.place}
        error={errors.place}
        handleChange={handleChange}
        placeholder="Dirección..."
      />

      {/* Selección múltiple de entrenadores */}
      <CheckBoxList
        name="coaches"
        label="Entrenadores"
        dataList={coachesList}
        onChange={handleChange}
        selectedItems={formData.coaches ?? []}
      />

      {/* Selección múltiple de deportistas */}
      <CheckBoxList
        name="athletes"
        label="Deportistas"
        dataList={athletesList ?? []}
        onChange={handleChange}
        selectedItems={formData.athletes ?? []}
      />

      {formData._id && (
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Estado del grupo</label>
          <div className="col-sm-10 d-flex align-items-center">
            <input
              type="checkbox"
              name="active"
              checked={!!formData.active}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "active",
                    value: e.target.checked,
                    type: "checkbox",
                    checked: e.target.checked,
                  },
                } as any)
              }
            />
            <span className="ml-2">
              {formData.active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      )}

      <div className="form-group row mt-3">
        <div className="col-sm-10 offset-sm-2">
          <Button
            type="submit"
            className="btn btn-primary mr-2"
            name={initialData ? "Actualizar" : "Crear"}
          />
          {onCancel && (
            <Button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              name="Cancelar"
            />
          )}
        </div>
      </div>
    </form>
  );
};
