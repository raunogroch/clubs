import React, { useState } from "react";
//import { createClub } from "../../services/clubService";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUsers";

const ClubForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    schedule: { startTime: "", endTime: "" },
    place: "",
    discipline: "",
    coaches: [],
    athletes: [],
  });
  const { users, loading } = useUsers();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "startTime" || name === "endTime") {
      setForm({ ...form, schedule: { ...form.schedule, [name]: value } });
    } else if (name === "coaches" || name === "athletes") {
      const selected = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((opt) => opt.value);
      setForm({ ...form, [name]: selected });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // await createClub(form);
    navigate("/clubs");
  };

  if (loading) return <div>Cargando usuarios...</div>;
  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Club</h2>
      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="startTime"
        placeholder="Hora inicio"
        value={form.schedule.startTime}
        onChange={handleChange}
        required
      />
      <input
        name="endTime"
        placeholder="Hora fin"
        value={form.schedule.endTime}
        onChange={handleChange}
        required
      />
      <input
        name="place"
        placeholder="Lugar"
        value={form.place}
        onChange={handleChange}
        required
      />
      <input
        name="discipline"
        placeholder="Disciplina"
        value={form.discipline}
        onChange={handleChange}
        required
      />
      <label>Coaches:</label>
      <select
        name="coaches"
        multiple
        value={form.coaches}
        onChange={handleChange}
      >
        {users
          .filter((u) => u.role === "coach")
          .map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
      </select>
      <label>Atletas:</label>
      <select
        name="athletes"
        multiple
        value={form.athletes}
        onChange={handleChange}
      >
        {users
          .filter((u) => u.role === "athlete")
          .map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
      </select>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default ClubForm;
