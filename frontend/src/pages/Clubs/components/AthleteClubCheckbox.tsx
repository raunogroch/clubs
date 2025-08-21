import { Input } from "../../../components";
import type { User } from "../../Users/types/userTypes";

export interface AthleteClubCheckboxProps {
  dataList: User[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  selectedAthletes?: string[];
}

export const AthleteClubCheckbox = ({
  dataList,
  onChange,
  disabled,
  selectedAthletes = [],
}: AthleteClubCheckboxProps) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">
        Atletas <br />
        <small className="text-navy">Custom elements</small>
      </label>
      <div className="col-sm-10">
        {dataList.map((athlete: User) => (
          <div key={athlete._id} className="i-checks">
            <label>
              <Input
                type="checkbox"
                name="athletes"
                value={athlete._id}
                onChange={onChange}
                disabled={disabled}
                checked={selectedAthletes.includes(String(athlete._id))}
              />
              <i></i> {athlete.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
