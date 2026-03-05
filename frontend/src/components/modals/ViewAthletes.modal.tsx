/**
 * Modal para ver los atletas de un grupo
 * Muestra el estado de pago de matrícula con opción a pagar
 */

import React, { useState } from "react";
import GenericModal from "../GenericModal";
import toastr from "toastr";
import registrationsService from "../../services/registrationsService";

interface ViewAthletesModalProps {
  isOpen: boolean;
  group?: any;
  onClose: () => void;
  onPaymentSuccess?: (registrationId: string, athleteId: string) => void;
  onAthleteDelete?: (registrationId: string) => void;
}

export const ViewAthletesModal: React.FC<ViewAthletesModalProps> = ({
  isOpen,
  group,
  onClose,
  onPaymentSuccess,
  onAthleteDelete,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    string | null
  >(null);

  if (!isOpen || !group) return null;

  const athletes = group.athletes || [];
  const sortedAthletes = [...athletes].reverse();

  const handlePayClick = (registrationId: string) => {
    setSelectedRegistrationId(registrationId);
    setPaymentAmount("");
  };

  const handleProcessPayment = async (registrationId: string, athlete: any) => {
    if (!paymentAmount.trim()) {
      toastr.warning("Ingresa el monto a pagar");
      return;
    }

    setPayingId(registrationId);
    try {
      const res = await registrationsService.update(registrationId, {
        registration_pay: new Date().toISOString(),
        registration_amount: parseFloat(paymentAmount),
      });

      if (res.code === 200 || res.code === 201) {
        toastr.success("Matrícula pagada");
        setSelectedRegistrationId(null);
        setPaymentAmount("");
        // Remover atleta de la lista del padre sin refrescar
        const athleteId = athlete._id;
        if (onPaymentSuccess) {
          onPaymentSuccess(registrationId, athleteId);
        }
      } else {
        toastr.error("Error pagando matrícula");
      }
    } catch (error: any) {
      console.error(error);
      toastr.error(
        error?.response?.data?.message || "Error al pagar matrícula",
      );
    } finally {
      setPayingId(null);
    }
  };

  const handleDeleteAthlete = async (registrationId: string, athlete: any) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar a ${athlete.name} ${athlete.lastname}?`,
      )
    ) {
      return;
    }

    setDeletingId(registrationId);
    try {
      const res = await registrationsService.delete(registrationId);

      if (res.code === 200 || res.code === 204) {
        toastr.success("Atleta eliminado");
        if (onAthleteDelete) {
          onAthleteDelete(registrationId);
        }
      } else {
        toastr.error("Error eliminando atleta");
      }
    } catch (error: any) {
      console.error(error);
      toastr.error(
        error?.response?.data?.message || "Error al eliminar atleta",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <i className="fa fa-users modal-icon"></i> <br /> Atletas -{" "}
          {group.name}
        </>
      }
      size="lg"
      style={{ maxHeight: "90vh", overflow: "hidden" }}
    >
      <div className="modal-body">
        {athletes && athletes.length > 0 ? (
          <div
            className="table-responsive"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Carnet</th>
                  <th className="text-center">Matrícula</th>
                </tr>
              </thead>
              <tbody>
                {sortedAthletes.map((athlete: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ width: "50px" }}>{idx + 1}</td>
                    <td>{athlete.name}</td>
                    <td>{athlete.lastname}</td>
                    <td>{athlete.ci || "-"}</td>
                    <td className="text-center">
                      {athlete.isPaid ? (
                        <span className="label label-success">
                          <i className="fa fa-check"></i> Pagada
                        </span>
                      ) : (
                        <>
                          {selectedRegistrationId === athlete.registrationId ? (
                            <div style={{ padding: "5px 0" }}>
                              <input
                                type="number"
                                placeholder="Monto"
                                value={paymentAmount}
                                onChange={(e) =>
                                  setPaymentAmount(e.target.value)
                                }
                                style={{
                                  width: "70px",
                                  padding: "4px",
                                  marginRight: "4px",
                                  borderRadius: "3px",
                                  border: "1px solid #ccc",
                                }}
                                disabled={payingId === athlete.registrationId}
                              />
                              <button
                                className="btn btn-xs btn-success"
                                onClick={() =>
                                  handleProcessPayment(
                                    athlete.registrationId,
                                    athlete,
                                  )
                                }
                                disabled={payingId === athlete.registrationId}
                                style={{ marginRight: "4px" }}
                              >
                                {payingId === athlete.registrationId ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                      style={{ marginRight: "3px" }}
                                    ></span>
                                    Pagando...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-check"></i> Pagar
                                  </>
                                )}
                              </button>
                              <button
                                className="btn btn-xs btn-default"
                                onClick={() => setSelectedRegistrationId(null)}
                                disabled={payingId === athlete.registrationId}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "4px",
                                justifyContent: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                className="btn btn-xs btn-warning"
                                onClick={() =>
                                  handlePayClick(athlete.registrationId)
                                }
                                disabled={deletingId === athlete.registrationId}
                              >
                                <i className="fa fa-credit-card"></i> Pagar
                              </button>
                              <button
                                className="btn btn-xs btn-danger"
                                onClick={() =>
                                  handleDeleteAthlete(
                                    athlete.registrationId,
                                    athlete,
                                  )
                                }
                                disabled={deletingId === athlete.registrationId}
                              >
                                {deletingId === athlete.registrationId ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                      style={{ marginRight: "3px" }}
                                    ></span>
                                    Eliminando...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-trash"></i> Eliminar
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">
            No hay atletas pendientes de pago de matrícula
          </p>
        )}
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-default"
          onClick={onClose}
          disabled={payingId !== null || deletingId !== null}
        >
          Cerrar
        </button>
      </div>
    </GenericModal>
  );
};

export default ViewAthletesModal;
