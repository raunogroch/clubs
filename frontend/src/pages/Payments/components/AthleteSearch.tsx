import { useState } from "react";
import api from "../../../services/api";
import type { Athlete } from "../IPayments";

interface Props {
  onSelect: (athlete: Athlete) => void;
}

export const AthleteSearch = ({ onSelect }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/users?page=1&limit=10&name=${encodeURIComponent(query)}`
      );
      setResults(res.data?.data || res.data || []);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="input-group m-b">
        <input
          className="form-control"
          placeholder="Buscar atleta por nombre"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="input-group-append">
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </span>
      </div>

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
              className="btn btn-sm btn-outline-primary"
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
