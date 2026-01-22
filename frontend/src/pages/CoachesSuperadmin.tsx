import { useEffect, useRef, useState } from "react";
import { Image, NavHeader } from "../components";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { createUser, updateUser } from "../store/usersThunk";
import { userService } from "../services/userService";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export const CoachesSuperadmin = () => {
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
  const [formError, setFormError] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");
  const cropperRef = useRef<any>(null);

  useEffect(() => {
    loadCoachesFromGroups();
  }, []);

  const loadCoachesFromGroups = async () => {
    try {
      setLoading(true);
      const response = await userService.getCoaches();
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
    setUploadedImageBase64("");
    setShowImageModal(true);
  };
  const closeImageModal = () => {
    setShowImageModal(false);
    setEditingImage(null);
  };
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImageBase64) {
      alert("Por favor sube una imagen primero");
      return;
    }
    try {
      const canvas = cropperRef.current?.cropper?.getCroppedCanvas();
      if (!canvas) {
        alert("Error al procesar la imagen");
        return;
      }
      const croppedBase64 = canvas.toDataURL("image/jpeg");
      const payload = {
        userId: editingImage._id,
        imageBase64: croppedBase64,
        role: "coach",
      };
      const response = await userService.uploadCoachImage(payload);
      if (response.code === 200) {
        await loadCoachesFromGroups();
        closeImageModal();
      } else {
        const errorMsg = response.message || "Error al procesar la imagen";
        console.error("Error al cargar imagen:", response);
        alert(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Error al actualizar imagen";
      console.error("Error en handleImageSubmit:", err);
      alert(errorMsg);
    }
  };
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      <NavHeader name="Entrenadores" />
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
                            <Image
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
          className="modal fade show"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.5)",
            animation: "fadeIn 0.3s ease-in-out",
            zIndex: 1050,
          }}
          onClick={closeImageModal}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              margin: 0,
              maxWidth: "480px",
              width: "90%",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,.15)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  borderBottom: "1px solid #e8e8e8",
                  backgroundColor: "#fafafa",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Actualizar Foto de Perfil
                </h5>
                <button
                  onClick={closeImageModal}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#999",
                    transition: "color 0.2s",
                    padding: "4px 8px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#333")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "24px" }}>
                <form onSubmit={handleImageSubmit}>
                  {/* File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{
                      display: "none",
                    }}
                    id="imageInput"
                  />
                  <label
                    htmlFor="imageInput"
                    style={{
                      display: "block",
                      border: "2px dashed #d0d0d0",
                      borderRadius: "8px",
                      padding: "28px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: "#fafafa",
                      marginBottom: uploadedImageBase64 ? "20px" : 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#3498db";
                      e.currentTarget.style.backgroundColor = "#f0f8ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#d0d0d0";
                      e.currentTarget.style.backgroundColor = "#fafafa";
                    }}
                  >
                    <div style={{ color: "#3498db", fontWeight: "600" }}>
                      Seleccionar imagen
                    </div>
                    <div
                      style={{
                        color: "#999",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      PNG, JPG o GIF (máx. 5MB)
                    </div>
                  </label>

                  {/* Cropper */}
                  {uploadedImageBase64 && (
                    <>
                      <div
                        style={{
                          marginBottom: "20px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Cropper
                          ref={cropperRef}
                          src={uploadedImageBase64}
                          guides
                          responsive
                          autoCropArea={1}
                          aspectRatio={1}
                          viewMode={1}
                          style={{ maxHeight: "380px" }}
                        />
                      </div>

                      {/* Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          onClick={closeImageModal}
                          style={{
                            padding: "8px 18px",
                            borderRadius: "6px",
                            border: "1px solid #d0d0d0",
                            backgroundColor: "white",
                            color: "#333",
                            fontWeight: "500",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f5f5f5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          style={{
                            padding: "8px 20px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: loading ? "#ccc" : "#3498db",
                            color: "white",
                            fontWeight: "500",
                            fontSize: "14px",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.currentTarget.style.backgroundColor = "#2980b9";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!loading) {
                              e.currentTarget.style.backgroundColor = "#3498db";
                            }
                          }}
                        >
                          {loading ? "Guardando..." : "Guardar"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .form-control:focus {
          border-color: #2980b9 !important;
          box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25) !important;
        }

        .btn:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};