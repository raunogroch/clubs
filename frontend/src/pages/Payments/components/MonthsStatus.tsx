import { useEffect, useState } from "react";
import type { Athlete, Club } from "../IPayments";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { getPaidMonths } from "../../../store/paymentThunks";
import ReceiptModal from "./ReceiptModal";

interface Props {
  athlete: Athlete;
  club: Club;
  onSelectMonth?: (m: string) => void;
}

const formatYm = (ym: string) => {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return `${d.toLocaleString("es-ES", { month: "short" })} ${d.getFullYear()}`;
};

export const MonthsStatus = ({ athlete, club, onSelectMonth }: Props) => {
  const [monthsWindow, setMonthsWindow] = useState<string[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptMonth, setReceiptMonth] = useState<string | null>(null);
  const [receiptAmount, setReceiptAmount] = useState<number | string>("");
  const [receiptNote, setReceiptNote] = useState<string | undefined>(undefined);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  // we'll read paid months from the store

  const dispatch = useDispatch<AppDispatch>();
  // be defensive: payments slice may be undefined during initial render
  const paidMonthsMap = useSelector(
    (s: RootState) => (s.payments && s.payments.paidMonthsMap) || {}
  );

  useEffect(() => {
    if (!athlete || !club) return;

    const base = new Date();
    const recentPast: string[] = [];
    const olderPast: string[] = [];
    const future: string[] = [];

    for (let offset = -3; offset <= -1; offset++) {
      const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
      recentPast.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      );
    }
    for (let offset = -12; offset <= -4; offset++) {
      const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
      olderPast.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      );
    }
    for (let offset = 0; offset <= 3; offset++) {
      const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
      future.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      );
    }

    const all = [...recentPast, ...olderPast, ...future];
    setMonthsWindow(all);

    (async () => {
      try {
        await dispatch(
          getPaidMonths({
            athleteId: athlete._id,
            clubId: club._id!,
            months: all,
          })
        );
      } catch (e) {
        // ignore - handled by slice
      }
    })();
  }, [athlete, club, dispatch]);

  if (!athlete) return null;

  const paidList = monthsWindow.filter((m) => Boolean(paidMonthsMap[m]));
  const pendingList = monthsWindow.filter((m) => {
    if (paidMonthsMap[m]) return false;
    const [yStr, mStr] = m.split("-");
    const y = Number(yStr);
    const mo = Number(mStr) - 1;
    const base = new Date();
    return (
      new Date(y, mo, 1) >= new Date(base.getFullYear(), base.getMonth(), 1)
    );
  });

  return (
    <div className="mb-3">
      <div className="row">
        <div className="col-md-12">
          {paidList.length === 0 ? (
            <div className="text-muted">
              No hay meses pagados en el club seleccionado.
            </div>
          ) : (
            <ul className="list-group mb-2">
              {paidList.map((m) => {
                const payment = paidMonthsMap[m];
                const title = `Pagado: ${payment?.amount ?? "-"} | Nota: ${
                  payment?.note ?? "-"
                } | Fecha: ${
                  payment?.createdAt
                    ? new Date(payment.createdAt).toLocaleString("es-ES")
                    : "-"
                }`;
                return (
                  <li
                    key={m}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    title={title}
                    aria-disabled={"true"}
                    style={{ cursor: "default", opacity: 0.9 }}
                  >
                    <span>
                      <span className="me-2">✅</span> &nbsp;
                      {formatYm(m)}
                    </span>
                    <span
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <span className="small text-muted">
                        {payment?.amount ?? "-"} Bs.
                      </span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          // open receipt modal with this payment data
                          setReceiptMonth(m);
                          setReceiptAmount(payment?.amount ?? "");
                          setReceiptNote(payment?.note);
                          setReceiptId(payment?._id ?? null);
                          setShowReceipt(true);
                        }}
                        aria-label={`Ver recibo ${formatYm(m)}`}
                      >
                        Recibo
                      </button>
                    </span>
                  </li>
                );
              })}
              {pendingList.map((m) => (
                <li
                  key={m}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (typeof onSelectMonth === "function") onSelectMonth(m);
                  }}
                >
                  <span>
                    <span className="me-2">⏳</span> &nbsp;
                    {formatYm(m)}
                  </span>
                  <span className="small text-muted">--</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ReceiptModal
        visible={showReceipt}
        onClose={() => setShowReceipt(false)}
        onPrint={() => {
          // Print exactly what is shown in the modal: copy the modal DOM (#receipt-root)
          const root = document.getElementById("receipt-root");
          if (!root) {
            // fallback: notify and close modal
            setShowReceipt(false);
            return;
          }

          const html = `
            <html>
              <head>
                <title>Recibo</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <style>
                  /* basic reset and print-friendly styles */
                  body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 20px; }
                  .receipt-root { box-shadow: none; max-width: 700px; margin: 0 auto; }
                  .receipt-root * { box-sizing: border-box; }
                  .row{ display:flex; justify-content:space-between; margin:8px 0 }
                  .small{ color:#666; font-size:12px }
                  /* hide UI controls marked no-print */
                  .no-print { display: none !important; }
                  @media print {
                    body { padding: 0; }
                    .no-print { display: none !important; }
                  }
                </style>
              </head>
              <body>
                ${root.outerHTML}
              </body>
            </html>
          `;

          const w = window.open("", "_blank");
          if (!w) {
            // could not open window (popup blocked)
            setShowReceipt(false);
            return;
          }
          w.document.open();
          w.document.write(html);
          w.document.close();
          // allow rendering then trigger print
          setTimeout(() => w.print(), 300);
          setShowReceipt(false);
        }}
        athlete={athlete}
        club={club}
        amount={receiptAmount}
        month={receiptMonth ?? ""}
        note={receiptNote}
        paymentId={receiptId}
      />
    </div>
  );
};
