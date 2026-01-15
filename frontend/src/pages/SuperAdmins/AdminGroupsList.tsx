import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGroupsService } from '../../services/admin-groups.service';
import type { AdminGroup } from '../../services/admin-groups.service';
import '../../styles/Tables.css';

interface AdminGroupsListProps {
  name?: string;
  sub?: string;
  edit?: boolean;
  delete?: boolean;
  restore?: boolean;
}

export const AdminGroupsList = ({
  name,
  sub,
  edit = false,
  delete: canDelete = false,
  restore: canRestore = false,
}: AdminGroupsListProps) => {
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, [showDeleted]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = showDeleted
        ? await adminGroupsService.getAllIncludingDeleted()
        : await adminGroupsService.getAll();
      setGroups(data);
      setFilteredGroups(data);
      setError(null);
    } catch (err) {
      setError('Error loading groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = groups.filter(
      (group) =>
        group.name.toLowerCase().includes(term) ||
        group.description.toLowerCase().includes(term),
    );
    setFilteredGroups(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este grupo?')) {
      try {
        await adminGroupsService.delete(id);
        fetchGroups();
      } catch (err) {
        console.error('Error deleting group', err);
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await adminGroupsService.restore(id);
      fetchGroups();
    } catch (err) {
      console.error('Error restoring group', err);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/groups/edit/${id}`);
  };

  if (loading) {
    return <div className="loading">Cargando grupos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container-list">
      <div className="header-section">
        <div>
          <h1>{name}</h1>
          {sub && <p>{sub}</p>}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/groups/create')}
        >
          <i className="fa fa-plus"></i> Nuevo Grupo
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        {canRestore && (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            Mostrar eliminados
          </label>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="no-data">No hay grupos disponibles</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Deporte</th>
                <th>Categoría</th>
                <th>Entrenadores</th>
                <th>Atletas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((group) => (
                <tr key={group._id} className={!group.active ? 'deleted-row' : ''}>
                  <td>{group.name}</td>
                  <td>{group.description}</td>
                  <td>{group.sport || '-'}</td>
                  <td>{group.category || '-'}</td>
                  <td>{group.coaches?.length || 0}</td>
                  <td>{group.athletes?.length || 0}</td>
                  <td>
                    <span className={`badge ${group.active ? 'active' : 'inactive'}`}>
                      {group.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      {edit && (
                        <button
                          className="btn-icon edit"
                          onClick={() => handleEdit(group._id)}
                          title="Editar"
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      )}
                      {canDelete && group.active && (
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(group._id)}
                          title="Eliminar"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      )}
                      {canRestore && !group.active && (
                        <button
                          className="btn-icon restore"
                          onClick={() => handleRestore(group._id)}
                          title="Restaurar"
                        >
                          <i className="fa fa-undo"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
