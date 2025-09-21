import React from "react";
import { Input } from ".";

export interface CheckboxListItem {
  _id?: string;
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
  selectedItems?: Array<any>;
}

export const CheckBoxList: React.FC<CheckboxListProps> = ({
  name,
  label,
  dataList,
  onChange,
  disabled = false,
  selectedItems = [],
}) => {
  const selectedIds = Array.isArray(selectedItems)
    ? selectedItems.filter(Boolean)
    : [];

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
          const id = item._id;
          const checked = selectedIds.includes(String(id));

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
                &nbsp;
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
