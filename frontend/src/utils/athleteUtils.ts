export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export const formatDateWithLiteralMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatted = date.toLocaleDateString("es-ES", options);
  const parts = formatted.split(" ");
  if (parts.length === 3) {
    return `${parts[2]}, ${parts[0]} de ${parts[1]}`;
  }
  return formatted;
};

export const genderLabel = (g: string | undefined | null): string => {
  if (!g) return "-";
  const map: Record<string, string> = {
    male: "Masculino",
    female: "Femenino",
    other: "Otro",
  };
  return map[g] || "-";
};

export const generateUsername = (name: string, lastname: string): string => {
  return ((name?.charAt(0) || "") + lastname || "")
    .toLowerCase()
    .replace(/\s/g, "");
};

export const generatePassword = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const downloadPDF = async (
  pdfPath: string,
  fileName: string = "documento.pdf",
): Promise<void> => {
  try {
    let absoluteUrl = pdfPath;
    if (!pdfPath.startsWith("http")) {
      const filesProcessorApi =
        import.meta.env.VITE_FILES_PROCESSOR_API || "http://localhost:4001";
      absoluteUrl = `${filesProcessorApi}${pdfPath}`;
    }
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`Error al descargar el archivo: ${error}`);
  }
};

export const FORM_INITIAL_STATE = {
  name: "",
  lastname: "",
  username: "",
  ci: "",
  phone: "",
  gender: "",
  birth_date: "",
  active: true,
  images: { small: "", medium: "", large: "" },
  documentPath: "",
  parent: {
    name: "",
    lastname: "",
    ci: "",
    phone: "",
  },
  createdAt: "",
};

export const PARENT_INITIAL_STATE = {
  name: "",
  lastname: "",
  ci: "",
  phone: "",
};
