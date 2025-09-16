interface SelectorProps {
  name: string;
  label?: string;
  selected: any; // Puede ser string o un objeto modelo
  onItemsChange: (item: any) => void;
  errors: string;
  items: any[];
}

export const SelectorList = ({
  name,
  label,
  selected,
  onItemsChange,
  errors,
  items = [],
}: SelectorProps) => {
  // Si selected es un objeto, extraer el _id, si es string, usarlo directamente

  // Soporta items con 'id', '_id' o enums string
  const selectedValue =
    selected && typeof selected === "object"
      ? selected._id || selected.id
      : selected || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Busca por id, _id o value
    const selectedItem =
      items.find(
        (item) =>
          item._id === e.target.value ||
          item.id === e.target.value ||
          item.value === e.target.value
      ) || e.target.value;
    onItemsChange(selectedItem);
  };

  if (label) {
    return (
      <div className="form-group row">
        <label htmlFor={name} className="col-sm-2 col-form-label">
          {label}
        </label>
        <div className="col-sm-10">
          <select
            id={name}
            className={`form-control${errors ? " is-invalid" : ""}`}
            value={selectedValue}
            onChange={handleChange}
          >
            <option value="">
              Seleccione {name.includes("_") ? name.split("_")[0] : name}
            </option>
            {items.map((item) => (
              <option
                key={item._id || item.id || item.value}
                value={item._id || item.id || item.value}
              >
                {item.label ||
                  item.name ||
                  (item.startTime && `${item.startTime} - ${item.endTime}`) ||
                  item}
              </option>
            ))}
          </select>
          {errors && <div className="invalid-feedback">{errors}</div>}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <select
          id={name}
          className={`form-control${errors ? " is-invalid" : ""}`}
          value={selectedValue}
          onChange={handleChange}
        >
          <option value="">
            Seleccione {name.includes("_") ? name.split("_")[0] : name}
          </option>
          {items.map((item) => (
            <option
              key={item._id || item.id || item.value}
              value={item._id || item.id || item.value}
            >
              {item.label ||
                item.name ||
                (item.startTime && `${item.startTime} - ${item.endTime}`) ||
                item}
            </option>
          ))}
        </select>
        {errors && <div className="invalid-feedback">{errors}</div>}
      </>
    );
  }
};
