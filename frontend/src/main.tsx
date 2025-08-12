import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Navigation } from "./components";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./layouts/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Navigation>
      <RouterProvider router={router} />
    </Navigation>
  </StrictMode>
);
