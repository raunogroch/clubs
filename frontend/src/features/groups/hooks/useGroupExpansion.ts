/**
 * Hook para manejar el estado de expansión de grupos
 *
 * Gestiona qué grupos están abiertos/cerrados
 * Solo permite un grupo expandido a la vez (comportamiento de acordeón)
 */

import { useState, useCallback } from "react";

export function useGroupExpansion() {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const toggleGroupExpansion = useCallback((groupId: string) => {
    setExpandedGroupId((prev) => {
      // Si el grupo ya está expandido, lo cierra
      if (prev === groupId) {
        return null;
      }
      // Si es otro grupo, lo expande (cerrando el anterior)
      return groupId;
    });
  }, []);

  const isExpanded = useCallback(
    (groupId: string) => expandedGroupId === groupId,
    [expandedGroupId],
  );

  return {
    expandedGroupId,
    toggleGroupExpansion,
    isExpanded,
  };
}
