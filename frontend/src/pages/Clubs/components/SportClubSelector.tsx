import type { Sport } from "../../Sports/types/sportTypes";

interface SportSelectorProps {
  selectedSportId: string;
  onSportChange: (sportId: string) => void;
  errors?: string;
  sports?: Sport[];
}

export const SportClubSelector = ({
  selectedSportId,
  onSportChange,
  errors,
  sports = [],
}: SportSelectorProps) => {
  return (
    <div className="form-group row">
      <label htmlFor="sport" className="col-sm-2 col-form-label">
        Disciplina deportiva
      </label>
      <div className="col-sm-10">
        <select
          id="sport"
          className={`form-control${errors ? " is-invalid" : ""}`}
          value={selectedSportId}
          onChange={(e) => onSportChange(e.target.value)}
        >
          <option value="">Seleccione una disciplina</option>
          {sports.map((sport: Sport) => (
            <option key={sport._id} value={sport._id}>
              {sport.name}
            </option>
          ))}
        </select>
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};
