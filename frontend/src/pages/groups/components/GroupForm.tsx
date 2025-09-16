import React from "react";
import { CheckboxList, Input } from "../../../components";
import { FormField } from "../../Clubs/components";
import { useGroupForm } from "../hooks/useGroupForm";
import { Turn, WeekDays } from "../interface/group.Interface";

interface GroupFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GroupForm: React.FC<GroupFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    addSchedule,
    removeSchedule,
    handleScheduleChange,
    coaches,
    athletes,
  } = useGroupForm(initialData);

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={onSubmit}>
      <FormField
        title="Nombre del grupo"
        type="text"
        name="name"
        value={formData.name}
        error={errors.name}
        handleChange={handleChange}
        placeholder="Grupo..."
      />

      <div className="form-group row ">
        <label htmlFor="WeekSchedule" className="col-sm-2 col-form-label">
          Cronograma semanal
        </label>
        <div className="col-sm-10">
          <div className="mb-3">
            {formData.dailySchedules.map((schedule, idx) => (
              <div className="row mb-2" key={idx}>
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

      <FormField
        title="Lugar de entrenamiento"
        type="text"
        name="place"
        value={formData.place}
        error={errors.place}
        handleChange={handleChange}
        placeholder="Dirección..."
      />

      <CheckboxList
        name="coaches"
        label="Entrenadores"
        dataList={coaches ?? []}
        onChange={handleChange}
        selectedItems={(formData.coaches ?? []).map((c: any) =>
          String(c._id ?? c.id)
        )}
      />

      <CheckboxList
        name="athletes"
        label="Deportistas"
        dataList={athletes ?? []}
        onChange={handleChange}
        selectedItems={(formData.athletes ?? []).map((a: any) =>
          String(a._id ?? a.id)
        )}
      />

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
