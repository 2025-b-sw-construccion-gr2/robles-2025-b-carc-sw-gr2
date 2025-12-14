# 📄 Proyecto 001: Plan Maestro de Gestión de Configuración de Software (SCM)

## 👥 Grupo e Identificación
[cite_start]*Asignatura:* Construcción de Software [cite: 3, 5]
[cite_start]*Periodo:* 2025-B [cite: 5]
[cite_start]*Integrantes:* Jotcelyn Godoy, Cristian Robles [cite: 6]

---

## 🎯 1. Proyecto: "UniTask"
[cite_start]*Descripción:* UniTask es una aplicación web diseñada para ayudar a estudiantes universitarios a gestionar sus tareas académicas de forma organizada[cite: 10, 12]. [cite_start]Permite registrar materias, crear tareas con fechas límite, asignar prioridades y marcar el progreso de cada actividad[cite: 13]. [cite_start]Su objetivo principal es mejorar la planificación del tiempo y reducir el riesgo de atrasos en entregas académicas[cite: 14].

---

## 🛠️ 2. Resumen del Plan Maestro de SCM

[cite_start]Este plan establece las reglas y procesos para asegurar un proyecto mantenible y controlado[cite: 17].

### 2.1 Entorno y Workflow

| Criterio | [cite_start]Configuración [cite: 22, 23, 24] | Descripción |
| :--- | :--- | :--- |
| *Control de Versiones* | Git / GitHub | [cite_start]Plataforma de alojamiento[cite: 22, 23]. |
| *Rama Principal* | main | [cite_start]Rama protegida; no se permiten pushes directos[cite: 37, 38, 39]. |
| *Flujo de Trabajo* | GitHub Flow (Variante) | [cite_start]Toda integración se realiza mediante Pull Requests (PR)[cite: 41, 43, 51]. |
| *Trazabilidad* | GitHub Issues | [cite_start]Cada funcionalidad o corrección debe estar asociada a un Issue[cite: 79]. |

### 2.2 Calidad y Definición de Hecho (Definition of Done)

Un Pull Request solo podrá fusionarse a main si cumple con:
* [cite_start]Revisión y aprobación de al menos un integrante del equipo[cite: 74].
* [cite_start]Ausencia de errores de compilación[cite: 75].
* [cite_start]Cumplimiento de las normas básicas de estilo[cite: 76].
* [cite_start]Documentación correcta cuando sea necesaria[cite: 77].

### 2.3 Gestión de Releases y Mantenimiento

* [cite_start]*Integración Continua (CI):* Se utilizará GitHub Actions para la ejecución de pruebas básicas y validación automática antes de la fusión, previniendo que código defectuoso llegue a main[cite: 85, 86, 91, 92].
* [cite_start]*Versionamiento:* Se implementa el *Versionamiento Semántico* (MAJOR.MINOR.PATCH)[cite: 107]. Los incrementos definidos son:
    * [cite_start]PATCH: Corrección de errores[cite: 110].
    * [cite_start]MINOR: Nuevas funcionalidades compatibles[cite: 111].
    * [cite_start]MAJOR: Cambios que rompen compatibilidad[cite: 112].
* [cite_start]*Mantenimiento Correctivo:* Los errores críticos se manejan mediante ramas hotfix/, que se fusionan a main y liberan una nueva versión PATCH[cite: 119, 120, 123].
* [cite_start]*Mantenimiento Preventivo:* Uso de herramientas automáticas (como Dependabot) para detectar vulnerabilidades y actualizar dependencias inseguras[cite: 136, 138, 140].*