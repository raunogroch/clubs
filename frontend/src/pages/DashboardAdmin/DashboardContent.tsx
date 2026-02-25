import { useMemo, useEffect } from "react";
import {
  useDashboardData,
  usePaymentModal,
  useDateEditing,
} from "../../customHooks/useDashboardAdmin";
import { PaymentModal } from "../../components/modals/Payment.modal";
import { RegistrationsTable } from "../../components/RegistrationsTable";
import { useUnpaidModal } from "../../customHooks/useDashboardAdmin";

export const DashboardContent = ({ user }: { user: any | undefined }) => {
  const { loading, totalAthletes, unpaidCount, breakdown } =
    useDashboardData(user);
  const { unpaidAthletes, unpaidLoading, handleOpenUnpaidModal } =
    useUnpaidModal(user);
  const {
    showPayModal,
    selectedRegistration,
    paymentAmount,
    payingId,
    handleOpenPayModal,
    handleClosePayModal,
    setPaymentAmount,
    setPayingId,
  } = usePaymentModal();
  const {
    editingDateId,
    editingDateValue,
    savingDateId,
    handleEditDate,
    handleCancelDateEdit,
    setEditingDateValue,
    setSavingDateId,
  } = useDateEditing();

  // Load unpaid athletes when component mounts
  useEffect(() => {
    handleOpenUnpaidModal();
  }, [handleOpenUnpaidModal, user?.assignment_id]);

  // Calcular estadísticas para las tarjetas
  const totalClubs = useMemo(() => {
    return breakdown?.clubs?.length || 0;
  }, [breakdown]);

  const percentageIncrease = useMemo(() => {
    if (!totalAthletes || totalAthletes === 0) return 0;
    return Math.round((unpaidCount / totalAthletes) * 100);
  }, [totalAthletes, unpaidCount]);

  const paidCount = totalAthletes - unpaidCount;

  // Handler para guardar fecha
  const handleSaveDate = async (regId: string) => {
    setSavingDateId(regId);
    try {
      const registrationService = (
        await import("../../services/registrationsService.ts")
      ).registrationsService;
      const res = await registrationService.update(regId, {
        registration_date: editingDateValue,
      });

      if (res.code === 200) {
        // Recargar lista
        await handleOpenUnpaidModal();
        handleCancelDateEdit();
      }
    } catch (e) {
      console.error("Error al guardar la fecha:", e);
    } finally {
      setSavingDateId(null);
    }
  };

  // Handler para procesar pago
  const handleProcessPayment = async () => {
    if (!selectedRegistration || !paymentAmount) {
      alert("Por favor ingresa un monto");
      return;
    }

    setPayingId(selectedRegistration._id);
    try {
      const registrationService = (
        await import("../../services/registrationsService.ts")
      ).registrationsService;
      const now = new Date();

      const res = await registrationService.update(selectedRegistration._id, {
        registration_pay: now.toISOString(),
        registration_amount: parseFloat(paymentAmount),
      });

      if (res.code === 200) {
        alert("Pago registrado exitosamente");
        handleClosePayModal();
        await handleOpenUnpaidModal();
      }
    } catch (e) {
      console.error("Error al procesar el pago:", e);
      alert("Error al procesar el pago");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="middle-box text-center animated fadeInRightBig">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <div className="wrapper wrapper-content">
        <div className="animated fadeInRightBig">
          {/* Cards con estadísticas principales */}
          <div className="row">
            <div className="col-lg-3">
              <div className="ibox">
                <div className="ibox-title">
                  <span className="label label-success float-right">Total</span>
                  <h5>Registros</h5>
                </div>
                <div className="ibox-content">
                  <h1 className="no-margins">{totalAthletes}</h1>
                  <div className="stat-percent font-bold text-success">
                    100% <i className="fa fa-check"></i>
                  </div>
                  <small>Total de atletas registrados</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox">
                <div className="ibox-title">
                  <span className="label label-info float-right">
                    Pendiente
                  </span>
                  <h5>Matrículas</h5>
                </div>
                <div className="ibox-content">
                  <h1 className="no-margins">{unpaidCount}</h1>
                  <div className="stat-percent font-bold text-info">
                    {percentageIncrease}% <i className="fa fa-level-down"></i>
                  </div>
                  <small>Atletas sin matrícula</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox">
                <div className="ibox-title">
                  <span className="label label-primary float-right">
                    Activos
                  </span>
                  <h5>Inscritos</h5>
                </div>
                <div className="ibox-content">
                  <h1 className="no-margins">{paidCount}</h1>
                  <div className="stat-percent font-bold text-navy">
                    {totalAthletes > 0
                      ? Math.round((paidCount / totalAthletes) * 100)
                      : 0}
                    %<i className="fa fa-level-up"></i>
                  </div>
                  <small>Atletas con matrícula pagada</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="ibox">
                <div className="ibox-title">
                  <span className="label label-danger float-right">Clubes</span>
                  <h5>Gestión</h5>
                </div>
                <div className="ibox-content">
                  <h1 className="no-margins">{totalClubs}</h1>
                  <div className="stat-percent font-bold text-danger">
                    - <i className="fa fa-briefcase"></i>
                  </div>
                  <small>Clubes administrados</small>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de órdenes/registros */}
          <div className="row">
            <div className="col-lg-12">
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Resumen de Matrículas</h5>
                  <div className="float-right">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-xs btn-white active"
                      >
                        Total
                      </button>
                      <button type="button" className="btn btn-xs btn-white">
                        Pagados
                      </button>
                      <button type="button" className="btn btn-xs btn-white">
                        Pendientes
                      </button>
                    </div>
                  </div>
                </div>
                <div className="ibox-content">
                  <div className="row">
                    <div className="col-lg-9">
                      <div className="alert alert-info">
                        <i className="fa fa-info-circle"></i> Resumen del estado
                        de matrículas de atletas en tu asignación.
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <ul className="stat-list">
                        <li>
                          <h2 className="no-margins">{totalAthletes}</h2>
                          <small>Total de atletas</small>
                          <div className="stat-percent">100%</div>
                          <div className="progress progress-mini">
                            <div
                              style={{ width: "100%" }}
                              className="progress-bar"
                            ></div>
                          </div>
                        </li>
                        <li>
                          <h2 className="no-margins">{paidCount}</h2>
                          <small>Atletas pagados</small>
                          <div className="stat-percent">
                            {totalAthletes > 0
                              ? Math.round((paidCount / totalAthletes) * 100)
                              : 0}
                            %
                          </div>
                          <div className="progress progress-mini">
                            <div
                              style={{
                                width:
                                  totalAthletes > 0
                                    ? `${(paidCount / totalAthletes) * 100}%`
                                    : "0%",
                              }}
                              className="progress-bar"
                            ></div>
                          </div>
                        </li>
                        <li>
                          <h2 className="no-margins">{unpaidCount}</h2>
                          <small>Atletas no pagados</small>
                          <div className="stat-percent">
                            {percentageIncrease}%
                          </div>
                          <div className="progress progress-mini">
                            <div
                              style={{
                                width: `${percentageIncrease}%`,
                              }}
                              className="progress-bar progress-bar-danger"
                            ></div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Atletas Registrados */}
          <div className="row">
            <div className="col-lg-12">
              <RegistrationsTable
                athletes={unpaidAthletes}
                loading={unpaidLoading}
                editingDateId={editingDateId}
                editingDateValue={editingDateValue}
                savingDateId={savingDateId}
                onEditDate={(reg) => {
                  const date = new Date(reg.registration_date);
                  const year = date.getUTCFullYear();
                  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                  const day = String(date.getUTCDate()).padStart(2, "0");
                  const localDate = `${year}-${month}-${day}`;
                  handleEditDate(reg._id, localDate);
                }}
                onSaveDate={handleSaveDate}
                onCancelEdit={handleCancelDateEdit}
                onEditDateValue={setEditingDateValue}
                onOpenPayModal={handleOpenPayModal}
              />
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayModal}
        registration={selectedRegistration}
        paymentAmount={paymentAmount}
        payingId={payingId}
        onClose={handleClosePayModal}
        onAmountChange={setPaymentAmount}
        onProcessPayment={handleProcessPayment}
      />
    </>
  );
};
