interface SelectorProps {
  name: string;
  label: string;
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
  const selectedValue =
    selected && typeof selected === "object" ? selected._id : selected || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedItem = items.find((item) => item._id === e.target.value);
    onItemsChange(selectedItem || e.target.value);
  };

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
          <option value="">Seleccione una opción</option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name && item.name}
              {item.startTime && `${item.startTime} - ${item.endTime}`}
            </option>
          ))}
        </select>
        {errors && <div className="invalid-feedback">{errors}</div>}
      </div>
    </div>
  );
};
