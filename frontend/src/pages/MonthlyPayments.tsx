import { useState } from "react";
import { userService } from "../services/userService";
import { registrationsService } from "../services/registrationsService";
import groupsService from "../services/groups.service";
import { paymentsService } from "../services/paymentsService";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Image, NavHeader } from "../components";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

enum GENDER {
  "male" = "Masculino",
  "female" = "Femenino",
}

export const MonthlyPayments = () => {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [athlete, setAthlete] = useState<any | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [groupsInfo, setGroupsInfo] = useState<Record<string, any>>({});
  const [paying, setPaying] = useState<string | null>(null);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedRegistrationPay, setSelectedRegistrationPay] =
    useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [payingRegistration, setPayingRegistration] = useState<string | null>(
    null,
  );

  const [paymentsMap, setPaymentsMap] = useState<Record<string, any[]>>({});

  const loadPaymentsForRegistration = async (reg: any) => {
    try {
      const athleteId = reg?.athlete_id?._id || reg?.athlete_id;
      if (!athleteId) return;
      const res = await paymentsService.getByAthlete(athleteId);
      if (res.code === 200 && res.data) {
        const gid = reg?.group_id?._id || reg?.group_id;
        const filteredPayments = (res.data as any[]).filter((p: any) => {
          const pgid = p.group_id?._id || p.group_id;
          return pgid?.toString?.() === gid?.toString?.();
        });
        setPaymentsMap((prev) => ({
          ...prev,
          [reg._id]: filteredPayments,
        }));
      }
    } catch (e) {
      console.error("Error cargando pagos:", e);
    }
  };

  const user = useSelector((state: RootState) => state.auth.user);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setLoading(true);
    setAthlete(null);
    setRegistrations([]);
    setGroupsInfo({});
    try {
      // Buscar por CI
      let res = await userService.findUserByCiAndRole(searchInput, "athlete");
      let found = res.data?.data || res.data || null;

      // Si no encuentra por CI, buscar por nombre o apellido
      if (!found) {
        // Obtener todos los atletas de los grupos
        const allUsersRes = await userService.getAthletesFromGroups();
        if (allUsersRes?.data) {
          const searchTerm = searchInput.toLowerCase().trim();
          found = (allUsersRes.data as any[]).find((user: any) => {
            const nameLower = (user.name || "").toLowerCase();
            const lastnameLower = (user.lastname || "").toLowerCase();
            const ciLower = (user.ci || "").toLowerCase();
            return (
              nameLower.includes(searchTerm) ||
              lastnameLower.includes(searchTerm) ||
              ciLower.includes(searchTerm)
            );
          });
        }
      }

      if (!found) {
        alert("Atleta no encontrado");
        setLoading(false);
        return;
      }

      setAthlete(found);

      const assignmentId = (user as any)?.assignment_id;
      if (!assignmentId) {
        alert("No tienes una asignación activa");
        setLoading(false);
        return;
      }

      const regsRes = await registrationsService.getByAssignment(assignmentId);
      const regs = regsRes.data || [];
      const athleteRegs = regs.filter((r: any) => {
        const aid = r.athlete_id?._id || r.athlete_id;
        return aid?.toString?.() === found._id?.toString?.();
      });
      if (athleteRegs.length === 0) {
        alert("El atleta no está registrado en esta asignación");
        setLoading(false);
        return;
      }
      setRegistrations(athleteRegs);

      // Obtener info de grupos (monthly_fee)
      const groupIds = Array.from(
        new Set(athleteRegs.map((r: any) => r.group_id?._id || r.group_id)),
      );
      const infos: Record<string, any> = {};
      await Promise.all(
        groupIds.map(async (gid: string) => {
          try {
            const g = await groupsService.getById(gid);
            infos[gid] = g;
          } catch (e) {
            infos[gid] = { name: "-", monthly_fee: 0 };
          }
        }),
      );
      setGroupsInfo(infos);
    } catch (e) {
      console.error(e);
      alert("Error buscando atleta");
    } finally {
      setLoading(false);
    }
  };

  const openMonthModal = (reg: any) => {
    if (!reg.registration_pay) {
      alert("Debe pagar la matrícula antes de pagar la mensualidad");
      return;
    }
    setSelectedReg(reg);
    setSelectedMonth(null);
    setShowMonthModal(true);
    loadPaymentsForRegistration(reg);
  };

  const handlePayRegistration = async (reg: any) => {
    setSelectedRegistrationPay(reg);
    setPaymentAmount("");
    setShowPayModal(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedRegistrationPay || !paymentAmount) {
      alert("Por favor ingresa un monto");
      return;
    }

    setPayingRegistration(selectedRegistrationPay._id);
    try {
      const res = await registrationsService.update(
        selectedRegistrationPay._id,
        {
          registration_pay: new Date().toISOString(),
          registration_amount: parseFloat(paymentAmount),
        },
      );

      if (res.code === 200 || res.code === 201) {
        alert("Matrícula pagada");
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === selectedRegistrationPay._id
              ? {
                  ...r,
                  registration_pay: new Date().toISOString(),
                }
              : r,
          ),
        );
        setShowPayModal(false);
        setSelectedRegistrationPay(null);
        setPaymentAmount("");
      } else {
        alert("Error pagando matrícula");
      }
    } catch (e) {
      console.error(e);
      alert("Error pagando matrícula");
    } finally {
      setPayingRegistration(null);
    }
  };

  const getMonthDateRange = (monthIndex: number) => {
    if (selectedReg === null) return { start: "", end: "" };
    const registrationDate = selectedReg.registration_date
      ? new Date(selectedReg.registration_date)
      : new Date();

    const regDay = registrationDate.getDate();
    const regMonth = registrationDate.getMonth();
    const regYear = registrationDate.getFullYear();

    // Calcular mes y año del pago
    let paymentMonth = regMonth + monthIndex;
    let paymentYear = regYear;

    // Ajustar año si pasamos de 12 meses
    while (paymentMonth >= 12) {
      paymentMonth -= 12;
      paymentYear += 1;
    }

    // Fecha de inicio: día de registro en el mes de pago
    const startDate = new Date(paymentYear, paymentMonth, regDay);

    // Fecha de fin: día anterior a la fecha de inicio del mes siguiente
    const nextMonth = paymentMonth + 1 === 12 ? 0 : paymentMonth + 1;
    const nextYear = paymentMonth + 1 === 12 ? paymentYear + 1 : paymentYear;
    const endDate = new Date(nextYear, nextMonth, regDay - 1, 23, 59, 59);

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const yr = date.getFullYear();
      return `${day}/${month}/${yr}`;
    };

    return { start: formatDate(startDate), end: formatDate(endDate) };
  };

  const handlePayMonth = async (month: number) => {
    if (!selectedReg || month === null) return;

    const gid = selectedReg.group_id?._id || selectedReg.group_id;
    const aid = selectedReg.athlete_id?._id || selectedReg.athlete_id;
    const amt = groupsInfo[gid]?.monthly_fee ?? 0;

    if (!amt || isNaN(amt)) {
      alert("Monto inválido");
      return;
    }

    const registrationDate = selectedReg.registration_date
      ? new Date(selectedReg.registration_date)
      : new Date();

    const regDay = registrationDate.getDate();
    const regMonth = registrationDate.getMonth();
    const regYear = registrationDate.getFullYear();

    // Calcular mes y año del pago
    let paymentMonth = regMonth + month;
    let paymentYear = regYear;

    // Ajustar año si pasamos de 12 meses
    while (paymentMonth >= 12) {
      paymentMonth -= 12;
      paymentYear += 1;
    }

    // Fecha de inicio: día de registro en el mes de pago
    const paymentStart = new Date(paymentYear, paymentMonth, regDay);

    // Fecha de fin: día anterior a la fecha de inicio del mes siguiente
    const nextMonth = paymentMonth + 1 === 12 ? 0 : paymentMonth + 1;
    const nextYear = paymentMonth + 1 === 12 ? paymentYear + 1 : paymentYear;
    const paymentEnd = new Date(nextYear, nextMonth, regDay - 1, 23, 59, 59);

    if (
      !confirm(
        `Confirmar pago de ${amt} Bs para ${MONTH_NAMES[month]} en ${selectedReg.group_id?.name || "grupo"}?`,
      )
    )
      return;

    setPaying(selectedReg._id);
    try {
      const res = await paymentsService.create({
        amount: amt,
        group_id: gid,
        athlete_id: aid,
        payment_date: new Date().toISOString(),
        payment_start: paymentStart.toISOString(),
        payment_end: paymentEnd.toISOString(),
      });
      if (res.code === 200 || res.code === 201) {
        alert("Pago registrado");
        // actualizar estado local: agregar payment id a registration.monthly_payments
        const paymentId = res.data?._id || res.data?.id || res.data;
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === selectedReg._id
              ? {
                  ...r,
                  monthly_payments: [...(r.monthly_payments || []), paymentId],
                }
              : r,
          ),
        );
        setShowMonthModal(false);
      } else {
        alert("Error registrando pago");
      }
    } catch (e) {
      console.error(e);
      alert("Error registrando pago");
    } finally {
      setPaying(null);
    }
  };

  return (
    <>
      <NavHeader name="Pago de mensualidad" />
      <div className="wrapper wrapper-content">
        <div className="row">
          <div className="col-md-12">
            <div className="ibox">
              <div className="ibox-content">
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <input
                    placeholder="Buscar por CI, nombre o apellido"
                    className="form-control"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? "Buscando..." : "Buscar"}
                  </button>
                </div>

                {athlete && (
                  <div>
                    <div
                      style={{
                        marginBottom: 16,
                        padding: "15px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                        display: "flex",
                        gap: "15px",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Foto del atleta */}
                      <div>
                        {athlete.images?.medium ? (
                          <Image
                            src={athlete.images.medium}
                            alt="Atleta"
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "8px",
                              backgroundColor: "#ddd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#999",
                            }}
                          >
                            Sin foto
                          </div>
                        )}
                      </div>

                      {/* Datos personales */}
                      <div style={{ flex: 1 }}>
                        <p style={{ marginBottom: 8 }}>
                          <strong>Nombre:</strong> {athlete.name}{" "}
                          {athlete.lastname}
                        </p>
                        <p style={{ marginBottom: 8 }}>
                          <strong>CI:</strong> {athlete.ci || "-"}
                        </p>
                        <p style={{ marginBottom: 8 }}>
                          <strong>Teléfono:</strong> {athlete.phone || "-"}
                        </p>
                        <p style={{ marginBottom: 0 }}>
                          <strong>Género:</strong>{" "}
                          {GENDER[athlete.gender] || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Grupo</th>
                            <th>Mensualidad</th>
                            <th>Matrícula</th>
                            <th>Pagos registrados</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((r) => {
                            const gid = r.group_id?._id || r.group_id;
                            const g = groupsInfo[gid] || {};
                            const hasRegistrationPay =
                              r.registration_pay != null;
                            return (
                              <tr key={r._id}>
                                <td>{g.name || r.group_id?.name || "-"}</td>
                                <td>{(g.monthly_fee ?? 0).toString()} Bs</td>
                                <td>
                                  {hasRegistrationPay ? (
                                    <span style={{ color: "green" }}>
                                      ✓ Pagada
                                    </span>
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      ✗ No pagada
                                    </span>
                                  )}
                                </td>
                                <td>{(r.monthly_payments || []).length}</td>
                                <td className="text-center">
                                  {!hasRegistrationPay ? (
                                    <button
                                      className="btn btn-sm btn-warning"
                                      onClick={() => handlePayRegistration(r)}
                                      disabled={payingRegistration === r._id}
                                    >
                                      {payingRegistration === r._id
                                        ? "Procesando..."
                                        : "Pagar matrícula"}
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => openMonthModal(r)}
                                      disabled={paying === r._id}
                                    >
                                      {paying === r._id
                                        ? "Procesando..."
                                        : "Pagar mensualidad"}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de selección de mes */}
        {showMonthModal && selectedReg && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
            onClick={() => setShowMonthModal(false)}
          >
            <div
              className="modal-dialog"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "500px" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Seleccionar mes para pagar</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowMonthModal(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <p style={{ marginBottom: 16 }}>
                    <strong>Grupo:</strong> {selectedReg.group_id?.name || "-"}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 8,
                    }}
                  >
                    {MONTH_NAMES.map((monthName, idx) => {
                      // Obtener mes y año de registration_date
                      const registrationDate = selectedReg.registration_date
                        ? new Date(selectedReg.registration_date)
                        : new Date();
                      const regMonth = registrationDate.getMonth();
                      const regYear = registrationDate.getFullYear();
                      const currentYear = new Date().getFullYear();

                      // Calcular mes y año del pago para este índice
                      let paymentMonth = regMonth + idx;
                      let paymentYear = regYear;
                      while (paymentMonth >= 12) {
                        paymentMonth -= 12;
                        paymentYear += 1;
                      }

                      // Desactivar meses antes del mes de registro
                      const isBeforeRegistration =
                        idx < regMonth && regYear === currentYear;

                      // El mes está disponible si es >= mes de registro y <= mes actual
                      const isDisabled = isBeforeRegistration;

                      // Verificar si este mes específico está pagado
                      const payments = paymentsMap[selectedReg._id] || [];
                      const isMonthPaid = payments.some((p: any) => {
                        const payStart = new Date(p.payment_start);
                        const startMonth = payStart.getMonth();
                        const startYear = payStart.getFullYear();
                        return (
                          startMonth === paymentMonth &&
                          startYear === paymentYear
                        );
                      });

                      return (
                        <button
                          key={idx}
                          className={`btn btn-sm ${
                            isDisabled || isMonthPaid
                              ? "btn-secondary"
                              : selectedMonth === idx
                                ? "btn-primary"
                                : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            !isDisabled && !isMonthPaid && setSelectedMonth(idx)
                          }
                          disabled={isDisabled || isMonthPaid}
                          title={
                            isDisabled
                              ? "Anterior a la fecha de registro"
                              : isMonthPaid
                                ? "Mes pagado"
                                : ""
                          }
                        >
                          {isMonthPaid
                            ? `${monthName.slice(0, 3)} - Pagado`
                            : monthName.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    {selectedMonth !== null && (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#e3f2fd",
                          borderRadius: "4px",
                        }}
                      >
                        <p style={{ marginBottom: 8 }}>
                          <strong>Mes seleccionado:</strong>{" "}
                          {MONTH_NAMES[selectedMonth]}
                        </p>
                        <p style={{ marginBottom: 0 }}>
                          <strong>Período de cobertura:</strong>{" "}
                          {getMonthDateRange(selectedMonth).start} a{" "}
                          {getMonthDateRange(selectedMonth).end}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setShowMonthModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      selectedMonth !== null && handlePayMonth(selectedMonth)
                    }
                    disabled={
                      selectedMonth === null || paying === selectedReg._id
                    }
                  >
                    {paying === selectedReg._id
                      ? "Procesando..."
                      : "Confirmar pago"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Pago de Matrícula */}
        {showPayModal && selectedRegistrationPay && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
            onClick={() => setShowPayModal(false)}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Registrar Pago de Matrícula</h4>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setShowPayModal(false)}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div style={{ marginBottom: "15px" }}>
                    <p>
                      <strong>Atleta:</strong>{" "}
                      {selectedRegistrationPay.athlete_id?.name}{" "}
                      {selectedRegistrationPay.athlete_id?.lastname}
                    </p>
                    <p>
                      <strong>Club/Grupo:</strong>{" "}
                      {selectedRegistrationPay.group_id?.name}
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
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "3px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                      min="0"
                      step="0.01"
                      disabled={
                        payingRegistration === selectedRegistrationPay._id
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => setShowPayModal(false)}
                    disabled={
                      payingRegistration === selectedRegistrationPay._id
                    }
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleProcessPayment}
                    disabled={
                      payingRegistration === selectedRegistrationPay._id
                    }
                  >
                    {payingRegistration === selectedRegistrationPay._id ? (
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MonthlyPayments;
