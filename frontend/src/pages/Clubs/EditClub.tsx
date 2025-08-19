import React, { useEffect, useState } from "react";
import type { Club } from "../../interfaces/club";
import { useParams, useNavigate } from "react-router-dom";

const EditClub: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Club | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      /*  getClub(id).then((data) => {
        if (data) setForm(data);
      });*/
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (form) {
      if (name === "startTime" || name === "endTime") {
        setForm({ ...form, schedule: { ...form.schedule, [name]: value } });
      } else {
        setForm({ ...form, [name]: value } as Club);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form && id) {
      //await updateClub(id, form);
      navigate("/clubs");
    }
  };

  if (!form) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Club</h2>
      <input name="name" value={form.name} onChange={handleChange} required />
      <input
        name="startTime"
        value={form.schedule.startTime}
        onChange={handleChange}
        required
      />
      <input
        name="endTime"
        value={form.schedule.endTime}
        onChange={handleChange}
        required
      />
      <input name="place" value={form.place} onChange={handleChange} required />
      <input
        name="discipline"
        value={form.discipline}
        onChange={handleChange}
        required
      />
      {/* Coaches y athletes: select/autocomplete según tu implementación */}
      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default EditClub;
function getClub(id: string) {
  throw new Error("Function not implemented.");
}
