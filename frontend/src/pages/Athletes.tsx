import { useEffect, useState } from "react";
import { NavHeader } from "../components";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchUsersByRole,
  createUser,
  updateUser,
  deleteUser,
} from "../store/usersThunk";

export const Athletes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((s: RootState) => s.users);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", username: "" });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsersByRole("athlete"));
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", username: "" });
    setFormError(null);
    setShowModal(true);
  };
  const openEdit = (u: any) => {
    setEditing(u);
    setForm({
      name: u.name || "",
      username: u.username || "",
    });
    setFormError(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };
  const validate = () => {
    if (!form.username.trim()) return "El username es requerido";
    return null;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setFormError(v);
      return;
    }
    setFormError(null);
    try {
      if (editing)
        await dispatch(
          updateUser({ id: editing._id, user: { ...form, role: "athlete" } }),
        ).unwrap();
      else
        await dispatch(
          createUser({ role: "athlete", user: { ...form, role: "athlete" } }),
        ).unwrap();
      await dispatch(fetchUsersByRole("athlete"));
      closeModal();
    } catch (err: any) {
      setFormError((err && (err.message || err)) || "Error inesperado");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await dispatch(deleteUser(id));
    await dispatch(fetchUsersByRole("athlete"));
  };

  return (
    <div>
      <NavHeader name="Users - Athletes" pageCreate="Crear" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-title">
            <button className="btn btn-primary" onClick={openCreate}>
              Crear Athlete
            </button>
          </div>
          <div className="ibox-content">
            {status === "loading" ? (
              <p>Cargando...</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Username</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((u: any) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn btn-xs btn-success mx-1"
                          onClick={() => openEdit(u)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-xs btn-danger mx-1"
                          onClick={() => handleDelete(u._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editing ? "Editar Athlete" : "Crear Athlete"}
                </h4>
                <button className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-danger">{formError}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      className="form-control"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={status === "loading"}
                    >
                      {editing ? "Actualizar" : "Crear"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Athletes;
