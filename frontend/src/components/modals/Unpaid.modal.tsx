/**
 * Modal para visualizar y gestionar atletas sin matrícula
 *
 * Permite ver el listado, editar fechas de inscripción y registrar pagos
 */

import React from "react";
import { Button } from "../../components";
import GenericModal from "../GenericModal";

const formatDateLocal = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleDateString("es-ES", { month: "long" });
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

interface UnpaidModalProps {
  isOpen: boolean;
  loading: boolean;
  athletes: any[];
  editingDateId: string | null;
  editingDateValue: string;
  savingDateId: string | null;
  onClose: () => void;
  onEditDate: (reg: any) => void;
  onSaveDate: (regId: string) => void;
  onCancelEdit: () => void;
  onEditDateValue: (value: string) => void;
  onOpenPayModal: (reg: any) => void;
}

export const UnpaidModal: React.FC<UnpaidModalProps> = ({
  isOpen,
  loading,
  athletes,
  editingDateId,
  editingDateValue,
  savingDateId,
  onClose,
  onEditDate,
  onSaveDate,
  onCancelEdit,
  onEditDateValue,
  onOpenPayModal,
}) => {
  if (!isOpen) return null;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <i className="fa fa-users modal-icon"></i> <br /> Atletas registrados
        </>
      }
      size="lg"
    >
      <div className="modal-body">
        {loading ? (
          <div className="text-center">
            <p>Cargando registrations...</p>
          </div>
        ) : athletes.length === 0 ? (
          <div className="text-center">
            <p className="text-muted">
              No hay registrations en esta asignación.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Club</th>
                  <th className="text-center">Inscripción del atleta</th>
                  <th className="text-center">Estado de pago</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((reg) => (
                  <tr key={reg._id}>
                    <td>{reg.athlete_id?.name || "-"}</td>
                    <td>{reg.athlete_id?.lastname || "-"}</td>
                    <td>{reg.group_id?.name || "-"}</td>
                    <td className="text-center">
                      {editingDateId === reg._id ? (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <input
                            type="date"
                            value={editingDateValue}
                            onChange={(e) => onEditDateValue(e.target.value)}
                            style={{
                              padding: "5px",
                              borderRadius: "3px",
                              border: "1px solid #ccc",
                              flex: 1,
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
                            <i className="fa fa-times"></i> Cancelar
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                            >
                              Editar
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      {reg.registration_pay === null && (
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
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-default" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </GenericModal>
  );
};

export default UnpaidModal;
