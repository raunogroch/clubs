import { CustomMessage, Input } from "../../../components";
import { useClubForm } from "../hooks/useClubForm";
import { useScheduleClub } from "../hooks/useScheduleClub";
import { useSportClub } from "../hooks/useSportClub";
import type { ClubFormProps } from "../types/clubTypes";
import { ScheduleClubSelector } from "./ScheduleClubSelector";
import { SportClubSelector } from "./SportClubSelector";

export const ClubForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ClubFormProps) => {
  const { formData, errors, message, handleChange, handleSubmit } =
    useClubForm(initialData);

  const { schedules, error: scheduleError } = useScheduleClub();

  const { sports, error: sportError } = useSportClub();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <div>
      {message && <CustomMessage message={message.text} kind={message.type} />}
      {scheduleError && <CustomMessage message={scheduleError} kind="danger" />}
      {sportError && <CustomMessage message={sportError} kind="danger" />}
      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-2 col-form-label">
            Nombre del club
          </label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Ej. Barcelona ..."
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
        </div>

        <ScheduleClubSelector
          selectedScheduleId={formData.schedule}
          schedules={schedules}
          onScheduleChange={(scheduleId) => {
            handleChange({
              target: { name: "schedule", value: scheduleId },
            } as any);
          }}
        />

        <SportClubSelector
          selectedSportId={formData.discipline}
          sports={sports}
          onSportChange={(sportId) => {
            handleChange({
              target: { name: "discipline", value: sportId },
            } as any);
          }}
        />

        <div className="form-group row">
          <label htmlFor="place" className="col-sm-2 col-form-label">
            Lugar
          </label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className={`form-control ${errors.place ? "is-invalid" : ""}`}
              placeholder="Ej. Estadio Camp Nou ..."
              required
            />
            {errors.place && (
              <div className="invalid-feedback">{errors.place}</div>
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
