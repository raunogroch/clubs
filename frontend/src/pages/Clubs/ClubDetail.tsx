import React, { useState } from "react";
import type { Club } from "../../interfaces/club";
import { useParams } from "react-router-dom";

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<Club | null>(null);

  /*useEffect(() => {
    if (id) {
      getClub(id).then((data) => {
        if (data) setClub(data);
      });
    }
  }, [id]);

  if (!club) return <div>Cargando...</div>;*/

  return (
    <div>
      {/*}<h2>{club.name}</h2>
      <p>
        <b>Lugar:</b> {club.place}
      </p>
      <p>
        <b>Disciplina:</b> {club.discipline}
      </p>
      <p>
        <b>Horario:</b> {club.schedule.startTime} - {club.schedule.endTime}
      </p>
      <p>
        <b>Coaches:</b> {club.coaches.join(", ")}
      </p>
      <p>
        <b>Atletas:</b> {club.athletes.join(", ")}
      </p>
      <Link to={`/clubs/edit/${club.id}`}>Editar</Link>
      <Link to="/clubs">Volver</Link>{*/}
    </div>
  );
};

export default ClubDetail;
