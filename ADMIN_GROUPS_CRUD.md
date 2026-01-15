# CRUD de Grupos para Superadmins

## Descripción General

Se ha implementado un **CRUD completo de Grupos de gestión independientes** que solo pueden ser accedidos por los superadmins del sistema. Este módulo permite la creación, edición, eliminación y restauración de grupos administrativos de forma centralizada.

## Cambios Realizados

### Backend (NestJS)

#### 1. Nuevo Módulo: `AdminModule`
- **Ubicación:** `/backend/src/admin/`
- **Descripción:** Módulo raíz que organiza toda la funcionalidad de administración

#### 2. Submódulo: `AdminGroupsModule`
- **Ubicación:** `/backend/src/admin/admin-groups/`
- **Componentes:**

  **Schema (`admin-group.schema.ts`):**
  - Entidad `AdminGroup` con campos:
    - `name`: Nombre del grupo
    - `description`: Descripción
    - `sport`: Deporte (opcional)
    - `category`: Categoría (opcional)
    - `schedule`: Horarios diarios
    - `coaches`: Referencias a usuarios (entrenadores)
    - `athletes`: Referencias a usuarios (atletas)
    - `active`: Flag para soft-delete
    - `createdAt`, `updatedAt`: Timestamps

  **DTOs:**
  - `CreateAdminGroupDto`: Para crear nuevos grupos
  - `UpdateAdminGroupDto`: Para actualizar grupos (parcial)

  **Servicio (`admin-groups.service.ts`):**
  - `create()`: Crear nuevo grupo
  - `findAll()`: Obtener grupos activos
  - `findAllIncludeDeleted()`: Obtener todos incluyendo eliminados
  - `findOne(id)`: Obtener grupo por ID
  - `update(id, payload)`: Actualizar grupo
  - `remove(id)`: Soft-delete (marcar como inactivo)
  - `restore(id)`: Restaurar grupo eliminado

  **Controlador (`admin-groups.controller.ts`):**
  - Rutas protegidas con `JwtAuthGuard` y `RolesGuard`
  - Solo accesible por `SUPERADMIN`
  - Endpoints:
    - `POST /admin/groups` - Crear
    - `GET /admin/groups` - Listar activos
    - `GET /admin/groups/all/including-deleted` - Listar todos
    - `GET /admin/groups/:id` - Obtener por ID
    - `PATCH /admin/groups/:id` - Actualizar
    - `DELETE /admin/groups/:id` - Eliminar
    - `PATCH /admin/groups/:id/restore` - Restaurar

#### 3. Integración en `app.module.ts`
- Importación del `AdminModule`
- Registrado en el array de imports

### Frontend (React + Vite)

#### 1. Servicio API (`services/admin-groups.service.ts`)
- Interfaz `AdminGroup`
- Interfaz `CreateAdminGroupPayload`
- Métodos:
  - `getAll()`: Obtener todos los grupos activos
  - `getAllIncludingDeleted()`: Obtener todos incluyendo eliminados
  - `getById(id)`: Obtener grupo específico
  - `create(payload)`: Crear grupo
  - `update(id, payload)`: Actualizar grupo
  - `delete(id)`: Eliminar grupo (soft-delete)
  - `restore(id)`: Restaurar grupo

#### 2. Componentes

  **AdminGroupsList (`pages/SuperAdmins/AdminGroupsList.tsx`):**
  - Tabla con lista de grupos
  - Búsqueda por nombre y descripción
  - Filtro para mostrar/ocultar eliminados
  - Acciones: Editar, Eliminar, Restaurar
  - Indicador de estado (Activo/Inactivo)

  **AdminGroupForm (`pages/SuperAdmins/AdminGroupForm.tsx`):**
  - Formulario para crear/editar grupos
  - Campos: Nombre, Descripción, Deporte, Categoría
  - Validaciones de campos requeridos
  - Manejo de errores
  - Redirección post-guardado

#### 3. Rutas (`routes/index.tsx`)
- Nuevas rutas agregadas para superadmin:
  - `/admin/groups` - Lista de grupos
  - `/admin/groups/create` - Crear nuevo grupo
  - `/admin/groups/edit/:id` - Editar grupo

#### 4. Exportaciones (`pages/SuperAdmins/index.ts`)
- Exportación de componentes para fácil importación

## Seguridad

✅ **Control de Acceso:**
- Guard de JWT obligatorio
- Guard de roles obligatorio (solo `SUPERADMIN`)
- Decorador `@Roles(Role.SUPERADMIN)` en controlador

✅ **Validación de Datos:**
- DTOs con validaciones mediante `class-validator`
- Tipos TypeScript strict

✅ **Operaciones Seguras:**
- Soft-delete (no eliminación física)
- Restauración de grupos
- Historial de cambios con timestamps

## Estructura de Archivos

```
backend/
├── src/
│   └── admin/
│       ├── admin.module.ts
│       └── admin-groups/
│           ├── admin-groups.controller.ts
│           ├── admin-groups.module.ts
│           ├── admin-groups.service.ts
│           ├── dto/
│           │   ├── index.ts
│           │   ├── create-admin-group.dto.ts
│           │   └── update-admin-group.dto.ts
│           └── schema/
│               ├── index.ts
│               └── admin-group.schema.ts

frontend/
├── src/
│   ├── services/
│   │   └── admin-groups.service.ts
│   ├── pages/
│   │   └── SuperAdmins/
│   │       ├── index.ts
│   │       ├── AdminGroupsList.tsx
│   │       └── AdminGroupForm.tsx
│   └── routes/
│       └── index.tsx
```

## Cómo Usar

### Como Superadmin:

1. **Crear Grupo:**
   - Navegar a `/admin/groups`
   - Clic en "Nuevo Grupo"
   - Completar formulario
   - Guardar

2. **Editar Grupo:**
   - Navegar a `/admin/groups`
   - Clic en botón editar
   - Modificar datos
   - Actualizar

3. **Eliminar Grupo:**
   - Navegar a `/admin/groups`
   - Clic en botón eliminar
   - Confirmación
   - Grupo marcado como inactivo

4. **Restaurar Grupo:**
   - Activar filtro "Mostrar eliminados"
   - Clic en botón restaurar
   - Grupo reactivado

## Próximas Mejoras (Opcionales)

- [ ] Asignación de entrenadores y atletas desde el formulario
- [ ] Gestión de horarios desde la interfaz
- [ ] Exportación de grupos a CSV/Excel
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Paginación en lista de grupos
- [ ] Validación de duplicados de nombres

## API Endpoints Disponibles

```
BASE_URL = /api

POST   /admin/groups                    - Crear grupo
GET    /admin/groups                    - Listar grupos activos
GET    /admin/groups/all/including-deleted - Listar todos
GET    /admin/groups/:id                - Obtener grupo
PATCH  /admin/groups/:id                - Actualizar grupo
DELETE /admin/groups/:id                - Eliminar (soft-delete)
PATCH  /admin/groups/:id/restore        - Restaurar grupo
```

## Testing

Para probar el módulo:

1. Asegúrate de estar logged como superadmin
2. Navega a `/admin/groups` desde el panel
3. Prueba todas las operaciones CRUD
4. Verifica que la lista se actualiza correctamente
5. Comprueba que los filtros funcionan

## Notas Importantes

- Solo los usuarios con rol `SUPERADMIN` pueden acceder a este módulo
- Los grupos eliminados se marcan como `active: false` (soft-delete)
- Todos los cambios se registran con timestamps
- La base de datos es MongoDB
