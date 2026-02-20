import React, { useState } from "react";
import { Button } from "../index";
import { userService } from "../../services/userService";

interface Assistant {
  _id: string;
  name: string;
  lastname?: string;
  ci: string;
}

interface ClubAssistantsModalProps {
  isOpen: boolean;
  isLoading: boolean;
  clubName?: string;
  assistants: Assistant[];
  onClose: () => void;
  onCreate: (name: string, lastname: string, ci: string) => void;
  onAssign: (assistantId: string) => void;
  onRemove: (assistantId: string) => void;
  assignedIds: string[];
}

export const ClubAssistantsModal: React.FC<ClubAssistantsModalProps> = ({
  isOpen,
  isLoading,
  clubName,
  assistants,
  onClose,
  onCreate,
  onAssign,
  onRemove,
  assignedIds,
}) => {
  const [searchCI, setSearchCI] = useState("");
  const [newName, setNewName] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newCI, setNewCI] = useState("");
  const [searchResult, setSearchResult] = useState<Assistant | null>(null);
  const [searched, setSearched] = useState(false); // whether a search has been performed
  // mirror prop so we can instantly show additions/removals without waiting
  const [localAssignedIds, setLocalAssignedIds] = useState<string[]>(assignedIds);

  React.useEffect(() => {
    setLocalAssignedIds(assignedIds);
  }, [assignedIds]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchResult(null);
      setSearchCI("");
      setNewName("");
      setNewCI("");
      setSearched(false);
    }
  }, [isOpen]);

  // if the user types a different CI after a previous search, reset the result
  React.useEffect(() => {
    if (searchResult && searchCI !== searchResult.ci) {
      setSearchResult(null);
      setSearched(false);
    }
  }, [searchCI, searchResult]);

  const performSearch = async (ci: string) => {
    if (!ci) return;
    setSearched(true);
    try {
      const resp = await userService.findUserByCiAndRole(ci, "assistant");
      if (resp.code === 200 && resp.data) {
        setSearchResult(resp.data);
      } else {
        setSearchResult(null);
        // prefill CI for creation convenience
        setNewCI(ci);
      }
    } catch (e) {
      console.error(e);
      setSearchResult(null);
      setNewCI(ci);
    }
  };

  if (!isOpen) return null;

  // wrap create callback so we can clear the form and search state once done
  const handleLocalCreate = async (
    name: string,
    lastname: string,
    ci: string,
  ) => {
    await onCreate(name, lastname, ci);
    // reset inputs so the user can perform a fresh search if desired
    setSearchCI("");
    setNewCI("");
    setNewName("");
    setNewLastname("");
    setSearchResult(null);
    setSearched(false);
  };

  return (
    <div
      className="modal inmodal"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-content animated bounceInRight">
          <div className="modal-header">
            <i className="fa fa-user-secret modal-icon"></i>
            <h4 className="modal-title">
              Secretarios(as) del Club{clubName ? ` - ${clubName}` : ""}
            </h4>
            <small className="font-bold">
              Asigna o crea secretarios(as) para este club
            </small>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Buscar por CI</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={searchCI}
                  onChange={(e) => setSearchCI(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      performSearch(searchCI);
                    }
                  }}
                  placeholder="CI del secretario(a)"
                  disabled={isLoading}
                />
                <span className="input-group-btn">
                  <Button
                    className="btn btn-info"
                    onClick={() => performSearch(searchCI)}
                    disabled={isLoading || !searchCI}
                    icon="fa-search"
                  >
                    Buscar
                  </Button>
                </span>
              </div>
              {/* display user card if found */}
              {searchResult && (
                <div className="mt-2">
                  <h5 className="mb-2">
                    <i className="fa fa-check-circle text-success"></i> Usuario
                    encontrado
                  </h5>
                  <div
                    className="contact-box center-version"
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ padding: "16px" }}>
                      {/* no image for assistants currently */}
                      <div
                        className="rounded-circle"
                        style={{
                          width: "90px",
                          height: "90px",
                          margin: "0 auto 12px",
                          backgroundColor: "#e8e8e8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "3px solid #5c6cfa",
                        }}
                      >
                        <i
                          className="fa fa-user-secret"
                          style={{ fontSize: "40px", color: "#999" }}
                        ></i>
                      </div>

                      <h3 className="m-b-xs" style={{ marginBottom: "8px" }}>
                        <strong>
                          {searchResult.name} {searchResult.lastname || ""}
                        </strong>
                      </h3>
                      <address style={{ margin: "12px 0", fontSize: "13px" }}>
                        <strong>CI:</strong> {searchResult.ci || "-"}
                      </address>
                      {localAssignedIds.includes(searchResult._id) ? (
                        <Button
                          className="btn btn-xs btn-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "¿Quitar este secretario(a) del club?",
                              )
                            ) {
                              onRemove(searchResult._id);
                              setLocalAssignedIds(prev => prev.filter(id => id !== searchResult._id));
                            }
                          }}
                          disabled={isLoading}
                          icon="fa-trash"
                        >
                          Eliminar
                        </Button>
                      ) : (
                        <Button
                          className="btn btn-xs btn-primary"
                          onClick={() => {
                            // assign then clear card
                            onAssign(searchResult._id);
                            setLocalAssignedIds(prev => [...new Set([...prev, searchResult._id])]);
                            setSearchResult(null);
                            setSearchCI("");
                            setSearched(false);
                          }}
                          disabled={isLoading}
                          icon="fa-plus"
                        >
                          Asignar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* show creation form only when search has been performed and no result found */}
            {searched && !searchResult && (
              <div className="form-group">
                <label>Crear nuevo secretario(a)</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nombre"
                  disabled={isLoading}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={newLastname}
                  onChange={(e) => setNewLastname(e.target.value)}
                  placeholder="Apellido"
                  disabled={isLoading}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  value={newCI}
                  placeholder="CI"
                  disabled
                />
                <Button
                  className="btn btn-success"
                  onClick={() => handleLocalCreate(newName, newLastname, newCI)}
                  disabled={isLoading || !newName || !newLastname || !newCI}
                  icon="fa-plus"
                >
                  Crear y asignar
                </Button>
              </div>
            )}
            <hr />
            <h5>Secretarios(as) registrados</h5>
            <ul className="list-group">
              {localAssignedIds.length === 0 ? (
                <li className="list-group-item text-muted">
                  No hay secretarios(as) registrados
                </li>
              ) : (
                // show only those assistants that are actually assigned
                assistants
                  .filter((a) => localAssignedIds.includes(a._id))
                  .map((a) => (
                    <li
                      key={a._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        <i className="fa fa-user-secret mr-2"></i>
                        {a.name} {a.lastname ? a.lastname : ""}{" "}
                        <span className="text-muted">({a.ci})</span>
                      </span>
                      <Button
                        className="btn btn-xs btn-danger"
                        onClick={() => {
                          if (
                            window.confirm(
                              "¿Quitar este secretario(a) del club?",
                            )
                          ) {
                            onRemove(a._id);
                            setLocalAssignedIds(prev => prev.filter(id => id !== a._id));
                          }
                        }}
                        disabled={isLoading}
                        icon="fa-trash"
                      >
                        Eliminar
                      </Button>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
