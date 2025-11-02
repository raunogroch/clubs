import type { Club } from "../IPayments";

interface Props {
  clubs: Array<Club | { club: Club }>;
  onSelect: (c: Club) => void;
}

export const ClubsList = ({ clubs, onSelect }: Props) => {
  if (!clubs || clubs.length === 0)
    return <div>No inscrito en ningun club</div>;

  return (
    <div className="list-group">
      {clubs.map((c) => {
        const clubObj = c as { club?: Club };
        const club: Club = clubObj?.club || (c as Club);
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
            <span className="btn btn-xs btn-outline-primary">Seleccionar</span>
          </button>
        );
      })}
    </div>
  );
};
