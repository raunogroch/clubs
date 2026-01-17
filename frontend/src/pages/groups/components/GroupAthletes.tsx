import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { updateGroup, findGroupById } from "../../../store/groupsThunks";
import { fetchEntities } from "../../../store/entitiesThunks";
import type { AppDispatch, RootState } from "../../../store";
import type { User } from "../../../interfaces";
import { NavHeader } from "../../../components";
import { userService } from "../../../services/userService";

interface Props {
  name?: string;
  sub?: string;
  sub1?: string;
}

export const GroupAthletes = ({ name, sub, sub1 }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { clubId, groupId } = useParams<{ clubId: string; groupId?: string }>();

  const group = useSelector((s: RootState) => s.groups.selectedGroup);
  const allAthletes = useSelector((s: RootState) => s.entities.athletes || []);

  // Local optimistic state so UI updates instantly while server call completes
  const [localGroup, setLocalGroup] = useState<any | null>(group ?? null);

  // New state for search and registration
  const [searchCi, setSearchCi] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [foundAthlete, setFoundAthlete] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newAthleteData, setNewAthleteData] = useState({
    name: "",
    lastname: "",
    ci: "",
    role: "athlete",
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Keep localGroup in sync with store updates (server response)
  useEffect(() => {
    setLocalGroup(group ?? null);
  }, [group]);

  // Load group if URL params provided
  useEffect(() => {
    if (clubId && groupId) dispatch(findGroupById({ clubId, groupId }));
  }, [dispatch, clubId, groupId]);

  // Ensure athletes are loaded
  useEffect(() => {
    if (!allAthletes || allAthletes.length === 0) dispatch(fetchEntities());
  }, [dispatch, allAthletes]);

  const idOf = (item: any) =>
    typeof item === "string" ? item : item?._id || "";

  // IDs of athletes currently in the (local) group
  const groupAthleteIds: string[] = useMemo(() => {
    return (localGroup?.athletes || []).map(idOf).filter(Boolean) as string[];
  }, [localGroup]);

  // Normalized athlete objects for the group's left column
  const groupAthletesNormalized: User[] = useMemo(() => {
    return groupAthleteIds.map(
      (id) =>
        allAthletes.find((a) => a._id === id) || {
          _id: id,
          name: "",
          lastname: "",
          username: "",
        }
    );
  }, [groupAthleteIds, allAthletes]);

  // Optimistic add
  const handleAdd = async (athlete: User) => {
    if (!clubId || !localGroup || !athlete._id) return;
    const previous = localGroup;
    const ids = [...groupAthleteIds, athlete._id];
    setLocalGroup({ ...localGroup, athletes: ids });

    try {
      const updatedGroup: any = { ...localGroup, athletes: ids };
      await dispatch(updateGroup({ clubId, group: updatedGroup })).unwrap();
      toastr.success("Atleta añadido al grupo");
    } catch (err) {
      setLocalGroup(previous); // revert
      toastr.error("No se pudo añadir el atleta");
    }
  };

  // Optimistic remove
  const handleRemove = async (athleteId?: string) => {
    if (!clubId || !localGroup || !athleteId) return;
    const previous = localGroup;
    const ids = groupAthleteIds.filter((id) => id !== athleteId);
    setLocalGroup({ ...localGroup, athletes: ids });

    try {
      const updatedGroup: any = { ...localGroup, athletes: ids };
      await dispatch(updateGroup({ clubId, group: updatedGroup })).unwrap();
      toastr.success("Atleta removido del grupo");
    } catch (err) {
      setLocalGroup(previous);
      toastr.error("No se pudo remover el atleta");
    }
  };

  // Search athlete by CI
  const handleSearchByCi = async () => {
    if (!searchCi.trim()) {
      toastr.warning("Por favor ingresa una cédula");
      return;
    }

    setIsSearching(true);
    const response = await userService.findAthleteByCi(searchCi.trim());
    setIsSearching(false);

    if (response.code === 200 && response.data) {
      setSearchResult(response.data);
      setFoundAthlete(true);
      setShowCreateForm(false);
    } else {
      setFoundAthlete(false);
      setShowCreateForm(true);
      setNewAthleteData({
        ...newAthleteData,
        ci: searchCi.trim(),
      });
    }
  };

  // Add found athlete to group
  const handleAddFoundAthlete = async () => {
    if (!searchResult) return;
    await handleAdd(searchResult);
    setSearchCi("");
    setSearchResult(null);
    setFoundAthlete(false);
  };

  // Create new athlete
  const handleCreateNewAthlete = async () => {
    if (
      !newAthleteData.name ||
      !newAthleteData.lastname ||
      !newAthleteData.ci
    ) {
      toastr.warning("Por favor completa todos los campos");
      return;
    }

    setIsCreating(true);
    const response = await userService.createAthlete(newAthleteData);
    setIsCreating(false);

    if (response.code === 201 && response.data) {
      toastr.success("Atleta creado exitosamente");
      // Add the new athlete to the group
      await handleAdd(response.data);
      setSearchCi("");
      setNewAthleteData({
        name: "",
        lastname: "",
        ci: "",
        role: "athlete",
      });
      setShowCreateForm(false);
    } else {
      toastr.error("No se pudo crear el atleta");
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchCi("");
    setSearchResult(null);
    setFoundAthlete(false);
    setShowCreateForm(false);
  };

  return (
    <>
      <NavHeader name={name} sub={sub} sub1={sub1} />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-md-6">
            <div className="ibox-title">
              Atletas en el grupo ({groupAthletesNormalized.length})
            </div>
            <div className="ibox-content">
              <ul className="list-group">
                {groupAthletesNormalized.length === 0 && (
                  <li className="list-group-item">Sin atletas asignados</li>
                )}

                {groupAthletesNormalized.map((a) => (
                  <li
                    key={a._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {a.ci || "-"} - {a.lastname || ""} {a.name || ""}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-xs btn-danger"
                        onClick={() => handleRemove(a._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="ibox-title">Registrar Atleta</div>
            <div className="ibox-content">
              {/* Search or Create Form */}
              {!foundAthlete && !showCreateForm && (
                <div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingresa la cédula del atleta"
                        value={searchCi}
                        onChange={(e) => setSearchCi(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSearchByCi();
                        }}
                      />
                      <span className="input-group-btn">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={handleSearchByCi}
                          disabled={isSearching}
                        >
                          {isSearching ? "Buscando..." : "Buscar"}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Found Athlete Result */}
              {foundAthlete && searchResult && (
                <div className="alert alert-success">
                  <h4>¡Atleta encontrado!</h4>
                  <p>
                    <strong>Nombre:</strong> {searchResult.name}{" "}
                    {searchResult.lastname}
                  </p>
                  <p>
                    <strong>Cédula:</strong> {searchResult.ci}
                  </p>
                  <p>
                    <strong>Usuario:</strong> {searchResult.username}
                  </p>
                  <div className="mt-2">
                    <button
                      className="btn btn-success mr-2"
                      onClick={handleAddFoundAthlete}
                    >
                      <i className="fa fa-plus"></i> Agregar al grupo
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleClearSearch}
                    >
                      Buscar otro
                    </button>
                  </div>
                </div>
              )}

              {/* Create New Athlete Form */}
              {showCreateForm && (
                <div className="alert alert-info">
                  <h4>Crear nuevo atleta</h4>
                  <p className="text-muted">
                    No se encontró un atleta con esa cédula. Crea uno nuevo:
                  </p>

                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                      value={newAthleteData.name}
                      onChange={(e) =>
                        setNewAthleteData({
                          ...newAthleteData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apellido"
                      value={newAthleteData.lastname}
                      onChange={(e) =>
                        setNewAthleteData({
                          ...newAthleteData,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Cédula</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cédula"
                      value={newAthleteData.ci}
                      onChange={(e) =>
                        setNewAthleteData({
                          ...newAthleteData,
                          ci: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mt-2">
                    <button
                      className="btn btn-success mr-2"
                      onClick={handleCreateNewAthlete}
                      disabled={isCreating}
                    >
                      {isCreating ? "Creando..." : "Crear y agregar al grupo"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleClearSearch}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
