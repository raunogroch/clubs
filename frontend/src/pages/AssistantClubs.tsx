import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toastr from "toastr";
import { Button, NavHeader } from "../components";
import { AddMemberModal, ViewAthletesModal } from "../components/modals";
import { useSchedules } from "../customHooks/useSchedules";
import { useAddMemberModal } from "../features/groups/hooks";
import { addAthleteToGroup } from "../store/groupsThunk";
import { updateGroupInAssistantClubs } from "../store/schedulesSlice";
import userService from "../services/userService";
import type { RootState, AppDispatch } from "../store/store";
import Ibox from "../components/Ibox";

export const AssistantClubs = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: assistantSchedules,
    assistantClubs,
    assistantClubsStatus,
  } = useSchedules(user);
  const addMemberModal = useAddMemberModal();
  const [athletesModalGroup, setAthletesModalGroup] = useState<any | null>(
    null,
  );
  const [localClubs, setLocalClubs] = useState<any[]>([]);

  // Sincronizar clubs de Redux con estado local
  useEffect(() => {
    if (assistantClubs && assistantClubs.length > 0) {
      setLocalClubs(JSON.parse(JSON.stringify(assistantClubs)));
    }
  }, [assistantClubs]);

  // Sincronizar atletasModalGroup cuando localClubs cambia
  useEffect(() => {
    if (athletesModalGroup && localClubs.length > 0) {
      let updatedGroup = null;
      for (const club of localClubs) {
        const found = club.groups?.find(
          (g: any) => g._id === athletesModalGroup._id,
        );
        if (found) {
          updatedGroup = found;
          break;
        }
      }
      if (updatedGroup) {
        setAthletesModalGroup(updatedGroup);
      }
    }
  }, [localClubs]);

  useEffect(() => {
    // el hook ya dispara la carga cuando cambia el usuario, no hay nada qué hacer aquí
  }, [user]);

  // Función para transformar athletes_added a athletes format
  const formatGroupAthletes = (group: any): any => {
    if (!group || !group.athletes_added) return group;

    return {
      ...group,
      athletes: Array.isArray(group.athletes_added)
        ? group.athletes_added
            .filter((reg: any) => reg.registration_pay === null) // Solo sin pagar
            .map((reg: any) => {
              const athlete =
                typeof reg.athlete_id === "object"
                  ? reg.athlete_id
                  : { _id: reg.athlete_id, name: "", lastname: "", ci: "" };
              return {
                _id: athlete._id,
                name: athlete.name,
                lastname: athlete.lastname,
                ci: athlete.ci,
                registrationId: reg._id,
                isPaid: reg.registration_pay != null,
                registrationPayDate: reg.registration_pay,
              };
            })
        : [],
      athletes_added: undefined, // Eliminar el campo original
    };
  };

  if (assistantClubsStatus === "loading") {
    return (
      <div className="wrapper wrapper-content">
        <h3>Cargando clubes...</h3>
      </div>
    );
  }

  // handlers for add member modal, similar to GroupDetail
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
        // verificar si ya está en el grupo no es necesario aquí porque no
        // mostramos aún los miembros; la API devolverá error si ya existe
        addMemberModal.setSearchResult(response.data);
      } else {
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

    if (addMemberModal.memberType === "athlete") {
      // Validar que el atleta no esté ya registrado en el grupo
      const selectedGroup = localClubs
        .flatMap((club) => club.groups || [])
        .find((g: any) => g._id === addMemberModal.selectedGroupId);

      if (selectedGroup) {
        const existingAthlete = selectedGroup.athletes_added?.some(
          (reg: any) => {
            const athleteId =
              typeof reg.athlete_id === "object"
                ? reg.athlete_id._id
                : reg.athlete_id;
            return athleteId === addMemberModal.searchResult._id;
          },
        );

        if (existingAthlete) {
          toastr.error("Este atleta ya está registrado en este grupo");
          addMemberModal.closeModal();
          return;
        }
      }

      const result = await dispatch(
        addAthleteToGroup({
          groupId: addMemberModal.selectedGroupId,
          athleteId: addMemberModal.searchResult._id,
        }),
      );

      // Si la adición fue exitosa, actualizar el grupo en Redux de forma eficiente
      if (result.type === addAthleteToGroup.fulfilled.type) {
        const updatedGroup = result.payload;
        const formattedGroup = formatGroupAthletes(updatedGroup);
        dispatch(updateGroupInAssistantClubs(formattedGroup));
        // Si el modal de atletas está abierto, actualizar también su estado
        if (athletesModalGroup?._id === addMemberModal.selectedGroupId) {
          setAthletesModalGroup(formattedGroup);
        }
        toastr.success("Deportista añadido");
        addMemberModal.closeModal();
      } else if (result.type === addAthleteToGroup.rejected.type) {
        // Mostrar mensaje de error del backend
        const errorMessage = result.payload as string;
        toastr.error(errorMessage || "Error al añadir deportista");
      }
      return;
    }
  };

  const handlePaymentSuccess = (registrationId: string) => {
    // Remover el atleta pagado de la lista sin refrescar
    setLocalClubs((prevClubs) =>
      prevClubs.map((club) => ({
        ...club,
        groups: (club.groups || []).map((group) => ({
          ...group,
          athletes: (group.athletes || []).filter(
            (athlete: any) => athlete.registrationId !== registrationId,
          ),
        })),
      })),
    );
    // Actualizar modal con la lista actualizada
    if (athletesModalGroup) {
      setAthletesModalGroup((prev: any) => ({
        ...prev,
        athletes: (prev.athletes || []).filter(
          (a: any) => a.registrationId !== registrationId,
        ),
      }));
    }
  };

  const handleAthleteDelete = (registrationId: string) => {
    // Remover el atleta eliminado de la lista sin refrescar
    setLocalClubs((prevClubs) =>
      prevClubs.map((club) => ({
        ...club,
        groups: (club.groups || []).map((group) => ({
          ...group,
          athletes: (group.athletes || []).filter(
            (athlete: any) => athlete.registrationId !== registrationId,
          ),
        })),
      })),
    );
    // Actualizar modal con la lista actualizada
    if (athletesModalGroup) {
      setAthletesModalGroup((prev: any) => ({
        ...prev,
        athletes: (prev.athletes || []).filter(
          (a: any) => a.registrationId !== registrationId,
        ),
      }));
    }
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
      toastr.error(error?.response?.data?.message || "Error al crear usuario");
    } finally {
      addMemberModal.setSearchLoading(false);
    }
  };

  // construir un mapa de schedules por group id para mostrar en la tabla
  const schedulesByGroup: Record<string, any[]> = {};
  // Prefer schedules embedded in assistantClubs (backend now returns them),
  // fall back to assistantSchedules endpoint when not available.
  (assistantClubs || []).forEach((club: any) => {
    (club.groups || []).forEach((g: any) => {
      const gid = g._id;
      schedulesByGroup[gid] = schedulesByGroup[gid] || [];
      if (g.schedules && Array.isArray(g.schedules)) {
        g.schedules.forEach((s: any) => {
          schedulesByGroup[gid].push({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
            group_id: gid,
          });
        });
      }
    });
  });

  // add any schedules from assistantSchedules (legacy endpoint) that aren't present
  (assistantSchedules || []).forEach((s: any) => {
    const gid = s.group_id?._id || s.group_id || s.group;
    const groupId = typeof gid === "object" ? gid._id || "" : gid;
    if (!groupId) return;
    schedulesByGroup[groupId] = schedulesByGroup[groupId] || [];
    schedulesByGroup[groupId].push(s);
  });

  // formatea los schedules en el formato solicitado (español, rangos y unión)
  const DAY_ORDER = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const DAY_ES: Record<string, string> = {
    Monday: "lunes",
    Tuesday: "martes",
    Wednesday: "miércoles",
    Thursday: "jueves",
    Friday: "viernes",
    Saturday: "sábado",
    Sunday: "domingo",
  };

  // helpers for day lists
  function joinDayRanges(items: string[]): string {
    // converts [a, b, c] into "a, b y c" or "a y b" or "a"
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return items.join(" y ");
    const allButLast = items.slice(0, -1).join(", ");
    return `${allButLast} y ${items[items.length - 1]}`;
  }

  function formatGroupSchedules(schedules: any[]): string[] {
    if (!schedules || schedules.length === 0) return [];

    // agrupar por horario (start-end)
    const byTime: Record<string, string[]> = {};
    schedules.forEach((s) => {
      const key = `${s.startTime}|${s.endTime}`;
      byTime[key] = byTime[key] || [];
      byTime[key].push(s.day);
    });

    const parts: string[] = [];
    Object.keys(byTime).forEach((key) => {
      const [start, end] = key.split("|");
      const days = (byTime[key] || []).slice();
      days.sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

      // convertir días en rangos consecutivos
      const ranges: string[] = [];
      let i = 0;
      while (i < days.length) {
        let j = i;
        while (
          j + 1 < days.length &&
          DAY_ORDER.indexOf(days[j + 1]) === DAY_ORDER.indexOf(days[j]) + 1
        ) {
          j++;
        }
        const startDay = DAY_ES[days[i]] || days[i];
        const endDay = DAY_ES[days[j]] || days[j];
        if (startDay === endDay) ranges.push(startDay);
        else ranges.push(`${startDay} - ${endDay}`);
        i = j + 1;
      }

      // unir rangos adecuadamente y añadir el rango de horas
      const daysText = joinDayRanges(ranges);
      parts.push(`${daysText} de (${start} : ${end})`);
    });

    return parts;
  }

  if (athletesModalGroup) {
  }
  return (
    <div>
      <NavHeader name="Clubes asignados" />
      <br />
      {assistantClubs && assistantClubs.length > 0 ? (
        localClubs.map((club: any) => (
          <Ibox key={club._id} title={club.name}>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th className="text-center">Horarios</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(club.groups || []).map((g: any) => {
                    const groupSchedules = schedulesByGroup[g._id] || [];
                    const schedulesParts = formatGroupSchedules(groupSchedules);
                    return (
                      <tr key={g._id}>
                        <td>{g.name}</td>
                        <td className="text-center">
                          {schedulesParts && schedulesParts.length > 0
                            ? schedulesParts.map((p: string, idx: number) => (
                                <div key={idx}>{p}</div>
                              ))
                            : "-"}
                        </td>
                        <td className="text-right">
                          <Button
                            className="btn btn-sm btn-primary m-r-sm"
                            onClick={() =>
                              addMemberModal.openModal(g._id, "athlete")
                            }
                          >
                            <i className="fa fa-plus"></i> Inscribir
                          </Button>
                          <Button
                            className="btn btn-sm btn-info"
                            onClick={() => setAthletesModalGroup(g)}
                          >
                            <i className="fa fa-eye"></i> Ver atletas
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Ibox>
        ))
      ) : (
        <p>No estás asignado a ningún club.</p>
      )}

      {/* modal para agregar atletas */}
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

      {/* Modal para ver atletas del grupo */}
      <ViewAthletesModal
        isOpen={athletesModalGroup !== null}
        group={athletesModalGroup}
        onClose={() => setAthletesModalGroup(null)}
        onPaymentSuccess={handlePaymentSuccess}
        onAthleteDelete={handleAthleteDelete}
      />
    </div>
  );
};
