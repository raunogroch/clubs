import React from "react";
import QRCode from "react-qr-code";
import type { Athlete, Club } from "../IPayments";

interface Props {
  visible: boolean;
  onClose: () => void;
  onPrint: () => void;
  athlete: Athlete;
  club: Club;
  amount: number | string;
  month: string;
  paymentId?: string | null;
  note?: string;
}

export const ReceiptModal: React.FC<Props> = ({
  visible,
  onClose,
  onPrint,
  athlete,
  club,
  amount,
  month,
  paymentId,
  note,
}) => {
  if (!visible) return null;

  const prettyMonth = (() => {
    try {
      const [y, m] = month.split("-");
      const date = new Date(Number(y), Number(m) - 1, 1);
      return date.toLocaleString(undefined, { month: "long", year: "numeric" });
    } catch (e) {
      return month;
    }
  })();

  return (
    <div style={overlayStyle}>
      <div id="receipt-root" className="receipt-root" style={modalStyle}>
        <br />
        <br />
        <div style={modalBodyStyle} id="receipt-preview">
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h3>Recibo de pago</h3>
            <div style={{ fontSize: 12, color: "#666" }}>{prettyMonth}</div>
          </div>
          <br />
          <br />
          <div style={rowStyle}>
            <strong>Atleta:</strong>
            <span>{`${athlete.name} ${athlete.lastname}`}</span>
          </div>
          <div style={rowStyle}>
            <strong>Club:</strong>
            <span>{club.name}</span>
          </div>
          <div style={rowStyle}>
            <strong>Monto:</strong>
            <span>{amount} Bs.</span>
          </div>
          {paymentId && (
            <div style={qrContainerStyle}>
              <div style={{ background: "#fff", padding: 6, borderRadius: 4 }}>
                <QRCode value={paymentId} size={110} />
              </div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>
                ID: {paymentId}
              </div>
            </div>
          )}
          {note && (
            <div style={rowStyle}>
              <strong>Nota:</strong>
              <span>{note}</span>
            </div>
          )}

          <div style={{ marginTop: 20, fontSize: 12, color: "#444" }}>
            <div>Firma: ____________________________</div>
            <div style={{ marginTop: 8 }}>
              Fecha: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="no-print" style={modalFooterStyle}>
          <button className="btn btn-default" onClick={onClose}>
            Cerrar
          </button>
          <button
            className="btn btn-primary"
            onClick={onPrint}
            style={{ marginLeft: 8 }}
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 6,
  width: 520,
  maxWidth: "95%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  overflow: "hidden",
  position: "relative",
};

const modalBodyStyle: React.CSSProperties = {
  padding: 16,
  maxHeight: "65vh",
  overflowY: "auto",
};

const modalFooterStyle: React.CSSProperties = {
  padding: 12,
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent: "flex-end",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px dashed #f0f0f0",
};

const qrContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  textAlign: "center",
  background: "transparent",
};

export default ReceiptModal;
