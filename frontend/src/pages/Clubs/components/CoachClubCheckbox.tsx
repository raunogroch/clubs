import { Input } from "../../../components";
import type { User } from "../../Users/interfaces/userTypes";

export interface CoachClubCheckboxProps {
  dataList: User[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  selectedCoaches?: string[];
}

export const CoachClubCheckbox = ({
  dataList,
  onChange,
  selectedCoaches = [],
}: CoachClubCheckboxProps) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">
        Entrenadores <br />
        <small className="text-navy">Custom elements</small>
      </label>
      <div className="col-sm-10">
        {dataList.map((coach: User) => {
          return (
            <div key={coach._id} className="i-checks">
              <label>
                <Input
                  type="checkbox"
                  name="coaches"
                  value={coach._id}
                  onChange={onChange}
                  checked={selectedCoaches.includes(String(coach._id))}
                />
                <i></i> {coach.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
