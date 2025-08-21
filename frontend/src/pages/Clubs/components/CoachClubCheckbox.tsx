import { Input } from "../../../components";
import type { User } from "../../Users/types/userTypes";

export interface CoachClubCheckboxProps {
  dataList: User[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  selectedCoaches?: string[];
}

export const CoachClubCheckbox = ({
  dataList,
  onChange,
  disabled,
  selectedCoaches = [],
}: CoachClubCheckboxProps) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">
        Entrenadores <br />
        <small className="text-navy">Custom elements</small>
      </label>
      <div className="col-sm-10">
        {dataList.map((coach: User) => (
          <div key={coach._id} className="i-checks">
            <label>
              <Input
                type="checkbox"
                name="coaches"
                value={coach._id}
                onChange={onChange}
                disabled={disabled}
                checked={selectedCoaches.includes(String(coach._id))}
              />
              <i></i> {coach.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
