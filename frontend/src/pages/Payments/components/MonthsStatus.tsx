import { useEffect, useState } from "react";
import { paymentService } from "../paymentService";

interface Props {
  athlete: any;
  club: any;
  onSelectMonth?: (m: string) => void;
}

const formatYm = (ym: string) => {
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return `${d.toLocaleString("es-ES", { month: "short" })} ${d.getFullYear()}`;
};

const inferYmFromDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  } catch (e) {
    return undefined;
  }
};

export const MonthsStatus = ({ athlete, club, onSelectMonth }: Props) => {
  const [monthsWindow, setMonthsWindow] = useState<string[]>([]);
  const [paidMonths, setPaidMonths] = useState<Record<string, any>>({});

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
        const res = await paymentService.getPaidMonths(
          athlete._id,
          club._id,
          all
        );
        if (res && res.code >= 200 && res.code < 300) {
          const map: Record<string, any> = {};
          (res.data || []).forEach((p: any) => {
            let key = p.month;
            if (!key && p.createdAt) {
              const inferred = inferYmFromDate(p.createdAt);
              if (inferred) key = inferred;
            }
            if (key) map[key] = p;
          });
          setPaidMonths(map);
        } else {
          setPaidMonths({});
        }
      } catch (e) {
        setPaidMonths({});
      }
    })();
  }, [athlete, club]);

  if (!athlete) return null;

  const paidList = monthsWindow.filter((m) => Boolean(paidMonths[m]));
  const pendingList = monthsWindow.filter((m) => {
    if (paidMonths[m]) return false;
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
              No hay meses pagados en la ventana seleccionada.
            </div>
          ) : (
            <ul className="list-group mb-2">
              {paidList.map((m) => {
                const payment = paidMonths[m];
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
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const idx = monthsWindow.indexOf(m);
                      if (idx >= 0) {
                        const nextPending = monthsWindow
                          .slice(idx + 1)
                          .find((mm) => !paidMonths[mm]);
                        if (nextPending) {
                          if (typeof onSelectMonth === "function")
                            onSelectMonth(nextPending);
                          return;
                        }
                      }
                      const [yStr, mStr] = m.split("-");
                      const y = Number(yStr);
                      const mm = Number(mStr) - 1;
                      const d = new Date(y, mm + 1, 1);
                      const nextYm = `${d.getFullYear()}-${String(
                        d.getMonth() + 1
                      ).padStart(2, "0")}`;
                      if (typeof onSelectMonth === "function")
                        onSelectMonth(nextYm);
                    }}
                  >
                    <span>
                      <span className="me-2">✅</span> &nbsp;
                      {formatYm(m)}
                    </span>
                    <span className="small text-muted">
                      {payment?.amount ?? "-"} Bs.
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
    </div>
  );
};
