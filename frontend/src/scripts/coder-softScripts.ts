export const SmoothlyMenu = () => {
  const body = document.body;
  const sideMenu = document.getElementById("side-menu");

  if (
    !body.classList.contains("mini-navbar") ||
    body.classList.contains("body-small")
  ) {
    sideMenu.style.display = "none";

    setTimeout(() => {
      sideMenu.style.transition = "opacity 400ms";
      sideMenu.style.opacity = "0";
      sideMenu.style.display = "";
      setTimeout(() => {
        sideMenu.style.opacity = "1";
      }, 10);
    }, 200);
  } else if (body.classList.contains("fixed-sidebar")) {
    sideMenu.style.display = "none";
    setTimeout(() => {
      sideMenu.style.transition = "opacity 400ms";
      sideMenu.style.opacity = "0";
      sideMenu.style.display = "";
      setTimeout(() => {
        sideMenu.style.opacity = "1";
      }, 10);
    }, 100);
  } else {
    sideMenu.removeAttribute("style");
  }
};

/**
 * Añade o quita la clase `body-small` según el ancho actual de la ventana.
 * Se usa para activar estilos responsivos en el CSS que dependen de esa clase.
 */
export const setBodySmall = (breakpoint = 769) => {
  const body = document.body;
  const width = window.innerWidth || document.documentElement.clientWidth;
  if (width < breakpoint) {
    body.classList.add("body-small");
  } else {
    body.classList.remove("body-small");
  }
};

/**
 * Inicializa el listener de resize para mantener `body-small` actualizado.
 * Devuelve una función para remover el listener.
 */
export const initBodySmallListener = (debounceMs = 150) => {
  let t: number | null = null;
  const handler = () => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => {
      setBodySmall();
      t = null;
    }, debounceMs);
  };
  // Ejecutar una vez al iniciar
  setBodySmall();
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
};
