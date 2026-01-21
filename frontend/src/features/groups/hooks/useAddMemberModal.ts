/**
 * Hook para manejar el modal de agregar miembros
 *
 * Gestiona el estado de búsqueda y creación de nuevos miembros
 */

import { useState, useCallback } from "react";
import type { User, MemberType, CreateUserData } from "../types";

export function useAddMemberModal() {
  const [showModal, setShowModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [memberType, setMemberType] = useState<MemberType | null>(null);
  const [searchCi, setSearchCi] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    name: "",
    lastname: "",
    ci: "",
    username: "",
  });

  const openModal = useCallback((groupId: string, type: MemberType) => {
    setSelectedGroupId(groupId);
    setMemberType(type);
    setSearchCi("");
    setSearchResult(null);
    setShowCreateUserForm(false);
    setCreateUserData({
      name: "",
      lastname: "",
      ci: "",
      username: "",
    });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedGroupId(null);
    setMemberType(null);
    setSearchCi("");
    setSearchResult(null);
    setShowCreateUserForm(false);
    setCreateUserData({
      name: "",
      lastname: "",
      ci: "",
      username: "",
    });
  }, []);

  const updateCreateUserData = useCallback(
    (field: keyof CreateUserData, value: string) => {
      setCreateUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  return {
    // Estados
    showModal,
    selectedGroupId,
    memberType,
    searchCi,
    searchResult,
    searchLoading,
    showCreateUserForm,
    createUserData,
    // Setters
    setSearchCi,
    setSearchResult,
    setSearchLoading,
    setShowCreateUserForm,
    updateCreateUserData,
    // Métodos
    openModal,
    closeModal,
  };
}
