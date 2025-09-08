import { useEffect } from "react";
import { Input } from "../../../components";
import { useScheduleForm } from "../hooks/useScheduleForm";
import type { ScheduleFormProps } from "../types/scheduleTypes";
import { setMessage } from "../../../store/messageSlice";
import { useDispatch } from "react-redux";

export const ScheduleForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ScheduleFormProps) => {
  const dispatch = useDispatch();
  const { formData, errors, message, handleChange, handleSubmit } =
    useScheduleForm(initialData);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  useEffect(() => {
    if (message) {
      if (message.type === "error") {
        dispatch(setMessage({ message: message.text, type: "danger" }));
      } else if (message.type === "success") {
        dispatch(setMessage({ message: message.text, type: "success" }));
      }
    }
  }, [message, dispatch]);

  return (
    <div>
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
