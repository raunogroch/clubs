import { Button } from "../../../components";

export const GroupsTable = ({
  groups,
  onIngresar,
  onEdit,
  onDelete,
  isLoading = false,
  onCreateGroup,
}) => {
  return (
    <>
      <div
        className="ibox-title d-flex justify-content-between"
        style={{ alignItems: "center" }}
      >
        <h5 className="m-0">
          <i className="fa fa-sitemap"></i> Grupos
        </h5>
        <Button
          className="btn btn-xs btn-primary"
          icon="fa-plus"
          onClick={onCreateGroup}
          disabled={isLoading}
        >
          Crear Grupo
        </Button>
      </div>
      <div className="ibox">
        <div className="ibox-content">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Nombre del Grupo</th>
                  <th className="text-center">Atletas</th>
                  <th className="text-center">Entrenadores</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      <em>No hay grupos registrados</em>
                    </td>
                  </tr>
                ) : (
                  groups.map((group) => {
                    const athletesCount =
                      (group as any).athletes_added?.length ||
                      (group as any).athletes?.length ||
                      0;
                    const coachesCount = (group as any).coaches?.length || 0;

                    return (
                      <tr
                        key={group._id}
                        style={{ height: "var(--member-row-height)" }}
                      >
                        <td style={{ verticalAlign: "middle" }}>
                          <strong>{group.name || "Sin nombre"}</strong>
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {athletesCount}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          {coachesCount}
                        </td>
                        <td
                          className="text-center"
                          style={{ verticalAlign: "middle" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              className="btn btn-xs btn-success"
                              onClick={() => onIngresar(group)}
                              disabled={isLoading}
                              icon="fa-arrow-right"
                            >
                              Ingresar
                            </Button>
                            <Button
                              className="btn btn-xs btn-white"
                              onClick={() => onEdit(group)}
                              disabled={isLoading}
                              icon="fa-pencil"
                            >
                              Editar
                            </Button>
                            <Button
                              className="btn btn-xs btn-danger"
                              onClick={() => onDelete(group._id!)}
                              disabled={isLoading}
                              icon="fa-trash"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
