import React from "react";
import type { Group } from "../types";

interface Props {
  group: Partial<Group> & { _id?: string };
  onIngresar: () => void; // navegar al detalle
  onEdit: () => void;
  onDelete: () => void;
}

export const GroupCardSimple: React.FC<Props> = ({
  group,
  onIngresar,
  onEdit,
  onDelete,
}) => {
  const athletesCount =
    (group as any).athletes_added?.length ||
    (group as any).athletes?.length ||
    0;
  const coachesCount = (group as any).coaches?.length || 0;

  return (
    <div className="col-lg-4 mb-3">
      <div
        className="widget-head-color-box navy-bg p-lg text-center"
        style={{ position: "relative" }}
      >
        <div className="m-b-md">
          <h2 className="font-bold no-margins">{group.name || "Sin nombre"}</h2>
        </div>
        <div>
          <span>{athletesCount} Atletas</span> |
          <span> {coachesCount} Entrenadores</span>
        </div>
      </div>

      <div className="widget-text-box">
        <div className="justify-content-between d-flex align-items-center">
          <button className="btn btn-success btn-xs" onClick={onIngresar}>
            Ingresar
          </button>

          <div>
            <button
              className="btn btn-xs btn-white"
              onClick={onEdit}
              style={{ marginRight: 8 }}
            >
              <i className="fa fa-pencil"></i> editar
            </button>
            <button className="btn btn-xs btn-danger" onClick={onDelete}>
              <i className="fa fa-trash"></i> eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCardSimple;
