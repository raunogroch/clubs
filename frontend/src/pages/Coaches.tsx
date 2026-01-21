import { useEffect, useState } from "react";
import { NavHeader } from "../components";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { createUser, updateUser } from "../store/usersThunk";
import { userService } from "../services/userService";

export const Coaches = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    lastname: "",
    username: "",
    ci: "",
    phone: "",
    active: true,
    images: { small: "", medium: "", large: "" },
  });
  const [imageForm, setImageForm] = useState<any>({
    small: "",
    medium: "",
    large: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoachesFromGroups();
  }, []);

  const loadCoachesFromGroups = async () => {
    try {
      setLoading(true);
      const response = await userService.getCoachesFromGroups();
      if (response.code === 200 && Array.isArray(response.data)) {
        setCoaches(response.data);
      } else {
        setCoaches([]);
      }
    } catch (error) {
      console.error("Error al cargar coaches:", error);
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };
  const openEdit = (u: any) => {
    setEditing(u);
    setForm({
      name: u.name || "",
      lastname: u.lastname || "",
      username: u.username || "",
      ci: u.ci || "",
      phone: u.phone || "",
      active: typeof u.active === "boolean" ? u.active : true,
      images: {
        small: (u.images && u.images.small) || "",
        medium: (u.images && u.images.medium) || "",
        large: (u.images && u.images.large) || "",
      },
    });
    setFormError(null);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
  };
  const openImageEdit = (u: any) => {
    setEditingImage(u);
    setImageForm({
      small: (u.images && u.images.small) || "",
      medium: (u.images && u.images.medium) || "",
      large: (u.images && u.images.large) || "",
    });
    setShowImageModal(true);
  };
  const closeImageModal = () => {
    setShowImageModal(false);
    setEditingImage(null);
  };
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        images: imageForm,
        role: "coach",
      };
      await dispatch(
        updateUser({ id: editingImage._id, user: payload }),
      ).unwrap();
      await loadCoachesFromGroups();
      closeImageModal();
    } catch (err: any) {
      alert((err && (err.message || err)) || "Error al actualizar imagen");
    }
  };
  const validate = () => {
    if (!form.name || !form.name.trim()) return "El nombre es requerido";
    if (!form.lastname || !form.lastname.trim())
      return "El apellido es requerido";
    if (!form.ci || !form.ci.trim()) return "El CI es requerido";
    if (!form.username || !form.username.trim())
      return "El username es requerido";
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
      const payload = { ...form, role: "coach" };
      if (editing)
        await dispatch(updateUser({ id: editing._id, user: payload })).unwrap();
      else
        await dispatch(createUser({ role: "coach", user: payload })).unwrap();
      await loadCoachesFromGroups();
      closeModal();
    } catch (err: any) {
      setFormError((err && (err.message || err)) || "Error inesperado");
    }
  };

  return (
    <div>
      <NavHeader name="Users - Coaches" pageCreate="Crear" />
      <div className="wrapper wrapper-content">
        <div className="ibox">
          <div className="ibox-content">
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <table
                className="table table-striped"
                style={{ verticalAlign: "middle" }}
              >
                <thead>
                  <tr>
                    <th style={{ verticalAlign: "middle" }}>Foto de Perfil</th>
                    <th style={{ verticalAlign: "middle" }}>Nombre</th>
                    <th style={{ verticalAlign: "middle" }}>Username</th>
                    <th style={{ verticalAlign: "middle" }}>CI</th>
                    <th style={{ verticalAlign: "middle" }}>Teléfono</th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((u: any) => (
                    <tr key={u._id}>
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
                          {u.images?.small ? (
                            <img
                              src={u.images.small}
                              alt={u.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ddd",
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
                            onClick={() => openImageEdit(u)}
                            title="Editar foto"
                          >
                            <i
                              className="fa fa-pencil"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </button>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {u.name} {u.lastname || ""}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>{u.username}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        {u.ci || (
                          <span title="Sin dato">
                            <i
                              className="fa fa-exclamation-triangle"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                        )}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {u.phone || (
                          <span title="Sin dato">
                            <i
                              className="fa fa-exclamation-triangle"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                        )}
                      </td>
                      <td
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <button
                          className="btn btn-xs btn-warning mx-1"
                          onClick={() => openEdit(u)}
                        >
                          Actualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                  {editing ? "Editar Coach" : "Crear Coach"}
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
                    <label>Apellido</label>
                    <input
                      className="form-control"
                      value={form.lastname}
                      onChange={(e) =>
                        setForm({ ...form, lastname: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>CI</label>
                    <input
                      className="form-control"
                      value={form.ci}
                      onChange={(e) => setForm({ ...form, ci: e.target.value })}
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
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      className="form-control"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
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
                      className="btn btn-xs btn-default"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-xs btn-primary"
                      disabled={loading}
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

      {showImageModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
          onClick={closeImageModal}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Editar Foto de Perfil</h4>
                <button className="close" onClick={closeImageModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleImageSubmit}>
                  <div className="form-group">
                    <label>Preview Foto (medium)</label>
                    <div style={{ marginBottom: "10px", textAlign: "center" }}>
                      {imageForm.medium ? (
                        <img
                          src={imageForm.medium}
                          alt="Preview"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "150px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            padding: "4px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            backgroundColor: "#f0f0f0",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            color: "#999",
                          }}
                        >
                          <i
                            className="fa fa-image"
                            style={{ fontSize: "40px" }}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>URL Imagen (small)</label>
                    <input
                      className="form-control"
                      placeholder="https://..."
                      value={imageForm.small}
                      onChange={(e) =>
                        setImageForm({ ...imageForm, small: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Imagen (medium)</label>
                    <input
                      className="form-control"
                      placeholder="https://..."
                      value={imageForm.medium}
                      onChange={(e) =>
                        setImageForm({ ...imageForm, medium: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>URL Imagen (large)</label>
                    <input
                      className="form-control"
                      placeholder="https://..."
                      value={imageForm.large}
                      onChange={(e) =>
                        setImageForm({ ...imageForm, large: e.target.value })
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
                      className="btn btn-xs btn-default"
                      onClick={closeImageModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-xs btn-primary"
                      disabled={loading}
                    >
                      Guardar Imagen
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

export default Coaches;
