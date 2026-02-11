/**
 * Modal para registrar pagos de matrícula
 *
 * Permite ingresar monto y procesar pagos de atletas
 */

import React from "react";
import GenericModal from "../GenericModal";

interface PaymentModalProps {
  isOpen: boolean;
  registration: any;
  paymentAmount: string;
  payingId: string | null;
  onClose: () => void;
  onAmountChange: (value: string) => void;
  onProcessPayment: () => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  registration,
  paymentAmount,
  payingId,
  onClose,
  onAmountChange,
  onProcessPayment,
}) => {
  if (!isOpen || !registration) return null;

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <i className="fa fa-credit-card modal-icon"></i> <br /> Registrar Pago
          de Matrícula
        </>
      }
      size="md"
      footer={
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            onClick={onClose}
            disabled={payingId === registration._id}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onProcessPayment}
            disabled={payingId === registration._id}
          >
            {payingId === registration._id ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                ></span>
                Procesando...
              </>
            ) : (
              <>
                <i className="fa fa-check"></i> Pagar
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="modal-body">
        <div style={{ marginBottom: "15px" }}>
          <p>
            <strong>Atleta:</strong> {registration.athlete_id?.name}{" "}
            {registration.athlete_id?.lastname}
          </p>
          <p>
            <strong>Club/Grupo:</strong> {registration.group_id?.name}
          </p>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            <strong>Monto a Pagar:</strong>
          </label>
          <input
            type="number"
            placeholder="Ingresa el monto"
            value={paymentAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "3px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
            min="0"
            step="0.01"
            disabled={payingId === registration._id}
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default PaymentModal;
