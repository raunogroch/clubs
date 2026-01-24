import { useEffect, useRef, useState } from "react";
import { Image, NavHeader } from "../components";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { createUser, updateUser } from "../store/usersThunk";
import { userService } from "../services/userService";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { ParentTooltip } from "../components/ParentTooltip";

// Función helper para formatear fechas con mes literal (YYYY, D de MMM)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatDateWithLiteralMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatted = date.toLocaleDateString("es-ES", options);
  // Convierte "24 ene 2025" a "2025, 24 de ene"
  const parts = formatted.split(" ");
  if (parts.length === 3) {
    return `${parts[2]}, ${parts[0]} de ${parts[1]}`;
  }
  return formatted;
};

export const AthletesAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
    name: string;
  } | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    lastname: "",
    username: "",
    ci: "",
    phone: "",
    gender: "",
    birth_date: "",
    inscriptionDate: "",
    enableCustomInscription: false,
    active: true,
    images: { small: "", medium: "", large: "" },
    parent: {
      name: "",
      lastname: "",
      ci: "",
      phone: "",
    },
    createdAt: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>("");
  const [parentCISearch, setParentCISearch] = useState<string>("");
  const [searchingParent, setSearchingParent] = useState(false);
  const [parentNotFound, setParentNotFound] = useState(false);
  const cropperRef = useRef<any>(null);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      setLoading(true);
      const response = await userService.getAthletesFromGroups();
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

  console.log("AthletesAdmin render, athletes:", athletes);

  const searchParentByCI = async (ci: string) => {
    if (!ci.trim()) {
      setParentNotFound(false);
      return;
    }

    setSearchingParent(true);
    try {
      const allUsers = await userService.fetchByRole("parent");
      const foundParent = allUsers?.data?.find(
        (u: any) => u.ci?.toLowerCase() === ci.toLowerCase(),
      );

      if (foundParent) {
        setForm({
          ...form,
          parent: {
            name: foundParent.name || "",
            lastname: foundParent.lastname || "",
            ci: foundParent.ci || "",
            phone: foundParent.phone || "",
          },
        });
        setParentNotFound(false);
      } else {
        setParentNotFound(true);
        setForm({
          ...form,
          parent: {
            name: "",
            lastname: "",
            ci: ci,
            phone: "",
          },
        });
      }
    } catch (error) {
      console.error("Error al buscar tutor:", error);
      setParentNotFound(true);
    } finally {
      setSearchingParent(false);
    }
  };

  const openEdit = async (u: any) => {
    setEditing(u);
    let parentData = {
      name: "",
      lastname: "",
      ci: "",
      phone: "",
    };

    // Si existe parent_id, cargar los datos del parent
    if (u.parent_id) {
      try {
        const response = await userService.getUserById(u.parent_id);
        const parentInfo = response?.data || response;
        if (parentInfo) {
          parentData = {
            name: parentInfo.name || "",
            lastname: parentInfo.lastname || "",
            ci: parentInfo.ci || "",
            phone: parentInfo.phone || "",
          };
        }
      } catch (error) {
        console.error("Error al cargar datos del parent:", error);
      }
    }

    setForm({
      name: u.name || "",
      lastname: u.lastname || "",
      username: u.username || "",
      ci: u.ci || "",
      phone: u.phone || "",
      gender: u.gender || "",
      birth_date: u.birth_date ? u.birth_date.split("T")[0] : "",
      inscriptionDate: u.inscriptionDate
        ? u.inscriptionDate.split("T")[0]
        : u.createdAt
          ? new Date(u.createdAt).toISOString().split("T")[0]
          : "",
      enableCustomInscription: !!u.inscriptionDate,
      active: typeof u.active === "boolean" ? u.active : true,
      images: {
        small: (u.images && u.images.small) || "",
        medium: (u.images && u.images.medium) || "",
        large: (u.images && u.images.large) || "",
      },
      parent: parentData,
    });
    setFormError(null);
    setParentCISearch(parentData.ci || "");
    setParentNotFound(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError(null);
    setParentCISearch("");
    setParentNotFound(false);
    setForm({
      name: "",
      lastname: "",
      username: "",
      ci: "",
      phone: "",
      gender: "",
      birth_date: "",
      inscriptionDate: "",
      enableCustomInscription: false,
      active: true,
      images: { small: "", medium: "", large: "" },
      parent: {
        name: "",
        lastname: "",
        ci: "",
        phone: "",
      },
    });
    setEditing(null);
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

  const validate = () => {
    if (!form.name || !form.name.trim()) return "El nombre es requerido";
    if (!form.lastname || !form.lastname.trim())
      return "El apellido es requerido";
    if (!form.ci || !form.ci.trim()) return "El CI es requerido";
    if (!form.gender) return "El género es requerido";
    if (!form.birth_date) return "La fecha de nacimiento es requerida";

    const age = calculateAge(form.birth_date);
    if (age < 18) {
      if (!form.parent.name || !form.parent.name.trim())
        return "El nombre del tutor es requerido para menores de edad";
      if (!form.parent.lastname || !form.parent.lastname.trim())
        return "El apellido del tutor es requerido para menores de edad";
      if (!form.parent.ci || !form.parent.ci.trim())
        return "El CI del tutor es requerido para menores de edad";
      if (!form.parent.phone || !form.parent.phone.trim())
        return "El teléfono del tutor es requerido para menores de edad";
    } else {
      if (!form.phone || !form.phone.trim()) return "El teléfono es requerido";
    }
    return null;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setFormError(v);
      return;
    }
    setFormError(null);
    try {
      const { parent, enableCustomInscription, inscriptionDate, ...payload } =
        form;
      const age = calculateAge(form.birth_date);

      // Generar username automáticamente si es creación
      let generatedUsername = form.username;
      if (!editing) {
        // username = primera letra del nombre + apellido completo, en minúsculas
        generatedUsername = ((form.name?.charAt(0) || "") + form.lastname || "")
          .toLowerCase()
          .replace(/\s/g, "");
      }

      // Generar password automático (8 caracteres aleatorios)
      const generatePassword = () => {
        return Math.random().toString(36).substring(2, 10);
      };
      const generatedPassword = generatePassword();

      // Si es menor de edad, crear/actualizar parent primero
      let parentId = editing?.parent_id || null;
      if (age < 18) {
        const parentPayload = {
          name: parent.name,
          lastname: parent.lastname,
          ci: parent.ci,
          phone: parent.phone,
          role: "parent",
        };

        // Verificar si el nuevo tutor existe en el sistema
        const allParents = await userService.fetchByRole("parent");
        const existingParent = allParents?.data?.find(
          (p: any) => p.ci?.toLowerCase() === parent.ci.toLowerCase(),
        );

        if (existingParent) {
          // Si el tutor existe y es diferente al actual, solo cambiar el parent_id
          if (editing?.parent_id && editing.parent_id !== existingParent._id) {
            parentId = existingParent._id;
          } else if (!parentId) {
            // Si no había parent antes, usar el existente
            parentId = existingParent._id;
          } else if (parentId === existingParent._id) {
            // Si es el mismo tutor, actualizar sus datos
            await dispatch(
              updateUser({ id: parentId, user: parentPayload }),
            ).unwrap();
          }
        } else {
          // Tutor no existe, crear uno nuevo
          if (parentId) {
            // Si hay un parent anterior, actualizarlo con los nuevos datos
            await dispatch(
              updateUser({ id: parentId, user: parentPayload }),
            ).unwrap();
          } else {
            // Crear nuevo parent
            const createResponse = await dispatch(
              createUser({ role: "parent", user: parentPayload }),
            ).unwrap();
            parentId = createResponse.data?._id || createResponse._id;
          }
        }
      }

      // Ahora guardar/actualizar athlete
      const payloadToSend: any = {
        ...payload,
        username: generatedUsername,
        password: generatedPassword,
        role: "athlete",
        ...(age < 18 && parentId && { parent_id: parentId }),
        // Si es mayor de edad, eliminar parent_id si existe
        ...(age >= 18 && { parent_id: null }),
      };

      // Manejar inscriptionDate
      if (enableCustomInscription && form.inscriptionDate) {
        // Convertir string YYYY-MM-DD a Date respetando zona horaria local
        const [year, month, day] = form.inscriptionDate.split('-').map(Number);
        payloadToSend.inscriptionDate = new Date(year, month - 1, day);
      } else if (enableCustomInscription && !form.inscriptionDate) {
        setFormError(
          "La fecha de inscripción es requerida cuando activas esta opción",
        );
        return;
      } else if (editing && !enableCustomInscription) {
        // Si estamos editando y NO marcamos el checkbox,
        // preservar la fecha existente (no enviar nada)
        // La fecha se mostrará como createdAt si no tiene inscriptionDate
      } else if (!editing) {
        // Si es creación y no se habilita inscripción personalizada,
        // el backend asignará automáticamente la fecha actual
        delete payloadToSend.inscriptionDate;
      }

      if (editing)
        await dispatch(
          updateUser({ id: editing._id, user: payloadToSend }),
        ).unwrap();
      else {
        await dispatch(
          createUser({ role: "athlete", user: payloadToSend }),
        ).unwrap();
        // Mostrar credenciales generadas
        setGeneratedCredentials({
          username: generatedUsername,
          password: generatedPassword,
          name: `${form.name} ${form.lastname}`,
        });
        setShowCredentialsModal(true);
        await loadAthletes();
        closeModal();
        return;
      }
      await loadAthletes();
      closeModal();
    } catch (err: any) {
      setFormError((err && (err.message || err)) || "Error inesperado");
    }
  };

  return (
    <div>
      <NavHeader name="Atletas del Club" />
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
                    <th style={{ verticalAlign: "middle" }}>Cédula</th>
                    <th style={{ verticalAlign: "middle" }}>Teléfono</th>
                    <th style={{ verticalAlign: "middle" }}>Género</th>
                    <th style={{ verticalAlign: "middle" }}>Edad</th>
                    <th style={{ verticalAlign: "middle" }}>
                      Fecha de Inscripción
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      Acciones
                    </th>
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
                      <td style={{ verticalAlign: "middle" }}>
                        {u.inscriptionDate ? (
                          formatDateWithLiteralMonth(u.inscriptionDate)
                        ) : u.createdAt ? (
                          formatDateWithLiteralMonth(u.createdAt)
                        ) : (
                          <span title="Sin fecha de inscripción registrada">
                            <i
                              className="fa fa-info-circle"
                              style={{ color: "#999" }}
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
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editing ? "Editar Atleta" : "Crear Atleta"}
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
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Nombre</label>
                      <input
                        className="form-control"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Apellido</label>
                      <input
                        className="form-control"
                        value={form.lastname}
                        onChange={(e) =>
                          setForm({ ...form, lastname: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>CI</label>
                      <input
                        className="form-control"
                        value={form.ci}
                        onChange={(e) =>
                          setForm({ ...form, ci: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Teléfono</label>
                      <input
                        className="form-control"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        disabled={
                          !form.birth_date || calculateAge(form.birth_date) < 18
                        }
                        style={{
                          backgroundColor:
                            !form.birth_date ||
                            calculateAge(form.birth_date) < 18
                              ? "#f5f5f5"
                              : "white",
                          cursor:
                            !form.birth_date ||
                            calculateAge(form.birth_date) < 18
                              ? "not-allowed"
                              : "auto",
                        }}
                      />
                      {!form.birth_date && (
                        <small
                          style={{
                            color: "#999",
                            marginTop: "4px",
                            display: "block",
                          }}
                        >
                          Ingresa la fecha de nacimiento primero
                        </small>
                      )}
                      {form.birth_date &&
                        calculateAge(form.birth_date) < 18 && (
                          <small
                            style={{
                              color: "#999",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            Usa el teléfono del tutor (menor de edad)
                          </small>
                        )}
                    </div>
                  </div>
                  {!editing && (
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        className="form-control"
                        value={form.username}
                        readOnly
                        style={{
                          backgroundColor: "#f5f5f5",
                          cursor: "not-allowed",
                        }}
                      />
                      <small
                        style={{
                          color: "#999",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        Se genera automáticamente
                      </small>
                    </div>
                  )}
                  {editing && (
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        className="form-control"
                        value={form.username}
                        readOnly
                        style={{
                          backgroundColor: "#f5f5f5",
                          cursor: "not-allowed",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>
                        Género
                        {!form.gender && (
                          <span
                            title="Campo requerido"
                            style={{ color: "red", marginLeft: "4px" }}
                          >
                            <i className="fa fa-exclamation-triangle"></i>
                          </span>
                        )}
                      </label>
                      <select
                        className="form-control"
                        value={form.gender}
                        onChange={(e) =>
                          setForm({ ...form, gender: e.target.value })
                        }
                        style={
                          !form.gender
                            ? {
                                borderColor: "#ffcccc",
                                backgroundColor: "#fff5f5",
                              }
                            : {}
                        }
                      >
                        <option value="">Seleccionar...</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.birth_date}
                        onChange={(e) =>
                          setForm({ ...form, birth_date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Campo de Inscripción Personalizada */}
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      padding: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="enableCustomInscription"
                        checked={form.enableCustomInscription}
                        disabled={editing && !!editing.inscriptionDate}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            enableCustomInscription: e.target.checked,
                            inscriptionDate: e.target.checked
                              ? form.inscriptionDate || ""
                              : "",
                          })
                        }
                        style={{
                          cursor: editing && !!editing.inscriptionDate
                            ? "not-allowed"
                            : "pointer",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                      <label
                        htmlFor="enableCustomInscription"
                        style={{
                          cursor: editing && !!editing.inscriptionDate
                            ? "not-allowed"
                            : "pointer",
                          margin: 0,
                          fontWeight: "600",
                          opacity: editing && !!editing.inscriptionDate ? 0.6 : 1,
                        }}
                      >
                        ✏️ Modificar Fecha de Inscripción
                      </label>
                      {editing && !!editing.inscriptionDate && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            marginLeft: "auto",
                          }}
                        >
                          (ya modificada)
                        </span>
                      )}
                    </div>

                    {form.enableCustomInscription && !editing?.inscriptionDate && (
                      <div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Fecha de Inscripción</label>
                          <input
                            type="date"
                            className="form-control"
                            value={form.inscriptionDate}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                inscriptionDate: e.target.value,
                              })
                            }
                            max={new Date().toISOString().split("T")[0]}
                          />
                          <small
                            style={{
                              color: "#666",
                              marginTop: "4px",
                              display: "block",
                            }}
                          >
                            La fecha debe ser igual o anterior a hoy
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  {form.birth_date && calculateAge(form.birth_date) < 18 && (
                    <div
                      style={{
                        backgroundColor: "#f0f8ff",
                        border: "1px solid #90c8f5",
                        borderRadius: "4px",
                        padding: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <h5
                        style={{
                          marginTop: 0,
                          marginBottom: "12px",
                          color: "#1565c0",
                        }}
                      >
                        Información del Tutor (Menor de Edad)
                      </h5>
                      {/* CI Search Section */}
                      <div
                        className="form-group"
                        style={{ marginBottom: "16px" }}
                      >
                        <label>
                          <strong>🔍 Buscar Tutor por CI</strong>
                        </label>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "flex-end",
                          }}
                        >
                          <input
                            className="form-control"
                            placeholder="Ingrese CI del tutor"
                            value={parentCISearch}
                            onChange={(e) => setParentCISearch(e.target.value)}
                            onBlur={() =>
                              parentCISearch && searchParentByCI(parentCISearch)
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-info"
                            onClick={() => searchParentByCI(parentCISearch)}
                            disabled={searchingParent || !parentCISearch}
                          >
                            {searchingParent ? "Buscando..." : "Buscar"}
                          </button>
                        </div>
                        {parentNotFound && (
                          <div
                            style={{
                              color: "#ff9800",
                              fontSize: "12px",
                              marginTop: "6px",
                            }}
                          >
                            ⚠️ Tutor no registrado. Complete la información para
                            crear un nuevo tutor.
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Nombre del Tutor</label>
                          <input
                            className="form-control"
                            value={form.parent.name}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                parent: {
                                  ...form.parent,
                                  name: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Apellido del Tutor</label>
                          <input
                            className="form-control"
                            value={form.parent.lastname}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                parent: {
                                  ...form.parent,
                                  lastname: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "12px",
                        }}
                      >
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>CI del Tutor</label>
                          <input
                            className="form-control"
                            value={form.parent.ci}
                            onChange={(e) => {
                              const ci = e.target.value;
                              setForm({
                                ...form,
                                parent: { ...form.parent, ci: ci },
                              });
                              setParentCISearch(ci);
                            }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label>Teléfono del Tutor</label>
                          <input
                            className="form-control"
                            value={form.parent.phone}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                parent: {
                                  ...form.parent,
                                  phone: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                      marginTop: "16px",
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

      {showCredentialsModal && generatedCredentials && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={() => setShowCredentialsModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "500px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4
              style={{ marginTop: 0, marginBottom: "16px", color: "#2c3e50" }}
            >
              ✓ Atleta Creado Exitosamente
            </h4>
            <div
              style={{
                marginBottom: "20px",
                backgroundColor: "#f0f8ff",
                padding: "12px",
                borderRadius: "4px",
                borderLeft: "4px solid #3498db",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {generatedCredentials.name}
              </p>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                Por favor, proporcione estas credenciales al atleta
              </p>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Usuario:
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <code style={{ flex: 1, fontWeight: "500" }}>
                  {generatedCredentials.username}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generatedCredentials.username,
                    );
                  }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Copiar
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Contraseña:
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <code
                  style={{ flex: 1, fontWeight: "500", letterSpacing: "1px" }}
                >
                  {generatedCredentials.password}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generatedCredentials.password,
                    );
                  }}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Copiar
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "4px",
                padding: "12px",
                marginBottom: "20px",
                fontSize: "13px",
                color: "#856404",
              }}
            >
              <strong>⚠️ Importante:</strong> Comparta estas credenciales de
              forma segura. El atleta debe cambiar su contraseña en el primer
              acceso.
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setShowCredentialsModal(false)}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Cerrar
              </button>
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
