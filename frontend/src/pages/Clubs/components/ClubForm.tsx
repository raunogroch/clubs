import { useState } from "react";
import { FormField } from ".";
import { useClubForm } from "../hooks";
import {
  CheckboxList,
  CropperImageInput,
  ImageCropper,
  SelectorList,
} from "../../../components";
import type { ClubFormProps } from "../interfaces";
import { useClubCatalogs } from "../../../hooks";

export const ClubForm = ({
  initialData,
  onSuccess,
  onCancel,
}: ClubFormProps) => {
  const { formData, errors, message, handleChange, handleSubmit } =
    useClubForm(initialData);

  const { sports, coaches, athletes, schedules } = useClubCatalogs();

  console.log("Sports in ClubForm:", sports);

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

  console.log("Sports in ClubForm:", sports);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success && onSuccess) onSuccess();
  };

  return (
    <div>
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

        <SelectorList
          name="schedule"
          label="Horario"
          selectedId={formData.schedule}
          items={schedules}
          errors={errors.schedule}
          onItemsChange={(scheduleId) =>
            handleChange({
              target: { name: "schedule", value: scheduleId },
            } as any)
          }
        />

        <SelectorList
          name="discipline"
          label="Disciplina deportiva"
          selectedId={formData.discipline}
          items={sports}
          errors={errors.discipline}
          onItemsChange={(sportId) =>
            handleChange({
              target: { name: "discipline", value: sportId },
            } as any)
          }
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

        <CheckboxList
          name="coaches"
          label="Entrenadores"
          dataList={coaches}
          onChange={handleChange}
          selectedItems={formData.coaches}
        />

        <div className="hr-line-dashed"></div>

        <CheckboxList
          name="athletes"
          label="Atletas"
          dataList={athletes}
          onChange={handleChange}
          selectedItems={formData.athletes}
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
