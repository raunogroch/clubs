/**
 * Punto de entrada principal de la aplicación React
 * 
 * Este archivo:
 * 1. Crea la raíz de React en el DOM (elemento #root en index.html)
 * 2. Configura Redux para gestión de estado global
 * 3. Activa StrictMode para detectar problemas en desarrollo
 * 
 * Flujo:
 * main.tsx (este archivo)
 *   ↓
 * App.tsx (componente principal)
 *   ↓
 * Rutas y componentes de la aplicación
 */

import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { StrictMode } from "react";

// Renderizar la aplicación React en el elemento con id="root"
createRoot(document.getElementById("root")!).render(
  // StrictMode activa verificaciones adicionales en desarrollo
  // (detecta componentes no optimizados, efectos duplicados, etc)
  <StrictMode>
    {/* Provider de Redux proporciona el estado global a toda la aplicación */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
