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
    description: "",
    club_id: clubId,
  });

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      club_id: clubId,
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
        description: group.description || "",
        club_id: clubId,
      });
    },
    [clubId],
  );

  const updateField = useCallback(
    (field: keyof GroupFormState, value: string) => {
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
