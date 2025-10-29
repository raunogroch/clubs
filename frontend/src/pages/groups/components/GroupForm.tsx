import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, SelectorList, Button, Spinner } from "../../../components";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { FormField } from "../../Clubs/components";
import { useGroup } from "../hooks/useGroup";
import type { AppDispatch, RootState } from "../../../store";
import { Turn, WeekDays } from "../interface/groupTypes";
import { findGroupById } from "../../../store/groupsThunks";

interface GroupFormProps {
  clubId?: string;
  groupId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const getValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "value" in value) return value.value;
  return value;
};

export const GroupForm = ({
  clubId,
  groupId,
  onSuccess,
  onCancel,
}: GroupFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedGroup: group,
    error,
    status,
  } = useSelector((state: RootState) => state.groups);
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    setFormData,
    addSchedule,
    removeSchedule,
    handleScheduleChange,
  } = useGroup(group);

  useEffect(() => {
    // only try to load a specific group when both ids are present
    if (clubId && groupId) {
      dispatch(findGroupById({ clubId, groupId }));
    }
  }, [dispatch, clubId, groupId]);

  // when the selected group is loaded, sync it into the form
  useEffect(() => {
    if (group && setFormData) setFormData(group);
  }, [group, setFormData]);

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  if (error) toastr.error(error);

  return (
    <>
      {status === "loading" && <Spinner />}
      {status === "succeeded" && (
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
          <div className="form-group row">
            <label htmlFor="WeekSchedule" className="col-sm-2 col-form-label">
              Cronograma semanal
            </label>
            <div className="col-sm-10">
              <div className="mb-3">
                {formData.dailySchedules.map((schedule, idx) => (
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
          <FormField
            title="Lugar de entrenamiento"
            type="text"
            name="place"
            value={formData.place}
            error={errors.place}
            handleChange={handleChange}
            placeholder="Dirección..."
          />
          {formData._id && (
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                Estado del grupo
              </label>
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
                name={group ? "Actualizar" : "Crear"}
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
      )}
    </>
  );
};
