import React, { useEffect } from "react";
import { CheckboxList, Input } from "../../../components";
import { FormField } from "../../Clubs/components";
import { useGroupForm } from "../hooks/useGroupForm";
import { Turn, WeekDays } from "../interface/group.Interface";
import type { Group } from "../interface/group.Interface";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store";
import { fetchEntities } from "../../../store/entitiesThunks";

/**
 * Props for GroupForm
 */
interface GroupFormProps {
  initialData?: Group;
  onSuccess?: () => void;
  onCancel?: () => void;
}

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
  } = useGroupForm(initialData);

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
      <div className="form-group row ">
        <label htmlFor="WeekSchedule" className="col-sm-2 col-form-label">
          Cronograma semanal
        </label>
        <div className="col-sm-10">
          <div className="mb-3">
            {formData.dailySchedules.map((schedule, idx) => (
              <div className="row mb-2" key={idx}>
                {/* Día */}
                <div className="col">
                  <select
                    className="form-control"
                    value={schedule.day}
                    onChange={(e) =>
                      handleScheduleChange(idx, "day", e.target.value)
                    }
                  >
                    <option value="">Seleccione dia</option>
                    {Object.values(WeekDays).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {errors[`dailySchedules_${idx}_day`] && (
                    <div className="text-danger small">
                      {errors[`dailySchedules_${idx}_day`]}
                    </div>
                  )}
                </div>

                {/* Turno */}
                <div className="col">
                  <select
                    className="form-control"
                    value={schedule.turn}
                    onChange={(e) =>
                      handleScheduleChange(idx, "turn", e.target.value)
                    }
                  >
                    <option value="">Seleccione turno</option>
                    {Object.values(Turn).map((turn) => (
                      <option key={turn} value={turn}>
                        {turn}
                      </option>
                    ))}
                  </select>
                  {errors[`dailySchedules_${idx}_turn`] && (
                    <div className="text-danger small">
                      {errors[`dailySchedules_${idx}_turn`]}
                    </div>
                  )}
                </div>

                {/* Hora de inicio */}
                <div className="col">
                  <Input
                    type="time"
                    className="form-control"
                    value={schedule.startTime}
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

                {/* Hora de fin */}
                <div className="col">
                  <Input
                    type="time"
                    className="form-control"
                    value={schedule.endTime}
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

                {/* Eliminar día */}
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeSchedule(idx)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            {/* Agregar día */}
            <button
              type="button"
              className="btn btn-success"
              onClick={addSchedule}
            >
              Agregar día
            </button>
            {errors.dailySchedules && (
              <div className="text-danger small mt-2">
                {errors.dailySchedules}
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
      <CheckboxList
        name="coaches"
        label="Entrenadores"
        dataList={coachesList}
        onChange={handleChange}
        selectedItems={formData.coaches ?? []}
      />

      {/* Selección múltiple de deportistas */}
      <CheckboxList
        name="athletes"
        label="Deportistas"
        dataList={athletesList ?? []}
        onChange={handleChange}
        selectedItems={formData.athletes ?? []}
      />

      {/* Botones de acción */}
      <div className="form-group row mt-3">
        <div className="col-sm-10 offset-sm-2">
          <button type="submit" className="btn btn-primary mr-2">
            {initialData ? "Actualizar" : "Crear"} Grupo
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default GroupForm;
