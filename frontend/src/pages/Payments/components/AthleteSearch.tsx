import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../store/usersThunks";
import { clearUsers } from "../../../store/usersSlice";
import type { Athlete } from "../IPayments";
import type { AppDispatch, RootState } from "../../../store";

interface Props {
  onSelect: (athlete: Athlete) => void;
}

export const AthleteSearch = ({ onSelect }: Props) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const usersState = useSelector((s: RootState) => s.users);
  const results = usersState.users.data as Athlete[];
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const delay = 1000;
    if (!query || query.trim() === "") {
      dispatch(clearUsers());
      setSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      dispatch(
        fetchUsers({
          page: 1,
          limit: 1000,
          name: query.trim(),
          role: "athlete",
        })
      )
        .catch(() => {})
        .finally(() => setSearching(false));
    }, delay);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  return (
    <div>
      <div className="input-group m-b">
        <input
          className="form-control"
          placeholder="Buscar atleta por nombre"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearching(true);
          }}
        />
      </div>

      {searching && <div className="text-muted small mb-2">Buscando...</div>}

      {!searching && query.trim() !== "" && results.length === 0 && (
        <div className="text-muted mb-2">No se encontraron coincidencias</div>
      )}

      <ul className="list-group">
        {results.map((r) => (
          <li
            key={r._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>
                {r.name} {r.lastname}
              </strong>
              <div className="text-muted small">{r.email}</div>
            </div>
            <button
              className="btn btn-xs btn-outline-primary"
              onClick={() => onSelect(r)}
            >
              Seleccionar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
