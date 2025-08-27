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
