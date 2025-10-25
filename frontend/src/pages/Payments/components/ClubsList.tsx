export const ClubsList = ({ clubs, onSelect }: any) => {
  if (!clubs || clubs.length === 0)
    return <div>No inscrito en ningun club</div>;

  return (
    <div className="list-group">
      {clubs.map((c: any) => {
        // soporta dos formas: { club, groups } que devuelve el backend,
        // o directamente el objeto club
        const club = c?.club || c;
        const id = club?._id || club?.id || Math.random();
        const name = club?.name || club?.title || "Sin nombre";

        return (
          <button
            key={id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => onSelect(club)}
          >
            <div>
              <strong>{name}</strong>
              <div className="small text-muted">{club?.city ?? ""}</div>
            </div>
            <span className="btn btn-outline-primary">Seleccionar</span>
          </button>
        );
      })}
    </div>
  );
};

{
  /*
    
    <div className="list-group">
      {clubs.map((c: any) => (
        <button
          key={c._id}
          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          onClick={() => onSelect(c)}
        >
          <div>
            <strong>{c._id} </strong>
            <div className="small text-muted">{c.name}</div>
          </div>
          <span className="badge badge-primary badge-pill">Seleccionar</span>
        </button>
      ))}
    </div>

    */
}
