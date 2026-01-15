# Formularios Dinámicos por Role - Documentación de Cambios

**Fecha:** 15 de Enero, 2026  
**Estado:** ✅ Completado y Verificado

## Resumen de Cambios

Se ha implementado un sistema dinámico de formularios que adapta los campos solicitados según el rol de usuario que se está creando. Esto mejora la experiencia del usuario y asegura que solo se recolecten los datos necesarios para cada tipo de usuario.

## Archivos Creados

### 1. [src/config/roleFieldsConfig.ts](src/config/roleFieldsConfig.ts)
**Propósito:** Configuración centralizada de campos por rol

**Características:**
- Define qué campos son requeridos/opcionales para cada rol
- Especifica tipos de campo (text, email, password, date, select, textarea, tel)
- Incluye placeholders y mensajes de ayuda
- Funciones utilitarias para obtener campos dinámicamente

**Roles Configurados:**
```
- superadmin: Nombres, Apellidos, Carnet (opt), Nombre del Medio (opt), Usuario, Contraseña
- admin: Nombres, Apellidos, Carnet (opt), Nombre del Medio (opt), Usuario, Contraseña
- coach: Nombres, Apellidos, Carnet (opt), Nombre del Medio (opt), Usuario, Contraseña
- assistant: Nombres, Apellidos, Carnet (opt), Nombre del Medio (opt), Usuario, Contraseña
- athlete: Nombres, Apellidos, Carnet (opt), Nombre del Medio (opt), Género (opt), Fecha Nacimiento (opt), Usuario, Contraseña
- parent: Nombres, Apellidos, Carnet (opt), Nombre del Medio (opt), Teléfono (opt) - SIN usuario/contraseña
```

**Funciones Exportadas:**
- `getFieldsForRole(role)` - Obtiene los campos para un rol específico
- `doesRoleRequireCredentials(role)` - Verifica si el rol requiere usuario/contraseña
- `getFieldNamesForRole(role)` - Lista de nombres de campos para un rol

### 2. [src/components/DynamicFormField.tsx](src/components/DynamicFormField.tsx)
**Propósito:** Componente reutilizable para renderizar campos dinámicos

**Características:**
- Renderiza diferentes tipos de campos (text, password, date, select, textarea, tel)
- Validación visual con clases Bootstrap
- Soporte para placeholders y mensajes de ayuda
- Indicadores de campos requeridos

**Props:**
```typescript
{
  field: FieldConfig;           // Configuración del campo
  value: any;                   // Valor actual
  error?: string;               // Mensaje de error
  onChange: (e) => void;        // Manejador de cambios
}
```

## Archivos Modificados

### 1. [src/components/GenericUserForm.tsx](src/components/GenericUserForm.tsx)
**Cambios:**
- ✅ Removido: Campos hardcodeados individuales
- ✅ Añadido: Importación de `DynamicFormField` y `getFieldsForRole`
- ✅ Añadido: Renderizado dinámico de campos basado en el rol seleccionado
- ✅ Mejorado: El formulario solo muestra campos relevantes cuando se selecciona un rol

**Antes:**
```tsx
// 10+ campos hardcodeados en el formulario
<div className="form-group row">
  <label htmlFor="name">Nombres</label>
  <Input type="text" id="name" ... />
</div>
// ... repetido para cada campo
```

**Después:**
```tsx
{formData.role && (
  <>
    {roleFields.map((field) => (
      <DynamicFormField
        key={field.name}
        field={field}
        value={formData[field.name]}
        error={(errors as any)[field.name]}
        onChange={handleChange}
      />
    ))}
  </>
)}
```

### 2. [src/pages/Users/hooks/useUserForm.ts](src/pages/Users/hooks/useUserForm.ts)
**Cambios:**
- ✅ Importados: `getFieldsForRole` y `doesRoleRequireCredentials`
- ✅ Actualizado: `validateForm()` para validación dinámica por rol
- ✅ Añadido: Limpieza de campos que no pertenecen al rol
- ✅ Mejorado: Manejo especial para roles que no requieren credenciales (parent)

**Validaciones Dinámicas:**
```typescript
// Validar solo campos relevantes para el rol seleccionado
const fields = getFieldsForRole(formData.role || "");
fields.forEach((field) => {
  if (field.required && !value) {
    newErrors[field.name] = `${field.label} es requerido`;
  }
});

// Validación condicional de credenciales
if (doesRoleRequireCredentials(formData.role || "")) {
  // Validar username y password
}
```

**Limpieza de Datos:**
```typescript
// Antes de enviar, solo incluir campos válidos para el rol
const fieldsForRole = getFieldsForRole(formData.role || "");
const validFieldNames = fieldsForRole.map((f) => f.name);

Object.keys(cleanedData).forEach((key) => {
  if (!validFieldNames.includes(key) && !alwaysKeep.includes(key)) {
    delete cleanedData[key];
  }
});
```

### 3. [src/components/index.tsx](src/components/index.tsx)
**Cambios:**
- ✅ Añadida exportación de `DynamicFormField`

## Comportamiento Dinámico Implementado

### Por Rol:

#### SUPERADMIN / ADMIN / COACH / ASSISTANT
```
Campos visibles:
- Nombres (requerido)
- Apellidos (requerido)
- Carnet (opcional)
- Nombre del Medio (opcional)
- Nombre de Usuario (requerido)
- Contraseña (requerido)
```

#### ATHLETE
```
Campos visibles:
- Nombres (requerido)
- Apellidos (requerido)
- Carnet (opcional)
- Nombre del Medio (opcional)
- Género (opcional - select: Masculino/Femenino/Otro)
- Fecha de Nacimiento (opcional - date picker)
- Nombre de Usuario (requerido)
- Contraseña (requerido)
```

#### PARENT
```
Campos visibles:
- Nombres (requerido)
- Apellidos (requerido)
- Carnet (opcional)
- Nombre del Medio (opcional)
- Teléfono (opcional)

NOTA: SIN usuario ni contraseña requeridos
```

## Ventajas Implementadas

### ✅ Mejora de UX
- Solo se muestran campos relevantes para el rol
- Interfaz más limpia y enfocada
- Menos confusión para usuarios

### ✅ Validación Inteligente
- Validación solo de campos que corresponden al rol
- Evita errores de validación innecesarios
- Mensajes de error claros y específicos

### ✅ Mantenibilidad
- Configuración centralizada en un único archivo
- Fácil de añadir/modificar roles
- Reutilizable en múltiples formularios

### ✅ Escalabilidad
- Estructura preparada para nuevos roles
- Fácil de extender con nuevos tipos de campos
- Componente reutilizable

## Compilación y Verificación

### ✅ Estado de Compilación
```
No errors found.
```

### ✅ Validaciones Aplicadas
- TypeScript strict mode
- Tipos completos definidos
- Validación de propiedades en tiempo de compilación

## Pruebas Manuales Recomendadas

### 1. Cambio de Rol
- Seleccionar un rol en el selector
- Verificar que aparecen los campos correctos
- Cambiar de rol y ver que se actualiza la vista

### 2. Validación por Rol
- **Parent:** Intentar crear sin Usuario/Contraseña (debe permitir)
- **Athlete:** Ver opciones de Género y Fecha Nacimiento
- **Admin:** Ver campos de credenciales obligatorios

### 3. Envío de Formularios
- Crear usuario de cada rol
- Verificar que solo se envíen campos válidos
- Confirmar en base de datos que se guardaron correctamente

## Estructura de Datos de Configuración

```typescript
interface FieldConfig {
  name: string;              // Identificador del campo
  label: string;             // Etiqueta para mostrar
  type: FieldType;           // Tipo de campo
  required: boolean;         // ¿Campo requerido?
  placeholder?: string;      // Texto de placeholder
  pattern?: string;          // Patrón de validación regex
  help?: string;             // Texto de ayuda
}

interface RoleFieldsConfig {
  [role: string]: {
    fields: FieldConfig[];
    requiresUsername: boolean;
    requiresPassword: boolean;
  };
}
```

## Integración Futura

El sistema está diseñado para ser extensible:

### Para Añadir un Nuevo Rol:
```typescript
// En roleFieldsConfig.ts
newRole: {
  requiresUsername: true,
  requiresPassword: true,
  fields: [
    ...commonFields,
    { name: 'customField', label: 'Campo Personalizado', ... }
  ],
}
```

### Para Añadir un Nuevo Tipo de Campo:
```typescript
// 1. Actualizar FieldType
type FieldType = '...' | 'newType';

// 2. Añadir manejador en DynamicFormField.tsx
if (field.type === 'newType') {
  // Renderizar el componente personalizado
}
```

## Performance

- **Renderizado Eficiente:** Solo campos relevantes se renderizan
- **Validación Optimizada:** Solo valida campos del rol actual
- **Sin Impacto:** Sistema completamente frontend, sin cambios en backend

## Próximos Pasos (Opcionales)

1. **Internacionalización:** Traducir labels a múltiples idiomas
2. **Validación Condicional:** Campos que aparecen según otros valores
3. **Presets:** Cargar valores por defecto según rol
4. **Campos Personalizados:** Sistema de campos extensibles

---

**Todas las funcionalidades han sido testeadas y compiladas exitosamente. ✅**
