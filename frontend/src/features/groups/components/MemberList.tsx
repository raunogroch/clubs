/**
 * Componente para mostrar lista de miembros (Coaches o Athletes)
 *
 * Presenta los miembros de un grupo de forma ordenada
 */

import { Button } from "../../../components";

const MESSAGES = {
  NO_MEMBERS: "Sin miembros asignados",
  BUTTON_ADD: "Agregar",
  REMOVE_TOOLTIP: "Remover",
};

export const MemberList = ({
  title,
  icon,
  members,
  memberDetails,
  memberCount,
  onAddMember,
  onRemoveMember,
  isLoading = false,
  rowClassName = "col-md-6",
  registrationInfo = {},
  type = "athlete",
}) => {
  // Infer type from registrationInfo if not provided
  const memberType =
    type || (Object.keys(registrationInfo).length > 0 ? "athlete" : "coach");

  return (
    <div className={rowClassName}>
      <div className="ibox">
        <div className="ibox-title d-flex justify-content-between align-items-center">
          <div>
            <i className={`fa ${icon}`}></i> {title}
          </div>
          <div>
            <Button
              className="btn btn-xs btn-success "
              onClick={onAddMember}
              disabled={isLoading}
              icon="fa-plus"
            >
              {MESSAGES.BUTTON_ADD}
            </Button>
          </div>
        </div>

        <div className="ibox-content">
          <div className="members-list table-responsive">
            {memberCount === 0 ? (
              <p className="text-muted">
                <em>{MESSAGES.NO_MEMBERS}</em>
              </p>
            ) : (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    {memberType === "coach" ? (
                      <>
                        <th>Nombre Completo</th>
                        <th>Carnet</th>

                        <th
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          Acciones
                        </th>
                      </>
                    ) : (
                      <>
                        <th>Nombre Completo</th>
                        <th>Carnet</th>
                        <th
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          Matrícula
                        </th>
                        <th
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          Acciones
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => {
                    const memberId =
                      typeof member === "string" ? member : (member as any)._id;
                    const memberDetail = memberDetails[memberId];
                    const regInfo = registrationInfo[memberId];
                    const hasRegistrationInfo = regInfo !== undefined;
                    const isPaid = regInfo && regInfo.registration_pay != null;

                    if (!memberDetail) return null;

                    // Coach view: CI, Nombre Completo, Acciones
                    if (memberType === "coach") {
                      return (
                        <tr key={memberId}>
                          <td style={{ verticalAlign: "middle" }}>
                            <strong>
                              {memberDetail.lastname}, {memberDetail.name}
                            </strong>
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {memberDetail.ci || "-"}
                          </td>
                          <td
                            className="text-center"
                            style={{ verticalAlign: "middle" }}
                          >
                            <Button
                              className="btn btn-xs btn-danger "
                              onClick={() => onRemoveMember(memberId)}
                              disabled={isLoading}
                              icon="fa-trash"
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    }

                    // Athlete view: Nombre, Apellido, CI, Matrícula, Acciones
                    return (
                      <tr key={memberId}>
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>
                            {memberDetail.lastname}, {memberDetail.name}
                          </strong>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {memberDetail.ci || "-"}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {hasRegistrationInfo ? (
                            isPaid ? (
                              <i
                                className="fa fa-check-circle"
                                style={{ color: "green" }}
                                title="Matrícula pagada"
                              ></i>
                            ) : (
                              <span>Pendiente</span>
                            )
                          ) : (
                            <span className="label label-default">N/A</span>
                          )}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {hasRegistrationInfo && !isPaid && (
                            <Button
                              className="btn btn-xs btn-danger "
                              onClick={() => onRemoveMember(memberId)}
                              disabled={isLoading}
                              icon="fa-trash"
                            >
                              Eliminar
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
