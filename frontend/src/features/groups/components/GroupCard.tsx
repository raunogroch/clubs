/**
 * Componente para mostrar una tarjeta de grupo expandible
 *
 * Muestra la información básica del grupo y permite expandir para ver detalles
 */

import React from "react";
import type { Group } from "../types";
import { formatPrice } from "../utils";

interface GroupCardProps {
  group: Group;
  isExpanded: boolean;
  isLoading?: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isExpanded,
  isLoading = false,
  onToggleExpand,
  onEdit,
  onDelete,
  children,
}) => {
  const createdDate = new Date(group.createdAt).toLocaleDateString("es-ES");

  return (
    <div className="ibox">
      <div className="ibox-title">
        <div className="row w-100" style={{ margin: 0 }}>
          <div className="col-md-8">
            {/* Botón expandible */}
            <button
              className="group-toggle-btn"
              onClick={onToggleExpand}
              disabled={isLoading}
            >
              <i
                className={`fa ${
                  isExpanded ? "fa-chevron-down" : "fa-chevron-right"
                } chevron-icon`}
              ></i>
              <h4>
                <strong>{group.name}</strong>{" "}
                <span className="ml-3">
                  <i className="fa fa-users"></i> {group.athletes?.length || 0}{" "}
                  Atletas registrados
                </span>
              </h4>
            </button>

            {/* Descripción */}
            <div>
              <small className="text-muted">
                {group.description || "Sin descripción"}
              </small>
            </div>

            {/* Precio mensual */}
            {group.monthly_fee !== undefined && group.monthly_fee > 0 && (
              <div className="mt-1">
                <small className="badge badge-info">
                  <i className="fa fa-money"></i>{" "}
                  {formatPrice(group.monthly_fee)}/mes
                </small>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="ibox-tools">
            <button
              className="btn btn-primary btn-xs"
              onClick={onEdit}
              title="Editar grupo"
              disabled={isLoading}
            >
              <i className="fa fa-edit"></i>
            </button>{" "}
            <button
              className="btn btn-danger btn-xs"
              onClick={onDelete}
              title="Eliminar grupo"
              disabled={isLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="ibox-content">
          {children}

          {/* Footer con fecha de creación */}
          <div className="row mt-3">
            <div className="col-md-12">
              <small className="text-muted">Creado: {createdDate}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
