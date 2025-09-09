interface SelectorProps {
  name: string;
  label: string;
  selectedId: string;
  onItemsChange: (itemId: string) => void;
  errors: string;
  items: any[];
}

export const SelectorList = ({
  name,
  label,
  selectedId,
  onItemsChange,
  errors,
  items = [],
}: SelectorProps) => {
  return (
    <div className="form-group row">
      <label htmlFor={name} className="col-sm-2 col-form-label">
        {label}
      </label>
      <div className="col-sm-10">
        <select
          id={name}
          className={`form-control${errors ? " is-invalid" : ""}`}
          value={selectedId}
          onChange={(e) => onItemsChange(e.target.value)}
        >
          <option value="">Seleccione una opción</option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {`${item.startTime} - ${item.endTime}`}
            </option>
          ))}
        </select>
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};
