export const UnassignedMessage = () => (
  <div className="wrapper wrapper-content">
    <div className="middle-box text-center animated fadeInRightBig">
      <h3 className="font-bold text-warning">⚠️ Sin Asignación</h3>
      <div className="error-desc">
        <p>
          Aún no has sido asignado a ningún módulo. Por favor, ponte en contacto
          con el superadministrador para que te asigne a los módulos
          correspondientes.
        </p>
        <p className="text-muted m-t-md">
          Una vez que seas asignado, tendrás acceso a la sección de Usuarios y
          otras funcionalidades.
        </p>
      </div>
    </div>
  </div>
);
