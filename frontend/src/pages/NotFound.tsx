import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="text-white">
      <div className="middle-box text-center animated fadeInDown">
        <h1>404</h1>
        <h3 className="font-bold">Pagina no encontrada</h3>

        <div className="error-desc">
          Lo sentimos, pero no hemos encontrado la página que buscas. Por favor,
          verifica si la URL tiene algún error, luego presiona el botón de
          volver al menu principal <br />
          <br />
          <button type="submit" className="btn btn-xs btn-danger" onClick={handleBack}>
            Volver al menú principal
          </button>
        </div>
      </div>
    </div>
  );
};
