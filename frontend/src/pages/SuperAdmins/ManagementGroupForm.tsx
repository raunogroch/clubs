import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { managementGroupsService } from "../../services/management-groups.service";
import { userService } from "../../services/userService";
import type { CreateManagementGroupPayload } from "../../services/management-groups.service";
import type { User } from "../../interfaces";

interface ManagementGroupFormProps {
  name?: string;
  sub?: string;
  sub1?: string;
}

export const ManagementGroupForm = ({
  name,
  sub,
  sub1,
}: ManagementGroupFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [administrators, setAdministrators] = useState<User[]>([]);

  const [formData, setFormData] = useState<CreateManagementGroupPayload>({
    name: "",
    administrator: "",
  });

  useEffect(() => {
    fetchAdministrators();
    if (id) {
      fetchGroup();
    }
  }, [id]);

  const fetchAdministrators = async () => {
    try {
      const response = await userService.getAdmins(1000);
      if (response.data) {
        setAdministrators(response.data);
      }
    } catch (err) {
      console.error("Error fetching administrators", err);
      toastr.error("Error cargando administradores");
    }
  };

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const group = await managementGroupsService.getById(id!);
      setFormData({
        name: group.name,
        administrator:
          typeof group.administrator === "object"
            ? group.administrator._id
            : group.administrator || "",
      });
      setError(null);
    } catch (err) {
      setError("Error loading group");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      if (id) {
        await managementGroupsService.update(id, formData);
      } else {
        await managementGroupsService.create(formData);
      }

      toastr.success("Grupo guardado exitosamente");
      navigate("/admin/groups");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving group");
      toastr.error(err.response?.data?.message || "Error al guardar el grupo");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>{name}</h1>
        {sub && <p className="subtitle">{sub}</p>}
        {sub1 && <p className="subtitle">{sub1}</p>}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">Nombre del Grupo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Grupo 1 - Grupo 2 ..."
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="administrator">Administrador del Grupo *</label>
              <select
                id="administrator"
                name="administrator"
                value={formData.administrator || ""}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">-- Seleccionar Administrador --</option>
                {administrators.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.name} {admin.lastname}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? "Guardando..." : id ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/groups")}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>

        <p className="form-note">
          * Campo requerido. El administrador podrá gestionar recursos dentro de
          este grupo.
        </p>
      </form>
    </div>
  );
};
