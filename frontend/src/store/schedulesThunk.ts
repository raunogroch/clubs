import { createAsyncThunk } from "@reduxjs/toolkit";
import schedulesService from "../services/schedulesService";
import userService from "../services/userService";
import toastr from "toastr";

/**
 * Obtener todos los schedules de un grupo
 */
export const fetchSchedulesByGroupId = createAsyncThunk(
  "schedules/fetchByGroupId",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getByGroupId(groupId);
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener schedules");
      return rejectWithValue(err.message || "Error al obtener schedules");
    }
  },
);

/**
 * Crear nuevo schedule
 */
export const createSchedule = createAsyncThunk(
  "schedules/create",
  async (
    payload: {
      groupId: string;
      schedule: { day: string; startTime: string; endTime: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await schedulesService.create(
        payload.groupId,
        payload.schedule,
      );
      toastr.success("Schedule creado");
      return data;
    } catch (err: any) {
      toastr.error("Error al crear schedule");
      return rejectWithValue(err.message || "Error al crear schedule");
    }
  },
);

/**
 * Actualizar schedule
 */
export const updateSchedule = createAsyncThunk(
  "schedules/update",
  async (
    payload: {
      groupId: string;
      scheduleId: string;
      schedule: { day?: string; startTime?: string; endTime?: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await schedulesService.update(
        payload.groupId,
        payload.scheduleId,
        payload.schedule,
      );
      toastr.success("Schedule actualizado");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar schedule");
      return rejectWithValue(err.message || "Error al actualizar schedule");
    }
  },
);

/**
 * Eliminar schedule
 */
export const deleteSchedule = createAsyncThunk(
  "schedules/delete",
  async (
    payload: { groupId: string; scheduleId: string },
    { rejectWithValue },
  ) => {
    try {
      await schedulesService.delete(payload.groupId, payload.scheduleId);
      toastr.success("Schedule eliminado");
      return payload.scheduleId;
    } catch (err: any) {
      toastr.error("Error al eliminar schedule");
      return rejectWithValue(err.message || "Error al eliminar schedule");
    }
  },
);

/**
 * Reemplazar todos los schedules (batch)
 */
export const replaceBatchSchedules = createAsyncThunk(
  "schedules/replaceBatch",
  async (
    payload: {
      groupId: string;
      schedules: Array<{ day: string; startTime: string; endTime: string }>;
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await schedulesService.replaceBatch(
        payload.groupId,
        payload.schedules,
      );
      toastr.success("Schedules actualizados");
      return data;
    } catch (err: any) {
      toastr.error("Error al actualizar schedules");
      return rejectWithValue(err.message || "Error al actualizar schedules");
    }
  },
);

/**
 * Obtener todos los schedules para el calendario del admin
 * Endpoint optimizado para mejor rendimiento
 */
export const fetchAdminSchedules = createAsyncThunk(
  "schedules/fetchAdminSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getAdminSchedules();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener horarios");
      return rejectWithValue(err.message || "Error al obtener horarios");
    }
  },
);

// athlete schedules
export const fetchAthleteSchedules = createAsyncThunk(
  "schedules/fetchAthlete",
  async (_, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getAthleteSchedules();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener horarios del atleta");
      return rejectWithValue(
        err.message || "Error al obtener horarios del atleta",
      );
    }
  },
);

// parent schedules
export const fetchParentSchedules = createAsyncThunk(
  "schedules/fetchParent",
  async (_, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getParentSchedules();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener horarios del padre");
      return rejectWithValue(
        err.message || "Error al obtener horarios del padre",
      );
    }
  },
);

// assistant schedules
export const fetchAssistantSchedules = createAsyncThunk(
  "schedules/fetchAssistant",
  async (_, { rejectWithValue }) => {
    try {
      const data = await schedulesService.getAssistantSchedules();
      return data;
    } catch (err: any) {
      toastr.error("Error al obtener horarios del asistente");
      return rejectWithValue(
        err.message || "Error al obtener horarios del asistente",
      );
    }
  },
);

/**
 * Recupera los mismos datos que el hook `useParentSchedules` hacía manualmente.
 *
 * El objetivo de este thunk es mover todas las llamadas HTTP fuera del hook,
 * dejándolo únicamente con lógica de suscripción a estado y despacho de
 * acciones. Devuelve un arreglo de `Group` con horarios y atletas filtrados
 * por los hijos del padre.
 */
export const fetchParentCalendarGroups = createAsyncThunk(
  "schedules/fetchParentCalendarGroups",
  async (_, { rejectWithValue }) => {
    try {
      // 1. schedules base proporcionados por el endpoint optimizado
      const schedulesData: any[] = await schedulesService.getParentSchedules();

      // 2. los atletas asignados al padre
      const athletesResp = await userService.getMyAthletes();
      const myAthletes: any[] =
        athletesResp.code === 200 && Array.isArray(athletesResp.data)
          ? athletesResp.data
          : [];
      const childIds: string[] = myAthletes.map((a) => a._id);

      // 3. construir map de grupos con horarios
      const groupsMap: Record<string, any> = {};
      (schedulesData || []).forEach((item: any) => {
        const gid = item.group_id || item.group_id?._id || item.group;
        const groupId = typeof gid === "object" ? gid._id || "" : gid;
        if (!groupId) return;

        if (!groupsMap[groupId]) {
          groupsMap[groupId] = {
            _id: groupId,
            name: item.group_name || item.name || "",
            club_id:
              item.club_id || (item.club ? item.club : { _id: "", name: "" }),
            schedules_added: [],
            events_added: [],
            athletes: [],
          };
        }
        groupsMap[groupId].schedules_added =
          groupsMap[groupId].schedules_added || [];
        groupsMap[groupId].schedules_added.push({
          day: item.day,
          startTime: item.startTime || item.start_time || item.start,
          endTime: item.endTime || item.end_time || item.end,
        });
      });

      // 4. si hay grupos y niños, obtener registros para cada grupo y filtrar
      const groupIds = Object.keys(groupsMap);
      if (groupIds.length > 0 && childIds.length > 0) {
        const token = localStorage.getItem("token");
        const regsPromises = groupIds.map((gid) =>
          fetch(
            `${import.meta.env.VITE_BACKEND_URI}/api/registrations/group/${gid}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ).then((r) => ({
            gid,
            ok: r.ok,
            data: r.ok ? r.json() : null,
          })),
        );
        const regsResults = await Promise.all(regsPromises);

        for (const res of regsResults) {
          if (!res.ok) continue;
          const regs = await res.data;
          const athletesInGroup = (regs || [])
            .filter((reg: any) =>
              childIds.includes(reg.athlete_id?._id || reg.athlete_id),
            )
            .map((reg: any) => ({
              _id: reg.athlete_id._id,
              name: reg.athlete_id.name,
              lastname: reg.athlete_id.lastname,
            }));
          if (athletesInGroup.length > 0 && groupsMap[res.gid]) {
            groupsMap[res.gid].athletes = athletesInGroup;
          }
        }
      }

      return Object.values(groupsMap);
    } catch (err: any) {
      toastr.error("Error al obtener horarios del padre");
      return rejectWithValue(
        err.message || "Error al obtener horarios del padre",
      );
    }
  },
);
