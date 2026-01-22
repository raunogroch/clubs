import { useEffect, useRef, useState } from "react";
import { Image, NavHeader } from "../components";

import { userService } from "../services/userService";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ParentTooltip } from "../components/ParentTooltip";

export const Athletes = () => {
  const [showImageModal, setShowImageModal] = useState(false);

  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");

  const cropperRef = useRef<any>(null);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      setLoading(true);
      const response = await userService.getAthletes();
      if (response.code === 200 && Array.isArray(response.data)) {
        setAthletes(response.data);
      } else {
        setAthletes([]);
      }
    } catch (error) {
      setAthletes([]);
    } finally {
      setLoading(false);
    }
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
        role: "athlete",
      };
      const response = await userService.uploadCoachImage(payload);
      if (response.code === 200) {
        await loadAthletes();
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

  const calculateAge = (birthDate: string | Date) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  const genderLabel = (g: string | undefined | null) => {
    if (!g) return "-";
    const map: Record<string, string> = {
      male: "Masculino",
      female: "Femenino",
      other: "Otro",
    };
    return map[g] || "-";
  };
  return (
    <div>
      <NavHeader name="Atletas" />
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
                    <th style={{ verticalAlign: "middle" }}>Género</th>
                    <th style={{ verticalAlign: "middle" }}>Edad</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((u: any) => (
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
                        {u.parent_id ? (
                          <ParentTooltip parentId={u.parent_id}>
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
                        ) : u.phone ? (
                          u.phone
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
                        {u.gender &&
                        (u.gender === "male" || u.gender === "female") ? (
                          genderLabel(u.gender)
                        ) : (
                          <span title="Género inválido o no especificado">
                            <i
                              className="fa fa-exclamation-triangle"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                        )}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {u.birth_date ? (
                          `${calculateAge(u.birth_date)} años`
                        ) : (
                          <span title="Sin dato">
                            <i
                              className="fa fa-exclamation-triangle"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

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

export default Athletes;
