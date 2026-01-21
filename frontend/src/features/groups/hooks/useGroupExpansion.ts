/**
 * Hook para manejar el estado de expansión de grupos
 *
 * Gestiona qué grupos están abiertos/cerrados
 */

import { useState, useCallback } from "react";

export function useGroupExpansion() {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroupExpansion = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const isExpanded = useCallback(
    (groupId: string) => expandedGroups.has(groupId),
    [expandedGroups],
  );

  return {
    expandedGroups,
    toggleGroupExpansion,
    isExpanded,
  };
}
