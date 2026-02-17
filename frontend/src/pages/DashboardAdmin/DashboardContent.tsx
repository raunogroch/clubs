import {
  useDashboardData,
  useUnpaidModal,
  usePaymentModal,
  useDateEditing,
} from "../../customHooks/useDashboardAdmin";
import { UnpaidModal } from "../../components/modals/Unpaid.modal";
import { PaymentModal } from "../../components/modals/Payment.modal";

export const DashboardContent = ({ user }: { user: any | undefined }) => {
  const { loading, totalAthletes, unpaidCount } = useDashboardData(user);
  const {
    showUnpaidModal,
    unpaidAthletes,
    unpaidLoading,
    handleOpenUnpaidModal,
    handleCloseUnpaidModal,
  } = useUnpaidModal(user);
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
        // Re-open modal to refresh
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

      <UnpaidModal
        isOpen={showUnpaidModal}
        loading={unpaidLoading}
        athletes={unpaidAthletes}
        editingDateId={editingDateId}
        editingDateValue={editingDateValue}
        savingDateId={savingDateId}
        onClose={handleCloseUnpaidModal}
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
