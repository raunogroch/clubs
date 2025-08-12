```
my-dashboard/
│
├── public/                 # Archivos públicos (favicon, imágenes sin procesar, etc.)
│   ├── img/
│   └── index.html
│
├── src/
│   ├── assets/             # CSS, fuentes, imágenes procesadas por Vite
│   │   ├── style.css
│   │   ├── animate.css
│   │   └── images/
│   │
│   ├── components/         # Componentes reutilizables
│   │   ├── Sidebar.tsx
│   │   ├── TopNavbar.tsx
│   │   ├── Footer.tsx
│   │   └── WidgetCard.tsx
│   │
│   ├── layouts/            # Plantillas de páginas completas
│   │   ├── DashboardLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── pages/              # Páginas o vistas completas
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/              # Custom hooks
│   │   └── useAuth.js
│   │
│   ├── context/            # Context API (estado global)
│   │   └── AuthContext.tsx
│   │
│   ├── services/           # Funciones para API, datos, etc.
│   │   └── api.js
│   │
│   ├── utils/              # Funciones helper
│   │   └── formatDate.js
│   │
│   ├── App.tsx             # Enrutador y estructura base
│   ├── main.tsx            # Punto de entrada de Vite
│   └── router/             # Configuración de rutas
│       └── index.tsx
│
├── package.json
└── vite.config.js

```

# Puntos clave de esta estructura

components/ → Todo lo reutilizable (botones, tarjetas, navbars, etc.).

layouts/ → Esqueletos completos que reutilizan componentes (por ejemplo, Sidebar + Navbar + Footer para el dashboard).

pages/ → Vistas de alto nivel que representan rutas (/dashboard, /login, etc.).

assets/ → Archivos estáticos procesados por Vite (CSS, imágenes, fuentes).

router/ → Configuración de React Router centralizada.

services/ → Llamadas a APIs y lógica de datos.

context/ → Estado global (si usas Context API).

hooks/ → Hooks personalizados (useAuth, useFetch, etc.).

utils/ → Funciones genéricas que no dependen de React.
