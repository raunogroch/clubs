import React, { useMemo } from "react";
import { Image } from "../../../components";
import { ParentTooltip } from "../../../components/ParentTooltip";
import {
  formatDateWithLiteralMonth,
  calculateAge,
} from "../../../utils/athleteUtils";

interface Athlete {
  _id: string;
  name: string;
  lastname: string;
  ci: string;
  phone: string;
  gender: string;
  birth_date: string;
  images: { small: string };
  parent_id?: string;
  registration_date?: string;
  documentPath?: string;
  [key: string]: any;
}

interface AthletesTableProps {
  athletes: Athlete[];
  loading: boolean;
  onEditClick: (athlete: Athlete) => void;
  onImageEditClick: (athlete: Athlete) => void;
  onCIEditClick: (athlete: Athlete) => void;
  onPDFPreviewClick: (pdfPath: string, fileName: string) => void;
}

interface AthleteRowProps {
  athlete: Athlete;
  onEditClick: (athlete: Athlete) => void;
  onImageEditClick: (athlete: Athlete) => void;
  onCIEditClick: (athlete: Athlete) => void;
  onPDFPreviewClick: (pdfPath: string, fileName: string) => void;
}

const AthleteRow: React.FC<AthleteRowProps> = React.memo(
  ({ athlete, onEditClick, onImageEditClick }) => (
    <tr>
      <td
        style={{
          textAlign: "center",
          verticalAlign: "middle",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "fit-content",
            margin: "0 auto",
          }}
        >
          {athlete.images?.small ? (
            <Image
              src={athlete.images.small}
              alt={athlete.name}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `5px solid ${athlete.gender === "female" ? "#ff69b4" : athlete.gender === "male" ? "#001eff" : "#999"}`,
              }}
            />
          ) : (
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                border: `5px solid ${athlete.gender === "female" ? "#ff69b4" : athlete.gender === "male" ? "#001eff" : "#999"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fa fa-user"
                style={{ fontSize: "24px", color: "#999" }}
              ></i>
            </div>
          )}
          <button
            type="button"
            className="btn btn-xs btn-info"
            style={{
              position: "absolute",
              bottom: "-5px",
              right: "-5px",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => onImageEditClick(athlete)}
            title="Editar foto"
          >
            <i className="fa fa-pencil" style={{ fontSize: "12px" }}></i>
          </button>
        </div>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {athlete.name} {athlete.lastname || ""}
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {athlete.ci || (
          <span title="Sin dato">
            <i
              className="fa fa-exclamation-triangle"
              style={{ color: "red" }}
            ></i>
          </span>
        )}
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {athlete.parent_id ? (
          <ParentTooltip parentId={athlete.parent_id}>
            <span
              style={{
                fontWeight: "600",
                cursor: "pointer",
                padding: "4px 8px",
                backgroundColor: "rgba(102, 126, 234, 0.1)",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              <i className="fa fa-user"></i> Responsable
            </span>
          </ParentTooltip>
        ) : athlete.phone ? (
          athlete.phone
        ) : (
          <span title="Sin dato">
            <i
              className="fa fa-exclamation-triangle"
              style={{ color: "red" }}
            ></i>
          </span>
        )}
      </td>

      <td style={{ verticalAlign: "middle" }}>
        {athlete.birth_date ? (
          `${calculateAge(athlete.birth_date)} años`
        ) : (
          <span title="Sin dato">
            <i
              className="fa fa-exclamation-triangle"
              style={{ color: "red" }}
            ></i>
          </span>
        )}
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {athlete.registration_date ? (
          formatDateWithLiteralMonth(athlete.registration_date)
        ) : (
          <span title="Sin fecha de inscripción registrada">
            <i className="fa fa-info-circle" style={{ color: "#999" }}></i>
          </span>
        )}
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        <button
          className="btn btn-xs btn-warning mx-1"
          onClick={() => onEditClick(athlete)}
        >
          Actualizar
        </button>
      </td>
    </tr>
  ),
  (prev, next) => {
    return (
      prev.athlete._id === next.athlete._id &&
      JSON.stringify(prev.athlete) === JSON.stringify(next.athlete)
    );
  },
);

AthleteRow.displayName = "AthleteRow";

interface TableBodyProps {
  athletes: Athlete[];
  onEditClick: (athlete: Athlete) => void;
  onImageEditClick: (athlete: Athlete) => void;
  onCIEditClick: (athlete: Athlete) => void;
  onPDFPreviewClick: (pdfPath: string, fileName: string) => void;
}

const TableBody: React.FC<TableBodyProps> = React.memo(
  ({
    athletes,
    onEditClick,
    onImageEditClick,
    onCIEditClick,
    onPDFPreviewClick,
  }) => (
    <tbody>
      {athletes.map((athlete) => (
        <AthleteRow
          key={athlete._id}
          athlete={athlete}
          onEditClick={onEditClick}
          onImageEditClick={onImageEditClick}
          onCIEditClick={onCIEditClick}
          onPDFPreviewClick={onPDFPreviewClick}
        />
      ))}
    </tbody>
  ),
);

TableBody.displayName = "TableBody";

export const AthletesTable: React.FC<AthletesTableProps> = React.memo(
  ({
    athletes,
    loading,
    onEditClick,
    onImageEditClick,
    onCIEditClick,
    onPDFPreviewClick,
  }) => {
    const memoizedAthletes = useMemo(() => athletes, [athletes]);

    if (loading) {
      return <p>Cargando...</p>;
    }

    if (memoizedAthletes.length === 0) {
      return (
        <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
          <p>Aún no hay atletas registrados</p>
        </div>
      );
    }

    return (
      <table
        className="table table-striped"
        style={{ verticalAlign: "middle" }}
      >
        <thead>
          <tr>
            <th style={{ verticalAlign: "middle" }}>Foto</th>
            <th style={{ verticalAlign: "middle" }}>Nombre</th>
            <th style={{ verticalAlign: "middle" }}>Carnet</th>
            <th style={{ verticalAlign: "middle" }}>Teléfono</th>
            <th style={{ verticalAlign: "middle" }}>Edad</th>
            <th style={{ verticalAlign: "middle" }}>Fecha de Inscripción</th>
            <th style={{ textAlign: "center", verticalAlign: "middle" }}>
              Acciones
            </th>
          </tr>
        </thead>
        <TableBody
          athletes={memoizedAthletes}
          onEditClick={onEditClick}
          onImageEditClick={onImageEditClick}
          onCIEditClick={onCIEditClick}
          onPDFPreviewClick={onPDFPreviewClick}
        />
      </table>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent re-renders when props haven't meaningfully changed
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.athletes === nextProps.athletes &&
      prevProps.onEditClick === nextProps.onEditClick &&
      prevProps.onImageEditClick === nextProps.onImageEditClick &&
      prevProps.onCIEditClick === nextProps.onCIEditClick &&
      prevProps.onPDFPreviewClick === nextProps.onPDFPreviewClick
    );
  },
);
