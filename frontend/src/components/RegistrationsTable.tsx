import React from "react";
import { Button } from "./index";
import Ibox from "./Ibox";

const formatDateLocal = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleDateString("es-ES", { month: "long" });
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

interface RegistrationsTableProps {
  athletes: any[];
  loading: boolean;
  editingDateId: string | null;
  editingDateValue: string;
  savingDateId: string | null;
  onEditDate: (reg: any) => void;
  onSaveDate: (regId: string) => void;
  onCancelEdit: () => void;
  onEditDateValue: (value: string) => void;
  onOpenPayModal: (reg: any) => void;
}

export const RegistrationsTable: React.FC<RegistrationsTableProps> = ({
  athletes,
  loading,
  editingDateId,
  editingDateValue,
  savingDateId,
  onEditDate,
  onSaveDate,
  onCancelEdit,
  onEditDateValue,
  onOpenPayModal,
}) => {
  if (loading) {
    return (
      <Ibox title="Atletas Registrados">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </Ibox>
    );
  }

  if (athletes.length === 0) {
    return (
      <Ibox title="Atletas Registrados">
        <div className="text-center">
          <p className="text-muted">No hay registros en esta asignación.</p>
        </div>
      </Ibox>
    );
  }

  return (
    <Ibox
      title={
        <>
          <i className="fa fa-list"></i> Atletas Registrados ({athletes.length})
        </>
      }
      tools={
        <a className="close-link">
          <i className="fa fa-times"></i>
        </a>
      }
    >
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th className="text-center">Club/Grupo</th>
              <th className="text-center">Fecha de Inscripción</th>
              <th className="text-center">Estado de Pago</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map((reg) => (
              <tr key={reg._id}>
                <td>
                  <strong>{reg.athlete_id?.name || "-"}</strong>
                </td>
                <td>{reg.athlete_id?.lastname || "-"}</td>
                <td className="text-center">
                  {reg.group_id?.club_id?.name || reg.club_id?.name || "-"}
                  {(reg.group_id?.club_id?.name || reg.club_id?.name) && " / "}
                  {reg.group_id?.name || "-"}
                </td>
                <td className="text-center">
                  {editingDateId === reg._id ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        type="date"
                        value={editingDateValue}
                        onChange={(e) => onEditDateValue(e.target.value)}
                        style={{
                          padding: "5px",
                          borderRadius: "3px",
                          border: "1px solid #ccc",
                          width: "150px",
                        }}
                      />
                      <Button
                        className="btn-xs btn-success"
                        onClick={() => onSaveDate(reg._id)}
                        disabled={savingDateId === reg._id}
                      >
                        {savingDateId === reg._id ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                              style={{ marginRight: "5px" }}
                            ></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-check"></i> Guardar
                          </>
                        )}
                      </Button>
                      <button
                        className="btn btn-xs btn-secondary"
                        onClick={onCancelEdit}
                      >
                        <i className="fa fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>
                        {reg.registration_date
                          ? formatDateLocal(reg.registration_date)
                          : "-"}
                      </span>
                      {reg.registration_pay === null && (
                        <Button
                          className="btn btn-xs btn-warning"
                          onClick={() => onEditDate(reg)}
                          title="Editar fecha de inscripción"
                          icon="fa-edit"
                        />
                      )}
                    </div>
                  )}
                </td>
                <td className="text-center">
                  {reg.registration_pay !== null ? (
                    <span className="label label-success">
                      <i className="fa fa-check"></i> Pagado
                    </span>
                  ) : (
                    <Button
                      className="btn btn-xs btn-primary"
                      onClick={() => onOpenPayModal(reg)}
                      icon="fa-credit-card"
                    >
                      Pagar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Ibox>
  );
};

export default RegistrationsTable;
