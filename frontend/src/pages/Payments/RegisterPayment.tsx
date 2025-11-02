import React, { useState } from "react";
import { NavHeader } from "../../components";
import { AthleteSearch } from "./components/AthleteSearch";
import { ClubsList } from "./components/ClubsList";
import { MonthsStatus } from "./components/MonthsStatus";
import { PaymentForm } from "./components/PaymentForm";
import api from "../../services/api";
import toastr from "toastr";
import "./payments.css";
import type { Athlete, Club, Payment } from "./IPayments";
import type { ApiResponse } from "../../utils/apiUtils";

export const RegisterPayment: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleSelectAthlete = async (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setSelectedClub(null);
    try {
      const res = await api.get(`/users/${athlete._id}/clubs-groups`);
      const data = res.data;
      // backend returns clubs with groups; try to extract clubs array
      const clubsList = data?.clubs || data || [];
      setClubs(clubsList);
      if (!clubsList || clubsList.length === 0) {
        toastr.info("El atleta no está inscrito en ningún club");
      }
    } catch (err) {
      toastr.error("Error al obtener los clubes del atleta");
      setClubs([]);
    }
  };

  const handlePaymentDone = (res?: ApiResponse<Payment>) => {
    if (res && res.code && res.code >= 200 && res.code < 300) {
      toastr.success("Pago registrado correctamente");
      // reset
      setSelectedAthlete(null);
      setSelectedClub(null);
      setClubs([]);
    } else {
      toastr.error((res && res.message) || "Error al registrar pago");
    }
  };

  return (
    <div>
      <NavHeader name="Registrar pago" />
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row register-payment-row">
          <div className="col-md-4">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Buscar atleta</h5>
              </div>
              <div className="ibox-content">
                <AthleteSearch onSelect={handleSelectAthlete} />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Clubs inscritos</h5>
              </div>
              <div className="ibox-content">
                {selectedAthlete ? (
                  <>
                    <ClubsList
                      clubs={clubs}
                      onSelect={(c) => setSelectedClub(c)}
                    />
                  </>
                ) : (
                  <div>Selecciona un atleta para ver sus clubes</div>
                )}
              </div>
            </div>
            {selectedClub && (
              <div className="ibox">
                <div className="ibox-title">
                  <h5>Meses pagados</h5>
                </div>
                <div className="ibox-content">
                  <MonthsStatus
                    athlete={selectedAthlete}
                    club={selectedClub}
                    onSelectMonth={(m: string) => setSelectedMonth(m)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <div className="ibox">
              <div className="ibox-title">
                <h5>Registrar pago</h5>
              </div>
              <div className="ibox-content">
                {selectedAthlete && selectedClub ? (
                  <PaymentForm
                    athlete={selectedAthlete}
                    club={selectedClub}
                    onDone={handlePaymentDone}
                    selectedMonth={selectedMonth ?? undefined}
                    onMonthChange={(m: string) => setSelectedMonth(m)}
                  />
                ) : (
                  <div>Selecciona atleta y club para registrar un pago</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
