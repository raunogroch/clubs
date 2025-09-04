import React from "react";
import { Input } from ".";

interface CropperImageInputProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CropperImageInput: React.FC<CropperImageInputProps> = ({
  value,
  error,
  onChange,
}) => (
  <div className="form-group row mb-0">
    <label htmlFor="image" className="col-sm-2 col-form-label">
      Imagen
    </label>
    <div className="col-sm-10">
      <Input
        type="file"
        id="image"
        name="image"
        value={value}
        accept="image/*"
        className={`form-control${error ? " is-invalid" : ""}`}
        onChange={onChange}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  </div>
);
