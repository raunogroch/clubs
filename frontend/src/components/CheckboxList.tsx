import { Input } from ".";

export interface CheckboxProps {
  name: string;
  label: string;
  dataList: any[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  selectedItems?: string[];
}

export const CheckboxList = ({
  name,
  label,
  dataList,
  onChange,
  selectedItems = [],
}: CheckboxProps) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">
        {label} <br />
        <small className="text-navy">Custom elements</small>
      </label>
      <div className="col-sm-10">
        {dataList.map((item) => {
          return (
            <div key={item._id} className="i-checks">
              <label>
                <Input
                  type="checkbox"
                  name={name}
                  value={item._id}
                  onChange={onChange}
                  checked={selectedItems.includes(String(item._id))}
                />
                <i></i> {item.name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
