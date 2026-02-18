import { useEffect } from "react";
import { NavHeader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMyAthletes } from "../store/athletesThunk";

export const AthletesParent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myAthletes, loadingMyAthletes, error } = useSelector(
    (state: RootState) => state.athletes,
  );

  useEffect(() => {
    dispatch(fetchMyAthletes());
  }, [dispatch]);

  const calculateAge = (birthDate: string | Date) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < new Date(birth).getDate())
    ) {
      age--;
    }
    return age;
  };

  const getGenderLabel = (gender?: string) => {
    if (gender === "male") return "Masculino";
    if (gender === "female") return "Femenino";
    return "N/A";
  };

  return (
    <div>
      <NavHeader name="Mis Atletas" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-content">
            {loadingMyAthletes ? (
              <div className="text-center">
                <p>Cargando atletas...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <p>{error}</p>
              </div>
            ) : myAthletes.length === 0 ? (
              <div className="alert alert-info">
                <p>No tienes atletas registrados.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cédula</th>
                      <th>Edad</th>
                      <th>Género</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myAthletes.map((athlete) => (
                      <tr key={athlete._id}>
                        <td>
                          <strong>
                            {athlete.name} {athlete.lastname}
                          </strong>
                        </td>
                        <td>{athlete.ci || "N/A"}</td>
                        <td>{calculateAge(athlete.birth_date || "")}</td>
                        <td>{getGenderLabel(athlete.gender)}</td>
                        <td>
                          {athlete.active ? (
                            <span className="badge badge-success">Activo</span>
                          ) : (
                            <span className="badge badge-danger">Inactivo</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
