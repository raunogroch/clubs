import {
  AthleteClubCheckbox,
  CoachClubCheckbox,
  FormField,
  ScheduleClubSelector,
  SportClubSelector,
} from ".";
import {
  useAthleteClub,
  useClubForm,
  useCoachClub,
  useScheduleClub,
  useSportClub,
} from "../hooks";
import {
  CropperImageInput,
  CustomMessage,
  ImageCropper,
} from "../../../components";
import type { ClubFormProps } from "../interfaces";
import { useEffect, useState } from "react";
import { setMessage } from "../../../store/messageSlice";
import { useDispatch } from "react-redux";

export const ClubForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ClubFormProps) => {
  const { formData, errors, message, handleChange, handleSubmit } =
    useClubForm(initialData);

  const { schedules, error: scheduleError } = useScheduleClub();
  const { sports, error: sportError } = useSportClub();
  const { coaches } = useCoachClub();
  const { athletes } = useAthleteClub();
  const [imageSrc, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") setImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      if (message.type === "error") {
        dispatch(setMessage({ message: message.text, type: "danger" }));
      } else if (message.type === "success") {
        dispatch(setMessage({ message: message.text, type: "success" }));
      }
    }
  }, [message, dispatch]);

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

      <CropperImageInput
        value={formData.image || ""}
        error={errors.image}
        onChange={handleImageChange}
      />

      <form onSubmit={onSubmit}>
        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            {typeof imageSrc === "string" && (
              <ImageCropper
                image={imageSrc}
                onCropChange={(cropped) =>
                  handleChange({
                    target: { name: "image", value: cropped },
                  } as any)
                }
              />
            )}
          </div>
        </div>

        <FormField
          title="Nombre del Club"
          type="text"
          name="name"
          value={formData.name}
          error={errors.name}
          handleChange={handleChange}
        />

        <ScheduleClubSelector
          selectedScheduleId={formData.schedule}
          schedules={schedules}
          errors={errors.schedule}
          onScheduleChange={(scheduleId) => {
            handleChange({
              target: { name: "schedule", value: scheduleId },
            } as any);
          }}
        />

        <SportClubSelector
          selectedSportId={formData.discipline}
          sports={sports}
          errors={errors.discipline}
          onSportChange={(sportId) => {
            handleChange({
              target: { name: "discipline", value: sportId },
            } as any);
          }}
        />

        <FormField
          title="Lugar de entrenamiento"
          type="text"
          name="place"
          value={formData.place}
          error={errors.place}
          handleChange={handleChange}
        />

        <div className="hr-line-dashed"></div>

        <CoachClubCheckbox
          dataList={coaches}
          onChange={handleChange}
          selectedCoaches={formData.coaches}
        />

        <div className="hr-line-dashed"></div>

        <AthleteClubCheckbox
          dataList={athletes}
          onChange={handleChange}
          selectedAthletes={formData.athletes}
        />

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
