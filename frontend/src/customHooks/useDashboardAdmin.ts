import { useState, useEffect, useMemo, useCallback } from "react";
import { registrationsService } from "../services/registrationsService";
import clubsService from "../services/clubs.service";
import groupsService from "../services/groups.service";

const calculateTotalAthletes = (breakdown: any): number => {
  if (!breakdown?.clubs) return 0;
  return breakdown.clubs.reduce((total: number, club: any) => {
    return (
      total +
      (club.groups || []).reduce(
        (gTotal: number, group: any) => gTotal + (group.athleteCount || 0),
        0,
      )
    );
  }, 0);
};

const calculateUnpaidAthletes = (breakdown: any): number => {
  if (!breakdown?.clubs) return 0;
  return breakdown.clubs.reduce((totalUnpaid: number, club: any) => {
    return (
      totalUnpaid +
      (club.groups || []).reduce(
        (clubUnpaid: number, group: any) =>
          clubUnpaid + (group.unpaidCount || 0),
        0,
      )
    );
  }, 0);
};

export const useDashboardData = (user: any | undefined) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<any>>([]);
  const [breakdown, setBreakdown] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userService = (await import("../services/userService.ts"))
        .userService;

      try {
        const [res, breakdownRes] = await Promise.all([
          userService.getUnpaidByAssignment(),
          userService.getAthletesBreakdownByAssignment(),
        ]);

        if (res?.code === 200) setItems(res.data || []);
        else setItems([]);

        if (breakdownRes?.code === 200) setBreakdown(breakdownRes.data);
      } catch (e) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const totalAthletes = useMemo(
    () => calculateTotalAthletes(breakdown),
    [breakdown],
  );
  const unpaidCount = useMemo(
    () => calculateUnpaidAthletes(breakdown),
    [breakdown],
  );

  return {
    loading,
    items,
    breakdown,
    totalAthletes,
    unpaidCount,
  };
};

export const useCalendarEvents = (user: any | undefined) => {
  const [calendarGroups, setCalendarGroups] = useState<any[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    const loadGroupsForCalendar = async () => {
      setCalendarLoading(true);
      try {
        const assignmentId = (user as any)?.assignment_id;
        if (!assignmentId) {
          setCalendarGroups([]);
          return;
        }

        const clubs = await clubsService.getAll();
        const myClubs = clubs.filter(
          (c: any) => c.assignment_id === assignmentId,
        );
        const groupsPerClub = await Promise.all(
          myClubs.map(async (c: any) => {
            try {
              const gs = await groupsService.getByClub(c._id);

              // Los grupos ya traen schedules_added desde el backend
              // Simplemente agregar la referencia del club
              const gsWithClub = gs.map((g: any) => ({
                ...g,
                club: c,
                // Asegurar que schedules_added existe (puede venir vacío o no definido)
                schedules_added: g.schedules_added || [],
              }));

              return gsWithClub;
            } catch (e) {
              console.error(`Error loading groups for club ${c._id}:`, e);
              return [];
            }
          }),
        );

        const allGroups = groupsPerClub.flat();
        setCalendarGroups(allGroups);
      } catch (e) {
        console.error("Error loading groups for calendar:", e);
        setCalendarGroups([]);
      } finally {
        setCalendarLoading(false);
      }
    };

    loadGroupsForCalendar();
  }, [user]);

  return {
    calendarGroups,
    calendarLoading,
  };
};

export const useUnpaidModal = (user: any | undefined) => {
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [unpaidAthletes, setUnpaidAthletes] = useState<Array<any>>([]);
  const [unpaidLoading, setUnpaidLoading] = useState(false);

  const handleOpenUnpaidModal = useCallback(async () => {
    setShowUnpaidModal(true);
    setUnpaidLoading(true);

    try {
      const assignmentId = (user as any)?.assignment_id;
      if (!assignmentId) {
        setUnpaidAthletes([]);
        setUnpaidLoading(false);
        return;
      }

      const res =
        await registrationsService.getUnpaidByAssignment(assignmentId);
      if (res.code === 200) {
        setUnpaidAthletes(res.data || []);
      } else {
        setUnpaidAthletes([]);
      }
    } catch (e) {
      setUnpaidAthletes([]);
    } finally {
      setUnpaidLoading(false);
    }
  }, [user]);

  const handleCloseUnpaidModal = useCallback(() => {
    setShowUnpaidModal(false);
    setUnpaidAthletes([]);
  }, []);

  return {
    showUnpaidModal,
    unpaidAthletes,
    unpaidLoading,
    handleOpenUnpaidModal,
    handleCloseUnpaidModal,
  };
};

export const usePaymentModal = () => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [payingId, setPayingId] = useState<string | null>(null);

  const handleOpenPayModal = useCallback((registration: any) => {
    setSelectedRegistration(registration);
    setShowPayModal(true);
    setPaymentAmount("");
  }, []);

  const handleClosePayModal = useCallback(() => {
    setShowPayModal(false);
    setSelectedRegistration(null);
    setPaymentAmount("");
  }, []);

  return {
    showPayModal,
    selectedRegistration,
    paymentAmount,
    payingId,
    handleOpenPayModal,
    handleClosePayModal,
    setPaymentAmount,
    setPayingId,
  };
};

export const useDateEditing = () => {
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editingDateValue, setEditingDateValue] = useState<string>("");
  const [savingDateId, setSavingDateId] = useState<string | null>(null);

  const handleEditDate = useCallback((id: string, currentValue: string) => {
    setEditingDateId(id);
    setEditingDateValue(currentValue);
  }, []);

  const handleCancelDateEdit = useCallback(() => {
    setEditingDateId(null);
    setEditingDateValue("");
  }, []);

  return {
    editingDateId,
    editingDateValue,
    savingDateId,
    handleEditDate,
    handleCancelDateEdit,
    setEditingDateValue,
    setSavingDateId,
  };
};
