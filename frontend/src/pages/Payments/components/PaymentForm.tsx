import { useState, useEffect } from "react";
import toastr from "toastr";
import type { Athlete, Club, Payment, CreatePaymentDto } from "../IPayments";
import type { ApiResponse } from "../../../utils/apiUtils";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createPayment } from "../../../store/paymentThunks";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface Props {
  athlete: Athlete;
  club: Club;
  onDone: (res?: ApiResponse<Payment>) => void;
  selectedMonth?: string;
  onMonthChange?: (m: string) => void;
}

export const PaymentForm = ({
  athlete,
  club,
  onDone,
  selectedMonth,
  onMonthChange,
}: Props) => {
  console.log(club);
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [amount, setAmount] = useState<number | string>(
    club?.monthly_pay ?? ""
  );
  const [month, setMonth] = useState<string>(selectedMonth ?? defaultMonth);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string>("");

  // Cuando cambia el club seleccionado, actualizar el monto por defecto
  useEffect(() => {
    setAmount(club?.monthly_pay ?? "");
  }, [club]);

  // Si el parent selecciona un mes (por ejemplo al clicar un mes pagado), actualizar el input
  useEffect(() => {
    if (selectedMonth) {
      setMonth(selectedMonth);
    }
  }, [selectedMonth]);
  const dispatch = useDispatch<AppDispatch>();
  const paidMonthsMap = useSelector((s: RootState) => s.payments?.paidMonthsMap || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!athlete || !club) return;
    setLoading(true);
    // Validación cliente: no permitir mes anterior al actual
    if (month && month < defaultMonth) {
      toastr.error(
        "No se puede registrar un pago para un mes anterior al actual"
      );
      setLoading(false);
      return;
    }
    // Cliente: si ya está pagado según el store, evitar llamar al backend
    if (paidMonthsMap && paidMonthsMap[month]) {
      toastr.error("El mes ya fue pagado");
      setLoading(false);
      return;
    }
    try {
      const dto: CreatePaymentDto = {
        athleteId: athlete._id,
        clubId: club._id!,
        amount: Number(amount),
        month,
        note: note?.trim() || undefined,
      };
      const action = await dispatch(createPayment(dto));
      // RTK returned action: check status
      if ((action as any).meta?.requestStatus === "fulfilled") {
        const payload = (action as any).payload;
        toastr.success("Pago registrado correctamente");
        onDone({ code: 200, message: "Pago registrado", data: payload });
      } else {
        // rejected: try to extract meaningful message
        const payload = (action as any).payload;
        const errMsg =
          (payload && (payload.message || payload.error || payload.msg)) ||
          (action as any).error?.message ||
          "Error al registrar pago";
        // Prefer a clear duplicate-month message when backend indicates it
        if (typeof errMsg === "string" && errMsg.includes("Ya existe")) {
          toastr.error("El mes ya fue pagado");
        } else if (typeof errMsg === "string" && errMsg.includes("anterior")) {
          // month-in-the-past validation message
          toastr.error(errMsg);
        } else {
          toastr.error(errMsg);
        }
        onDone(undefined);
      }
    } catch (err) {
      onDone(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Atleta</label>
        <input
          className="form-control"
          value={`${athlete.name} ${athlete.lastname}`}
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Club</label>
        <input className="form-control" value={club.name} readOnly />
      </div>

      <div className="form-group">
        <label>Monto</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mes a pagar</label>
        <input
          type="month"
          className="form-control"
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            if (typeof onMonthChange === "function")
              onMonthChange(e.target.value);
          }}
          min={defaultMonth}
          required
        />
      </div>

      {/* Mostrar textarea de justificativo si el monto difiere del mensual del club */}
      {club && Number(amount) !== Number(club?.monthly_pay) && (
        <div className="form-group">
          <label>
            Justificativo / Comentarios (obligatorio si el monto difiere)
          </label>
          <textarea
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            required
          />
        </div>
      )}

      <div className="form-group">
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar pago"}
        </button>
      </div>
    </form>
  );
};
