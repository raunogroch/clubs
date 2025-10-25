import React, { useEffect, useState } from "react";
import { paymentService } from "../paymentService";

interface Props {
  athlete: any;
  club: any;
  onSelectMonth?: (m: string) => void;
}

export const MonthsStatus = ({ athlete, club, onSelectMonth }) => {
  const [monthsWindow, setMonthsWindow] = useState<string[]>([]);
  const [paidMonths, setPaidMonths] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!athlete || !club) return;

    const computeMonthsWindow = () => {
      const recentPast: string[] = []; // últimos 3 meses previos
      const olderPast: string[] = []; // -4 .. -12
      const future: string[] = [];
      const base = new Date();
      // últimos 3 meses previos (inmediatos): -3, -2, -1
      for (let offset = -3; offset <= -1; offset++) {
        const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        recentPast.push(ym);
      }
      // meses previos adicionales (hasta -12) - opcional, se mostrarán sólo si están pagados
      for (let offset = -12; offset <= -4; offset++) {
        const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        olderPast.push(ym);
      }
      // mes actual y siguientes 3 meses
      for (let offset = 0; offset <= 3; offset++) {
        const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        future.push(ym);
      }
      // Orden: recientes previos, previos más antiguos, actual+futuros
      return {
        recentPast,
        olderPast,
        future,
        all: [...recentPast, ...olderPast, ...future],
      };
    };

    const { all } = computeMonthsWindow();
    setMonthsWindow(all);

    (async () => {
      const res = await paymentService.getPaidMonths(
        athlete._id,
        club._id,
        all
      );
      if (res && res.code >= 200 && res.code < 300) {
        const map: Record<string, any> = {};
        (res.data || []).forEach((p: any) => {
          if (p.month) map[p.month] = p;
        });
        setPaidMonths(map);
      } else {
        setPaidMonths({});
      }
    })();
  }, [athlete, club]);

  const formatMonthLabel = (ym: string) => {
    const [y, m] = ym.split("-");
    try {
      const date = new Date(Number(y), Number(m) - 1, 1);
      return date.toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return ym;
    }
  };

  if (!athlete) return null;

  const renderBadge = (m: string) => {
    const payment = paidMonths[m];
    const paid = Boolean(payment);
    const icon = paid ? "✅" : "⏳";
    const title = paid
      ? `Pagado: ${payment?.amount ?? "-"} | Nota: ${
          payment?.note ?? "-"
        } | Fecha: ${
          payment?.createdAt
            ? new Date(payment.createdAt).toLocaleString()
            : "-"
        }`
      : "Pendiente";
    // Determinar si es pasado / actual / futuro para colorear
    const base = new Date();
    const [yStrC, mStrC] = m.split("-");
    const yC = Number(yStrC);
    const moC = Number(mStrC) - 1;
    const monthDate = new Date(yC, moC, 1);
    const currentMonthDate = new Date(base.getFullYear(), base.getMonth(), 1);
    const isCurrent =
      monthDate.getFullYear() === currentMonthDate.getFullYear() &&
      monthDate.getMonth() === currentMonthDate.getMonth();
    const isFuture = monthDate > currentMonthDate;
    // Color por temporalidad (prioridad temporal sobre estado pagado)
    const temporalClass = isCurrent
      ? "btn-xs btn-outline-primary"
      : isFuture
      ? "btn-xs btn-outline-warning"
      : "btn-xs btn-outline-secondary";
    const handleClick = () => {
      if (!paid) return;
      if (typeof onSelectMonth !== "function") return;

      // Buscar el siguiente mes pendiente dentro de la ventana monthsWindow
      const idx = monthsWindow.indexOf(m);
      if (idx >= 0) {
        const nextPending = monthsWindow
          .slice(idx + 1)
          .find((mm) => !paidMonths[mm]);
        if (nextPending) {
          onSelectMonth(nextPending);
          return;
        }
      }

      // Si no hay un mes pendiente en la ventana, caer back al siguiente mes cronológico
      const [yStr, mStr] = m.split("-");
      const y = Number(yStr);
      const mm = Number(mStr) - 1; // 0-based
      const d = new Date(y, mm + 1, 1); // siguiente mes

      interface Props {
        athlete: any;
        club: any;
        onSelectMonth?: (m: string) => void;
      }

      const MonthsStatus: React.FC<Props> = ({
        athlete,
        club,
        onSelectMonth,
      }) => {
        const [monthsWindow, setMonthsWindow] = useState<string[]>([]);
        const [paidMonths, setPaidMonths] = useState<Record<string, any>>({});

        useEffect(() => {
          if (!athlete || !club) return;

          const computeMonthsWindow = () => {
            const recentPast: string[] = [];
            const olderPast: string[] = [];
            const future: string[] = [];
            const base = new Date();
            for (let offset = -3; offset <= -1; offset++) {
              const d = new Date(
                base.getFullYear(),
                base.getMonth() + offset,
                1
              );
              recentPast.push(
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                  2,
                  "0"
                )}`
              );
            }
            for (let offset = -12; offset <= -4; offset++) {
              const d = new Date(
                base.getFullYear(),
                base.getMonth() + offset,
                1
              );
              olderPast.push(
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                  2,
                  "0"
                )}`
              );
            }
            for (let offset = 0; offset <= 3; offset++) {
              const d = new Date(
                base.getFullYear(),
                base.getMonth() + offset,
                1
              );
              future.push(
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
                  2,
                  "0"
                )}`
              );
            }
            return [...recentPast, ...olderPast, ...future];
          };

          const all = computeMonthsWindow();
          setMonthsWindow(all);

          (async () => {
            const res = await paymentService.getPaidMonths(
              athlete._id,
              club._id,
              all
            );
            if (res && res.code >= 200 && res.code < 300) {
              const map: Record<string, any> = {};
              (res.data || []).forEach((p: any) => {
                if (p.month) map[p.month] = p;
              });
              setPaidMonths(map);
            } else {
              setPaidMonths({});
            }
          })();
        }, [athlete, club]);

        const formatMonthLabel = (ym: string) => {
          const [y, m] = ym.split("-");
          try {
            const d = new Date(Number(y), Number(m) - 1, 1);
            return d.toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            });
          } catch (e) {
            return ym;
          }
        };

        if (!athlete) return null;

        const paidList = monthsWindow.filter((m) => Boolean(paidMonths[m]));
        const pendingList = monthsWindow.filter((m) => {
          const payment = paidMonths[m];
          if (payment) return false;
          const [yStr, mStr] = m.split("-");
          const y = Number(yStr);
          const mo = Number(mStr) - 1;
          const base = new Date();
          return (
            new Date(y, mo, 1) >=
            new Date(base.getFullYear(), base.getMonth(), 1)
          );
        });

        return (
          <div className="mb-3">
            <div className="mb-2">
              <strong>Leyenda:</strong>
              <span className="ms-3">
                <span className="me-1">✅</span> Pagado
              </span>
              <span className="ms-3">
                <span className="me-1">⏳</span> Pendiente
              </span>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6>Meses pagados</h6>
                {paidList.length === 0 ? (
                  <div className="text-muted">
                    No hay meses pagados en la ventana seleccionada.
                  </div>
                ) : (
                  <ul className="list-group mb-2">
                    {paidList.map((m) => {
                      const payment = paidMonths[m];
                      const title = `Pagado: ${
                        payment?.amount ?? "-"
                      } | Nota: ${payment?.note ?? "-"} | Fecha: ${
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
                            <span className="me-2">✅</span>
                            {formatMonthLabel(m)}
                          </span>
                          <span className="small text-muted">
                            {payment?.amount ?? "-"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="col-md-6">
                <h6>Meses pendientes</h6>
                {pendingList.length === 0 ? (
                  <div className="text-muted">
                    No hay meses pendientes en la ventana actual.
                  </div>
                ) : (
                  <ul className="list-group mb-2">
                    {pendingList.map((m) => (
                      <li
                        key={m}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (typeof onSelectMonth === "function")
                            onSelectMonth(m);
                        }}
                      >
                        <span>
                          <span className="me-2">⏳</span>
                          {formatMonthLabel(m)}
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
    };
  };
};
