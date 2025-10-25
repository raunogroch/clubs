import React, { useState, useEffect } from "react";
import { paymentService } from "../paymentService";
import toastr from "toastr";

interface Props {
  athlete: any;
  club: any;
  onDone: (res?: any) => void;
  selectedMonth?: string;
  onMonthChange?: (m: string) => void;
}

export const PaymentForm: React.FC<Props> = ({
  athlete,
  club,
  onDone,
  selectedMonth,
  onMonthChange,
}) => {
  console.log(club);
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [amount, setAmount] = useState<any>(club?.monthly_pay ?? "");
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
    try {
      const res = await paymentService.create({
        athleteId: athlete._id,
        clubId: club._id,
        amount: Number(amount),
        month,
        note: note?.trim() || undefined,
      });
      onDone(res);
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
