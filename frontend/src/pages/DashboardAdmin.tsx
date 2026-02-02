import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import type { RootState } from "../store/store";
import { NavHeader } from "../components/NavHeader";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  addMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { pageParamProps } from "../interfaces/pageParamProps";
import { registrationsService } from "../services/registrationsService";
import clubsService from "../services/clubs.service";
import groupsService from "../services/groups.service";

export const DashboardAdmin = ({ name }: pageParamProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Verificar si el admin tiene assignment_id
  const hasAssignment =
    user?.role === "admin"
      ? (user as any)?.assignment_id !== null &&
        (user as any)?.assignment_id !== undefined
      : true; // Superadmin y otros roles siempre tienen acceso

  // Si es admin sin assignment_id, mostrar mensaje especial
  if (user?.role === "admin" && !hasAssignment) {
    return (
      <>
        <NavHeader name={name} />
        <div className="wrapper wrapper-content">
          <div className="middle-box text-center animated fadeInRightBig">
            <h3 className="font-bold text-warning">⚠️ Sin Asignación</h3>
            <div className="error-desc">
              <p>
                Aún no has sido asignado a ningún módulo. Por favor, ponte en
                contacto con el superadministrador para que te asigne a los
                módulos correspondientes.
              </p>
              <p className="text-muted m-t-md">
                Una vez que seas asignado, tendrás acceso a la sección de
                Usuarios y otras funcionalidades.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader name={name} />
      <DashboardAssignments user={user} />
    </>
  );
};

const calculateTotalAthletes = (breakdown: any): number => {
  if (!breakdown?.clubs) return 0;
  return breakdown.clubs.reduce((total: number, club: any) => {
    return (
      total +
      (club.groups || []).reduce(
        (gTotal: number, group: any) => gTotal + (group.athleteCount || 0),
        0,
      )
    );
  }, 0);
};

const calculateUnpaidAthletes = (breakdown: any): number => {
  if (!breakdown?.clubs) return 0;
  return breakdown.clubs.reduce((totalUnpaid: number, club: any) => {
    return (
      totalUnpaid +
      (club.groups || []).reduce(
        (clubUnpaid: number, group: any) =>
          clubUnpaid + (group.unpaidCount || 0),
        0,
      )
    );
  }, 0);
};

const DashboardAssignments = ({ user }: { user: any }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<any>>([]);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [unpaidAthletes, setUnpaidAthletes] = useState<Array<any>>([]);
  const [unpaidLoading, setUnpaidLoading] = useState(false);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editingDateValue, setEditingDateValue] = useState<string>("");
  const [savingDateId, setSavingDateId] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [payingId, setPayingId] = useState<string | null>(null);
  // Calendar state for react-big-calendar
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    addDays,
    addMonths,
    locales: { es },
  });

  const formats = {
    dateFormat: "dd",
    dayFormat: "EEE dd",
    weekdayFormat: "EEE",
    monthHeaderFormat: "MMMM yyyy",
    dayHeaderFormat: "EEEE dd MMMM",
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`,
    agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`,
    agendaDateFormat: "EEE MMM dd",
    agendaTimeFormat: "HH:mm",
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "HH:mm", { locale: es })} - ${format(end, "HH:mm", { locale: es })}`,
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "HH:mm", { locale: es })} - ${format(end, "HH:mm", { locale: es })}`,
  };

  const messages = {
    today: "Hoy",
    previous: "Atrás",
    next: "Siguiente",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este rango",
    showMore: (total: number) => `+${total} más`,
  };

  const [calendarGroups, setCalendarGroups] = useState<any[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userService = (await import("../services/userService.ts"))
        .userService;

      // Ejecutar ambas llamadas en paralelo para reducir tiempo de espera
      try {
        const [res, breakdownRes] = await Promise.all([
          userService.getUnpaidByAssignment(),
          userService.getAthletesBreakdownByAssignment(),
        ]);

        if (res?.code === 200) setItems(res.data || []);
        else setItems([]);

        if (breakdownRes?.code === 200) setBreakdown(breakdownRes.data);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Load groups and build calendar events for the assignment
  useEffect(() => {
    const loadGroupsForCalendar = async () => {
      setCalendarLoading(true);
      try {
        const assignmentId = (user as any)?.assignment_id;
        if (!assignmentId) {
          setCalendarGroups([]);
          return;
        }

        const clubs = await clubsService.getAll();
        // Filter clubs by assignment_id if available on club
        const myClubs = clubs.filter(
          (c: any) => c.assignment_id === assignmentId,
        );
        const groupsPerClub = await Promise.all(
          myClubs.map(async (c: any) => {
            try {
              const gs = await groupsService.getByClub(c._id);
              return gs.map((g: any) => ({ ...g, club: c }));
            } catch (e) {
              return [];
            }
          }),
        );

        const allGroups = groupsPerClub.flat();
        setCalendarGroups(allGroups);
      } catch (e) {
        setCalendarGroups([]);
      } finally {
        setCalendarLoading(false);
      }
    };

    loadGroupsForCalendar();
  }, [user]);

  // Memoizar cálculos costosos para evitar recalcular en cada render
  const totalAthletes = useMemo(
    () => calculateTotalAthletes(breakdown),
    [breakdown],
  );
  const unpaidCount = useMemo(
    () => calculateUnpaidAthletes(breakdown),
    [breakdown],
  );

  // Cargar registrations para el modal
  const handleOpenUnpaidModal = async () => {
    setShowUnpaidModal(true);
    setUnpaidLoading(true);

    try {
      const assignmentId = (user as any)?.assignment_id;
      if (!assignmentId) {
        setUnpaidAthletes([]);
        setUnpaidLoading(false);
        return;
      }

      const res =
        await registrationsService.getUnpaidByAssignment(assignmentId);
      if (res.code === 200) {
        setUnpaidAthletes(res.data || []);
      } else {
        setUnpaidAthletes([]);
      }
    } catch (e) {
      setUnpaidAthletes([]);
    } finally {
      setUnpaidLoading(false);
    }
  };

  const formatDateLocal = (dateString: string): string => {
    if (!dateString) return "-";

    // Parsing UTC date string para obtener componentes UTC
    const date = new Date(dateString);

    // Obtener componentes en UTC (no local)
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = date.toLocaleDateString("es-ES", { month: "long" });
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleEditDate = (reg: any) => {
    const date = new Date(reg.registration_date);
    // Usar UTC para obtener la fecha correcta
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;
    setEditingDateId(reg._id);
    setEditingDateValue(localDate);
  };

  const handleSaveDate = async (regId: string) => {
    setSavingDateId(regId);
    try {
      const registrationService = (
        await import("../services/registrationsService.ts")
      ).registrationsService;

      // Enviar la fecha como string YYYY-MM-DD para evitar problemas de zona horaria
      const res = await registrationService.update(regId, {
        registration_date: editingDateValue,
      });

      if (res.code === 200) {
        // Actualizar la lista local
        setUnpaidAthletes(
          unpaidAthletes.map((r: any) =>
            r._id === regId ? { ...r, registration_date: editingDateValue } : r,
          ),
        );
        setEditingDateId(null);
        setEditingDateValue("");
      }
    } catch (e) {
      console.error("Error al guardar la fecha:", e);
    } finally {
      setSavingDateId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingDateId(null);
    setEditingDateValue("");
  };

  const handleOpenPayModal = (reg: any) => {
    setSelectedRegistration(reg);
    setPaymentAmount("");
    setShowPayModal(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedRegistration || !paymentAmount) {
      alert("Por favor ingresa un monto");
      return;
    }

    setPayingId(selectedRegistration._id);
    try {
      const registrationService = (
        await import("../services/registrationsService.ts")
      ).registrationsService;

      // Obtener la fecha y hora actual en formato ISO
      const now = new Date();

      const res = await registrationService.update(selectedRegistration._id, {
        registration_pay: now.toISOString(),
        registration_amount: parseFloat(paymentAmount),
      });

      if (res.code === 200) {
        // Actualizar la lista local
        setUnpaidAthletes(
          unpaidAthletes.filter((r: any) => r._id !== selectedRegistration._id),
        );
        setShowPayModal(false);
        setSelectedRegistration(null);
        setPaymentAmount("");
        alert("Pago registrado exitosamente");
      }
    } catch (e) {
      console.error("Error al procesar el pago:", e);
      alert("Error al procesar el pago");
    } finally {
      setPayingId(null);
    }
  };

  // --- ProCalendar (reusing the same react-big-calendar setup as ScheduleCoach) ---
  interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource?: {
      club: string;
      group: string;
    };
  }

  const dayNameMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const ProCalendar = ({ groups }: { groups: any[] }) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<"month" | "week" | "day" | "agenda">(
      "week",
    );

    useEffect(() => {
      const calendarEvents: CalendarEvent[] = [];
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });

      groups.forEach((group) => {
        if (group.schedule && group.schedule.length > 0) {
          group.schedule.forEach((sched: any) => {
            const [startHour, startMin] = sched.startTime
              .split(":")
              .map(Number);
            const [endHour, endMin] = sched.endTime.split(":").map(Number);

            // Filtrar horarios entre 12:00 y 14:00 (misma lógica que ScheduleCoach)
            if (
              (startHour >= 12 && startHour < 14) ||
              (endHour > 12 && endHour <= 14)
            ) {
              return;
            }

            const dayOffset = dayNameMap[sched.day] || 0;
            const eventDate = new Date(weekStart);
            eventDate.setDate(
              eventDate.getDate() + (dayOffset === 0 ? 6 : dayOffset - 1),
            );

            const startTime = new Date(eventDate);
            startTime.setHours(startHour, startMin, 0, 0);

            const endTime = new Date(eventDate);
            endTime.setHours(endHour, endMin, 0, 0);

            calendarEvents.push({
              id: `${group._id}-${sched.day}-${sched.startTime}`,
              title: group.name,
              start: startTime,
              end: endTime,
              resource: {
                club: group.club?.name || "",
                group: group.name,
              },
            });
          });
        }
      });

      setEvents(calendarEvents);
    }, [groups, date]);

    const eventStyleGetter = (event: CalendarEvent) => {
      const colors = [
        "#3174ad",
        "#f50057",
        "#ff9800",
        "#4caf50",
        "#2196f3",
        "#9c27b0",
      ];
      const backgroundColor = colors[event.title.charCodeAt(0) % colors.length];

      return {
        style: {
          backgroundColor,
          borderRadius: "5px",
          opacity: 0.8,
          color: "white",
          border: "0px",
          display: "block",
        },
      };
    };

    return (
      <div className="mb-4">
        <div style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            view={view}
            onView={(v: any) => setView(v)}
            date={date}
            onNavigate={(d: any) => setDate(d)}
            defaultView="week"
            eventPropGetter={eventStyleGetter}
            popup
            selectable
            min={new Date(2024, 0, 1, 8, 0, 0)}
            max={new Date(2024, 0, 1, 22, 0, 0)}
            step={30}
            showMultiDayTimes
            views={["month", "week", "day", "agenda"]}
            culture="es"
            formats={formats}
            messages={messages}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="middle-box text-center animated fadeInRightBig">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="middle-box text-center animated fadeInRightBig">
        <h5>No hay datos disponibles</h5>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper wrapper-content">
        <div className="animated fadeInRightBig">
          <div className="row">
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Atletas inscritos</h5>
                </div>
                <div className="ibox-content text-center">
                  <h2 className="font-bold text-primary">{totalAthletes}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Atletas sin matricula</h5>
                  <div className="ibox-tools">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={handleOpenUnpaidModal}
                      title="Ver atletas sin pago"
                    >
                      <i className="fa fa-list"></i> Ver lista
                    </button>
                  </div>
                </div>
                <div className="ibox-content text-center">
                  <h2 className="font-bold text-danger">{unpaidCount}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendario (react-big-calendar) */}
      <div className="wrapper wrapper-content">
        <div className="animated fadeInRightBig">
          <div className="row">
            <div className="col-md-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Calendario de Horarios de Grupos</h5>
                </div>
                <div className="ibox-content">
                  {calendarLoading ? (
                    <div className="text-center">Cargando calendario...</div>
                  ) : calendarGroups.length === 0 ? (
                    <div className="text-center text-muted">
                      No hay grupos con horarios en esta asignación.
                    </div>
                  ) : (
                    <ProCalendar groups={calendarGroups} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Atletas sin pago */}
      {showUnpaidModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={() => setShowUnpaidModal(false)}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Atletas registrados</h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowUnpaidModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {unpaidLoading ? (
                  <div className="text-center">
                    <p>Cargando registrations...</p>
                  </div>
                ) : unpaidAthletes.length === 0 ? (
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
                          <th className="text-center">
                            Inscripción del atleta
                          </th>
                          <th className="text-center">Estado de pago</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unpaidAthletes.map((reg) => (
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
                                    onChange={(e) =>
                                      setEditingDateValue(e.target.value)
                                    }
                                    style={{
                                      padding: "5px",
                                      borderRadius: "3px",
                                      border: "1px solid #ccc",
                                      flex: 1,
                                    }}
                                  />
                                  <button
                                    className="btn btn-xs btn-success"
                                    onClick={() => handleSaveDate(reg._id)}
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
                                  </button>
                                  <button
                                    className="btn btn-xs btn-secondary"
                                    onClick={handleCancelEdit}
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
                                    <button
                                      className="btn btn-xs btn-warning"
                                      onClick={() => handleEditDate(reg)}
                                      title="Editar fecha de inscripción"
                                    >
                                      <i className="fa fa-edit"></i>
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="text-center">
                              {reg.registration_pay === null && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleOpenPayModal(reg)}
                                >
                                  Pagar matrícula
                                </button>
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
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setShowUnpaidModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago de Matrícula */}
      {showPayModal && selectedRegistration && (
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
                    {selectedRegistration.athlete_id?.name}{" "}
                    {selectedRegistration.athlete_id?.lastname}
                  </p>
                  <p>
                    <strong>Club/Grupo:</strong>{" "}
                    {selectedRegistration.group_id?.name}
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
                    disabled={payingId === selectedRegistration._id}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => setShowPayModal(false)}
                  disabled={payingId === selectedRegistration._id}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleProcessPayment}
                  disabled={payingId === selectedRegistration._id}
                >
                  {payingId === selectedRegistration._id ? (
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
    </>
  );
};
