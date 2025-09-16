import React from "react";
import { Input } from ".";

export interface CheckboxListItem {
  _id?: string | number;
  id?: string | number;
  name?: string;
  lastname?: string;
  [key: string]: any;
}

export interface CheckboxListProps {
  name: string;
  label?: string;
  dataList: CheckboxListItem[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  selectedItems?: Array<string | number>;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  name,
  label,
  dataList,
  onChange,
  disabled = false,
  selectedItems = [],
}) => {
  return (
    <div className="form-group row">
      {label && (
        <label className="col-sm-2 col-form-label">
          {label} <br />
          <small className="text-navy">Selecciona múltiples</small>
        </label>
      )}
      <div className={label ? "col-sm-10" : "col-12"}>
        {dataList.map((item) => {
          const id = item._id ?? item.id ?? `${Math.random()}`;
          const checked = selectedItems
            ? selectedItems.includes(String(id)) || selectedItems.includes(id)
            : false;

          return (
            <div key={String(id)} className="i-checks">
              <label>
                <Input
                  type="checkbox"
                  name={name}
                  value={String(id)}
                  onChange={onChange}
                  checked={checked}
                  disabled={disabled}
                />
                <i></i>
                {`${item.lastname ?? ""}${item.lastname ? ", " : ""}${
                  item.name ?? ""
                }`}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxList;
