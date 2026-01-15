import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGroupsService } from '../../services/admin-groups.service';
import type { CreateAdminGroupPayload } from '../../services/admin-groups.service';
import '../../styles/Forms.css';

interface AdminGroupFormProps {
  name?: string;
  sub?: string;
  sub1?: string;
}

export const AdminGroupForm = ({ name, sub, sub1 }: AdminGroupFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAdminGroupPayload>({
    name: '',
    description: '',
    sport: '',
    category: '',
    schedule: [],
    coaches: [],
    athletes: [],
  });

  useEffect(() => {
    if (id) {
      fetchGroup();
    }
  }, [id]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const group = await adminGroupsService.getById(id!);
      setFormData({
        name: group.name,
        description: group.description,
        sport: group.sport || '',
        category: group.category || '',
        schedule: group.schedule || [],
        coaches: group.coaches?.map((c: any) => c._id) || [],
        athletes: group.athletes?.map((a: any) => a._id) || [],
      });
      setError(null);
    } catch (err) {
      setError('Error loading group');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        await adminGroupsService.update(id, formData);
      } else {
        await adminGroupsService.create(formData);
      }

      navigate('/admin/groups');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving group');
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
        <div className="form-group">
          <label htmlFor="name">Nombre del Grupo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Grupo A - Fútbol"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descripción del grupo"
            className="form-textarea"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sport">Deporte</label>
            <input
              type="text"
              id="sport"
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              placeholder="Ej: Fútbol"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Ej: U-15"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/groups')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>

        <p className="form-note">
          Nota: Puede asignar entrenadores y atletas después de crear el grupo.
        </p>
      </form>
    </div>
  );
};
