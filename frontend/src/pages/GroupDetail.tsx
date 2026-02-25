import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toastr from "toastr";
import { Button, NavHeader } from "../components";
import Ibox from "../components/Ibox";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchGroupSummary,
  removeAthleteFromGroup,
  addCoachToGroup,
  removeCoachFromGroup,
  addAthleteToGroup,
} from "../store/groupsThunk";
import {
  fetchSchedulesByGroupId,
  replaceBatchSchedules,
} from "../store/schedulesThunk";
import { AddMemberModal } from "../components/modals";
import { useAddMemberModal, useScheduleModal } from "../features/groups/hooks";
import { MemberList, EditScheduleModal } from "../features/groups/components";
import userService from "../services/userService";

// Group and Event shape are dynamic; using `any` in UI layer for flexibility

export const GroupDetail = () => {
  const { club_id, id_subgrupo } = useParams<{
    club_id: string;
    id_subgrupo: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();
  const { selectedGroup: group, status } = useSelector(
    (s: RootState) => s.groups,
  );
  const schedules = useSelector((s: RootState) => s.schedules.items);

  const isLoading = status === "loading";

  /**
   * Ordena los horarios por día (Lunes a Domingo)
   */
  const sortSchedulesByDay = (scheds: any[]) => {
    const dayOrder: Record<string, number> = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };

    return [...scheds].sort((a, b) => {
      const dayDiff = (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0);
      if (dayDiff !== 0) return dayDiff;
      // Si es el mismo día, ordenar por hora de inicio
      return a.startTime.localeCompare(b.startTime);
    });
  };

  useEffect(() => {
    if (!id_subgrupo) return;
    const fields = [
      "name",
      "location",
      "schedules_added",
      "events_added",
      "coaches",
      "athletes_added",
    ];
    dispatch(fetchGroupSummary({ id: id_subgrupo, fields }));
    // Cargar schedules del grupo
    dispatch(fetchSchedulesByGroupId(id_subgrupo));
  }, [id_subgrupo, dispatch]);

  /**
   * Maneja la eliminación de un atleta del grupo
   */
  const handleRemoveAthlete = async (athleteId: string, registration: any) => {
    // Verificar si el atleta tiene matrícula pagada
    if (
      registration?.registration_pay !== null &&
      registration?.registration_pay !== undefined
    ) {
      toastr.error(
        "No se puede remover un atleta con matrícula pagada. Contacta al administrador.",
      );
      return;
    }

    if (
      !window.confirm("¿Estás seguro de que deseas remover este deportista?")
    ) {
      return;
    }

    await dispatch(
      removeAthleteFromGroup({ groupId: id_subgrupo!, athleteId }),
    );
  };

  const handleRemoveCoach = async (coachId: string) => {
    if (
      !window.confirm("¿Estás seguro de que deseas remover este entrenador?")
    ) {
      return;
    }

    await dispatch(removeCoachFromGroup({ groupId: id_subgrupo!, coachId }));
  };

  const addMemberModal = useAddMemberModal();

  const handleSearchMember = async () => {
    if (!addMemberModal.searchCi.trim()) {
      toastr.warning("CI es requerido");
      return;
    }

    if (!addMemberModal.memberType) {
      toastr.warning("Tipo de miembro no especificado");
      return;
    }

    try {
      addMemberModal.setSearchLoading(true);
      addMemberModal.setShowCreateUserForm(false);

      const response = await userService.findUserByCiAndRole(
        addMemberModal.searchCi,
        addMemberModal.memberType,
      );

      if (response.code === 200 && response.data) {
        // Verificar si ya está en el grupo
        const currentGroup = group;
        if (currentGroup) {
          if (
            addMemberModal.memberType === "coach" &&
            currentGroup.coaches?.includes(response.data._id)
          ) {
            toastr.warning("Este entrenador ya está registrado en el grupo");
            addMemberModal.setShowCreateUserForm(false);
            addMemberModal.setSearchResult(null);
            return;
          }

          if (addMemberModal.memberType === "athlete") {
            const isAthleteInGroup = (currentGroup as any).athletes_added?.some(
              (reg: any) =>
                (reg.athlete_id?._id || reg.athlete_id) === response.data._id,
            );
            if (isAthleteInGroup) {
              toastr.warning("Este deportista ya está registrado en el grupo");
              addMemberModal.setShowCreateUserForm(false);
              addMemberModal.setSearchResult(null);
              return;
            }
          }
        }

        addMemberModal.setSearchResult(response.data);
      } else {
        // No encontrado -> mostrar formulario de creación
        toastr.info("Usuario no encontrado");
        addMemberModal.setShowCreateUserForm(true);
        addMemberModal.updateCreateUserData("ci", addMemberModal.searchCi);
      }
    } catch (error: any) {
      console.error("Error al buscar usuario:", error);
      addMemberModal.setShowCreateUserForm(true);
      addMemberModal.updateCreateUserData("ci", addMemberModal.searchCi);
    } finally {
      addMemberModal.setSearchLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!addMemberModal.selectedGroupId || !addMemberModal.searchResult) {
      toastr.warning("Usuario no seleccionado");
      return;
    }

    if (addMemberModal.memberType === "coach") {
      await dispatch(
        addCoachToGroup({
          groupId: addMemberModal.selectedGroupId,
          coachId: addMemberModal.searchResult._id,
        }),
      );
    } else if (addMemberModal.memberType === "athlete") {
      await dispatch(
        addAthleteToGroup({
          groupId: addMemberModal.selectedGroupId,
          athleteId: addMemberModal.searchResult._id,
        }),
      );
    }

    // actualizar vista local mínima y cerrar modal
    toastr.success("Miembro agregado");
    addMemberModal.closeModal();
  };

  const handleCreateUser = async () => {
    const { name, lastname, ci } = addMemberModal.createUserData;
    if (!name.trim() || !lastname.trim() || !ci.trim()) {
      toastr.warning("Completa los datos requeridos");
      return;
    }

    try {
      addMemberModal.setSearchLoading(true);
      const newUser = await userService.createAthlete({
        name,
        lastname,
        ci,
        role: addMemberModal.memberType,
      });

      if (newUser.code === 201 || newUser.code === 200) {
        addMemberModal.setSearchResult(newUser.data);
        addMemberModal.setShowCreateUserForm(false);
        toastr.success("Usuario creado");
      } else {
        toastr.error("Error al crear el usuario");
      }
    } catch (error: any) {
      console.error(error);
      toastr.error("Error al crear usuario");
    } finally {
      addMemberModal.setSearchLoading(false);
    }
  };

  // schedule & events helpers
  const scheduleModal = useScheduleModal();

  const handleSaveSchedules = async () => {
    if (!scheduleModal.editingGroupId) {
      toastr.warning("No hay grupo seleccionado");
      return;
    }

    // Si la lista está vacía, pedir confirmación antes de eliminar todos los horarios
    if (scheduleModal.editingSchedules.length === 0) {
      const confirmed = window.confirm(
        "¿Está seguro de que desea eliminar todos los horarios? Esta acción no se puede deshacer.",
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      // Validar duplicados por si algo se filtró por error
      const days = scheduleModal.editingSchedules.map((s) => s.day);
      const hasDuplicate = days.some((d, i) => days.indexOf(d) !== i);
      if (hasDuplicate) {
        toastr.warning(
          "Hay días duplicados en la lista. Elimine duplicados antes de guardar.",
        );
        return;
      }

      // Ordenar los schedules por día antes de guardar (si hay alguno)
      const sortedSchedules = sortSchedulesByDay(
        scheduleModal.editingSchedules,
      );

      // Usar batch operation para actualizar todos los schedules
      // El backend se encarga de eliminar los antiguos y agregar los nuevos
      await dispatch(
        replaceBatchSchedules({
          groupId: scheduleModal.editingGroupId,
          schedules: sortedSchedules.map((s) => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
        }),
      );

      scheduleModal.closeModal();
    } catch (err) {
      console.error("Error al actualizar horarios:", err);
    }
  };

  /**
   * Agrupa horarios por hora y genera un formato de visualización compacto
   */
  const getGroupedSchedules = () => {
    if (schedules.length === 0) return [];

    const grouped = schedules.reduce(
      (acc: any, schedule: any) => {
        const key = `${schedule.startTime}-${schedule.endTime}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(schedule.day);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const dayOrder: Record<string, number> = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    };

    const dayNameMap: Record<string, string> = {
      Monday: "Lunes",
      Tuesday: "Martes",
      Wednesday: "Miércoles",
      Thursday: "Jueves",
      Friday: "Viernes",
      Saturday: "Sábado",
      Sunday: "Domingo",
    };

    return Object.entries(grouped)
      .map(([time, days]) => {
        const sortedDays = (days as string[]).sort(
          (a, b) => (dayOrder[a] || 0) - (dayOrder[b] || 0),
        );
        const [startTime, endTime] = time.split("-");

        // Compress contiguous days into ranges (e.g. Lunes a Miércoles)
        const compressDays = (daysArr: string[]) => {
          if (!daysArr || daysArr.length === 0) return "";
          const ranges: string[] = [];
          let rangeStart = daysArr[0];
          let prevIndex = dayOrder[daysArr[0]] ?? 0;

          for (let i = 1; i < daysArr.length; i++) {
            const d = daysArr[i];
            const idx = dayOrder[d] ?? 0;
            if (idx === prevIndex + 1) {
              // contiguous, extend range
              prevIndex = idx;
              continue;
            }
            // end current range at daysArr[i-1]
            const rangeEnd = daysArr[i - 1];
            if (rangeStart === rangeEnd) {
              ranges.push(dayNameMap[rangeStart] || rangeStart);
            } else {
              ranges.push(
                `${dayNameMap[rangeStart] || rangeStart} a ${dayNameMap[rangeEnd] || rangeEnd}`,
              );
            }
            // start new range
            rangeStart = d;
            prevIndex = idx;
          }

          // push last range
          const last = daysArr[daysArr.length - 1];
          if (rangeStart === last) {
            ranges.push(dayNameMap[rangeStart] || rangeStart);
          } else {
            ranges.push(
              `${dayNameMap[rangeStart] || rangeStart} a ${dayNameMap[last] || last}`,
            );
          }

          // Join multiple ranges with ' - '
          return ranges.join(" - ");
        };

        const displayDays = compressDays(sortedDays);

        return {
          days: displayDays,
          startTime,
          endTime,
        };
      })
      .sort((a, b) => {
        // Ordenar los resultados por hora de inicio también
        return a.startTime.localeCompare(b.startTime);
      });
  };

  // Build member details map and registration info for MemberList
  const memberDetails: Record<string, any> = {};
  const registrationInfo: Record<string, { registration_pay: any }> = {};

  if (group) {
    // coaches
    (group.coaches || []).forEach((c: any) => {
      const id = c?._id || c;
      memberDetails[id] = {
        name: c?.name || "",
        lastname: c?.lastname || "",
        role: c?.role || "coach",
        ci: c?.ci || "",
      };
    });

    // athletes
    (group.athletes_added || []).forEach((reg: any) => {
      const athlete = reg?.athlete_id;
      const id = athlete?._id || reg?.athlete_id;
      if (id) {
        memberDetails[id] = {
          name: athlete?.name || "",
          lastname: athlete?.lastname || "",
          role: athlete?.role || "athlete",
          ci: athlete?.ci || "",
        };
        registrationInfo[id] = {
          registration_pay: reg?.registration_pay || null,
        };
      }
    });
  }

  return (
    <>
      <NavHeader
        name={group?.name || "Grupo"}
        button={{
          label: "Volver",
          icon: "fa-arrow-left",
          url: `/clubs/${club_id}/groups`,
        }}
      />
      <div className="wrapper wrapper-content animated fadeInRight">
        {/* Información General */}
        <div className="row m-t-md">
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">{group?.coaches?.length || 0}</h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-user-tie text-navy"></i> Entrenadores
                </div>
                <small>Asignados al grupo</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">
                  {(group?.athletes_added || []).filter(
                    (entry: any) =>
                      entry?.registration_pay !== null &&
                      entry?.registration_pay !== undefined,
                  ).length || 0}
                </h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-users text-navy"></i> Atletas Pagados
                </div>
                <small>Matrícula confirmada</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">{schedules?.length || 0}</h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-calendar text-navy"></i> Horarios
                </div>
                <small>Sesiones por semana</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="ibox">
              <div className="ibox-content">
                <h1 className="no-margins">
                  {(group?.events_added || []).length}
                </h1>
                <div className="stat-percent font-bold">
                  <i className="fa fa-calendar-check-o text-navy"></i> Eventos
                </div>
                <small>Próximas actividades</small>
              </div>
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="row m-t-md">
          <div className="col-lg-12">
            <Ibox
              title={
                <>
                  <i className="fa fa-calendar"></i> Horarios de Entrenamiento
                </>
              }
              tools={
                <Button
                  className="btn btn-xs btn-success"
                  icon="fa-plus"
                  onClick={() =>
                    scheduleModal.openModal(id_subgrupo!, schedules || [])
                  }
                >
                  {(schedules?.length || 0) > 0
                    ? "Actualizar horarios"
                    : "Asignar horarios"}
                </Button>
              }
            >
              {schedules && schedules.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {getGroupedSchedules().map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 15px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <i
                        className="fa fa-calendar-o text-navy"
                        style={{ marginRight: "12px", fontSize: "16px" }}
                      ></i>
                      <span style={{ flex: 1 }}>
                        <strong>{item.days}</strong>
                      </span>
                      <span
                        style={{
                          marginLeft: "12px",
                          color: "#666",
                          fontWeight: "500",
                        }}
                      >
                        <i
                          className="fa fa-clock-o"
                          style={{ marginRight: "6px" }}
                        ></i>
                        {item.startTime} a {item.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  <p>No hay horarios asignados aún</p>
                  <small>Haz clic en "Asignar horarios" para comenzar</small>
                </div>
              )}
            </Ibox>
          </div>
        </div>
        <div className="row m-t-md">
          <MemberList
            title="Entrenadores"
            type="coach"
            icon="fa-users"
            members={group?.coaches || []}
            memberDetails={memberDetails}
            memberCount={group?.coaches?.length || 0}
            onAddMember={() => addMemberModal.openModal(id_subgrupo!, "coach")}
            onRemoveMember={(memberId: string) => handleRemoveCoach(memberId)}
            isLoading={isLoading}
            rowClassName="col-lg-5"
          />

          <MemberList
            type="athlete"
            title="Atletas"
            icon="fa-users"
            members={(group?.athletes_added || []).map(
              (r: any) => r?.athlete_id?._id || r?.athlete_id,
            )}
            memberDetails={memberDetails}
            memberCount={(group?.athletes_added || []).length}
            onAddMember={() =>
              addMemberModal.openModal(id_subgrupo!, "athlete")
            }
            onRemoveMember={(memberId: string) => {
              // find registration entry
              const entry = (group?.athletes_added || []).find(
                (reg: any) =>
                  (reg?.athlete_id?._id || reg?.athlete_id) === memberId,
              );
              handleRemoveAthlete(memberId, entry);
            }}
            isLoading={isLoading}
            rowClassName="col-lg-7"
            registrationInfo={registrationInfo}
          />
        </div>

        <EditScheduleModal
          isOpen={scheduleModal.showModal}
          schedules={scheduleModal.editingSchedules}
          loading={isLoading}
          onClose={scheduleModal.closeModal}
          onSave={handleSaveSchedules}
          onAddRow={scheduleModal.addScheduleRow}
          onUpdateRow={scheduleModal.updateScheduleRow}
          onRemoveRow={scheduleModal.removeScheduleRow}
        />

        <AddMemberModal
          isOpen={addMemberModal.showModal}
          memberType={addMemberModal.memberType}
          searchCi={addMemberModal.searchCi}
          searchResult={addMemberModal.searchResult}
          showCreateUserForm={addMemberModal.showCreateUserForm}
          createUserData={addMemberModal.createUserData}
          loading={addMemberModal.searchLoading}
          onClose={addMemberModal.closeModal}
          onSearchCiChange={(val: string) => addMemberModal.setSearchCi(val)}
          onSearch={handleSearchMember}
          onAddMember={handleAddMember}
          onCreateUser={handleCreateUser}
          onCreateUserDataChange={addMemberModal.updateCreateUserData}
        />
      </div>
    </>
  );
};
