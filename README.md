# 🏥 OptiSalud — Sistema de Gestión Oftalmológica

## Dr. Juan D. Lozada S.
**Optómetra F.U.A.A. | TP 1.010.201.450 | RM 3945 CTNPO**

> *"Mejorar tu visión es mi misión"*

---

## 📋 Descripción

OptiSalud es una aplicación web profesional para la gestión integral de un consultorio oftalmológico. Reemplaza el formulario físico de historia clínica por un sistema digital completo. Funciona **completamente offline**, almacenando todos los datos en el navegador del usuario mediante IndexedDB.

---

## 🚀 Stack Tecnológico

| Tecnología | Uso |
|-----------|-----|
| **React 18** + TypeScript | Interfaz de usuario |
| **Vite** | Bundler y servidor de desarrollo |
| **Tailwind CSS** | Estilos utilitarios |
| **Radix UI** | Componentes accesibles (shadcn/ui) |
| **Dexie.js** | Base de datos IndexedDB |
| **Recharts** | Gráficas y visualizaciones |
| **SheetJS (xlsx)** | Exportación a Excel |
| **react-to-print** | Impresión de fórmulas y certificados |
| **React Router v6** | Navegación SPA |
| **Zustand** | Estado global |

---

## 📦 Módulos

| # | Módulo | Ruta | Descripción |
|---|--------|------|-------------|
| 1 | **Layout Base** | — | Sidebar fija + Header + Router |
| 2 | **Base de Datos** | — | Dexie.js: pacientes, historias, citas |
| 3 | **Dashboard** | `/` | Estadísticas, gráficas, citas del día |
| 4 | **Pacientes** | `/pacientes` | CRUD con búsqueda y paginación |
| 5 | **Historia Clínica** | `/nueva-historia` | Formulario completo de 10 secciones |
| 6 | **Perfil Paciente** | `/pacientes/:id` | Timeline + gráficas de evolución |
| 7 | **Fórmula Óptica** | (componente) | Impresión con membrete del consultorio |
| 8 | **Certificado Médico** | (componente) | Certificado formal imprimible |
| 9 | **Agenda de Citas** | `/citas` | Calendario mensual con estados |
| 10 | **Reportes / Excel** | `/reportes` | Exportación completa en 3 hojas |

---

## 🎨 Paleta de Diseño

```css
--primary:       #1a3a5c   /* Azul marino oscuro */
--primary-light: #2d6a9f   /* Azul medio */
--accent:        #c9a84c   /* Dorado médico */
--background:    #f0f4f8   /* Gris azulado muy claro */
--surface:       #ffffff
--text:          #1e2a3a
--text-muted:    #6b7a8d
--success:       #2e7d52
--danger:        #c0392b
--border:        #d1dce8
```

**Tipografía:** Playfair Display (títulos) + DM Sans (cuerpo)

---

## 🛠️ Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/jeffersondquirogale-arch/software-oftalmologico.git
cd software-oftalmologico

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## 💾 Base de Datos

Todos los datos se almacenan **localmente en el navegador** mediante IndexedDB (Dexie.js):

- **`pacientes`** — Datos demográficos y antecedentes
- **`historiasClinicas`** — Registros clínicos completos (lensometría, agudeza visual, fórmula óptica, diagnóstico)
- **`citas`** — Agenda con estados: pendiente / confirmada / atendida / cancelada

> ⚠️ **Privacidad:** Los datos nunca salen del navegador. No hay comunicación con servidores externos.

---

## 🖨️ Impresión

La aplicación incluye dos documentos imprimibles con el membrete del consultorio:

1. **Fórmula Óptica** — Con tabla OD/OI (ESF, CYL, EJE, ADD, DNP, AV), uso, diagnóstico y firma
2. **Certificado Médico** — Documento formal con hallazgos clínicos y firma del profesional

El modo de impresión oculta automáticamente la barra lateral y los controles de la interfaz.

---

## 📊 Exportación Excel

Desde la sección **Reportes**, se puede exportar un archivo Excel completo con:
- **Hoja 1:** Lista de pacientes
- **Hoja 2:** Historias clínicas
- **Hoja 3:** Citas

Nombre del archivo: `optisalud_backup_YYYY-MM-DD.xlsx`

---

## 📄 Licencia

Proyecto privado — Dr. Juan D. Lozada S. © 2024
