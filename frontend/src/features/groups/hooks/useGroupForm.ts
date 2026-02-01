/**
 * Hook para manejar el estado de grupos
 *
 * Centraliza toda la lógica de estado relacionada con grupos,
 * facilitando el testing y reutilización.
 */

import { useState, useCallback } from "react";
import type { Group, GroupFormState } from "../types";

export function useGroupForm(clubId: string) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GroupFormState>({
    name: "",
    club_id: clubId,
    monthly_fee: undefined,
  });

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({
      name: "",
      club_id: clubId,
      monthly_fee: undefined,
    });
  }, [clubId]);

  const openForCreate = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const openForEdit = useCallback(
    (group: Group) => {
      setEditingId(group._id);
      setFormData({
        name: group.name,
        club_id: clubId,
        monthly_fee: group.monthly_fee,
        club_id: clubId,
        monthly_fee: group.monthly_fee,
      });
    },
    [clubId],
  );

  const updateField = useCallback(
    (field: keyof GroupFormState, value: string | number | undefined) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  return {
    editingId,
    formData,
    resetForm,
    openForCreate,
    openForEdit,
    updateField,
  };
}
