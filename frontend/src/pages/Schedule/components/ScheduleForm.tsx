import { CustomMessage, Input } from "../../../components";
import { useScheduleForm } from "../hooks/useScheduleForm";
import type { ScheduleFormProps } from "../types/scheduleTypes";

export const ScheduleForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ScheduleFormProps) => {
  const { formData, errors, message, handleChange, handleSubmit } =
    useScheduleForm(initialData);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <div>
      {message && <CustomMessage message={message.text} kind={message.type} />}
      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <label htmlFor="startTime" className="col-sm-2 col-form-label">
            Inicio
          </label>
          <div className="col-sm-10">
            <Input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
              placeholder="Ej. 8:00 ..."
              required
            />
            {errors.startTime && (
              <div className="invalid-feedback">{errors.startTime}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="endTime" className="col-sm-2 col-form-label">
            Inicio
          </label>
          <div className="col-sm-10">
            <Input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={`form-control ${errors.endTime ? "is-invalid" : ""}`}
              placeholder="Ej. 16:30 ..."
              required
            />
            {errors.endTime && (
              <div className="invalid-feedback">{errors.endTime}</div>
            )}
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button type="submit" className="btn btn-primary mr-2">
              {initialData ? "Actualizar" : "Crear"} Club
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
    </div>
  );
};
