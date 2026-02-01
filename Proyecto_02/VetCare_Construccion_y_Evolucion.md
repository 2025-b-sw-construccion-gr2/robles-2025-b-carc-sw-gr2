# Proyecto 02: Documento de Construcción y Evolución de Software

---

| Campo | Detalle |
|---|---|
| **Nombre del equipo** | Cristian Robles · Jotcelyn Godoy |
| **Nombre del proyecto** | VetCare – Sistema de Gestión Veterinaria |
| **Fecha de entrega** | 31 de enero de 2026 |
| **Curso / Materia** | Construcción y Evolución de Software |

---

## 2. Introducción

El presente proyecto corresponde al desarrollo de **VetCare**, un sistema de gestión veterinaria diseñado para digitalizar y centralizar la información clínica y administrativa de una clínica veterinaria. El objetivo es eliminar los procesos manuales que generan pérdida de datos, desorganización y baja eficiencia operativa.

### 2.1 Problema que resuelve

Las clínicas veterinarias pequeñas y medianas operan frecuentemente con registros en papel, hojas de cálculo desactualizadas y comunicación informal. Esto genera los siguientes problemas:

| Problema identificado | Impacto |
|---|---|
| Manejo manual de historiales médicos | Pérdida de información crónica y retraso en diagnósticos |
| Desorganización de citas | Insatisfacción del cliente y subutilización de recursos |
| Falta de control en tratamientos | Riesgo clínico por omisión de seguimiento |
| Facturación no centralizada | Pérdidas económicas y conflictos con propietarios |
| Sin reportes automáticos | Imposibilidad de evaluar el desempeño de la clínica |

### 2.2 Objetivo del documento

Este documento describe cómo se construye, integra y evoluciona el software VetCare. Cubre la arquitectura del sistema, los pipelines de CI/CD, los flujos de desarrollo colaborativos, la gestión de historias de usuario y las herramientas utilizadas en el proceso.

---

## 3. Arquitectura del Proyecto

### 3.1 Diagrama de alto nivel

El sistema VetCare sigue una arquitectura en capas con separación clara entre la interfaz de usuario, la lógica de negocio y la persistencia de datos.

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                      │
│              React.js  ·  Interfaz Web SPA                   │
└───────────────────────────┬─────────────────────────────────┘
                            │  HTTP / REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API (Servidor)                      │
│         Node.js  ·  Express.js  ·  Lógica de Negocio         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Mascotas │ │  Citas   │ │Consultas │ │  Reportes    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└────────┬────────────────────────────────────────┬───────────┘
         │ ORM (Sequelize)                         │ HTTPS
         ▼                                         ▼
┌─────────────────┐                   ┌─────────────────────┐
│  PostgreSQL DB  │                   │  Servicios externos  │
│  Datos clínicos │                   │  · JWT (Auth)        │
│  y admin        │                   │  · PDF (Reportes)    │
└─────────────────┘                   └─────────────────────┘
```

### 3.2 Componentes principales

| Componente | Tecnología | Responsabilidad |
|---|---|---|
| Frontend Web | React.js (SPA) | Interfaz de usuario para veterinarios y personal administrativo |
| Backend API | Node.js + Express.js | Lógica de negocio, validaciones clínicas y gestión de datos |
| Base de datos | PostgreSQL | Almacenamiento persistente de datos clínicos y administrativos |
| Autenticación | JWT (JSON Web Tokens) | Seguridad de sesiones y control de acceso por roles |
| Generador de reportes | Servicio externo PDF | Creación de reportes exportables para la gerencia |
| ORM | Sequelize | Abstracción de consultas SQL y manejo de modelos de datos |

### 3.3 Entidades principales del sistema

El modelo de datos del sistema está compuesto por las siguientes entidades y sus relaciones:

| Entidad | Atributos principales | Relación clave |
|---|---|---|
| Mascota | id, nombre, especie, raza, edad, estado_activo | Pertenece a un Propietario |
| Propietario | id, nombre, apellido, contacto, correo | Puede tener múltiples Mascotas |
| Veterinario | id, nombre, especialidad, horario | Atiende múltiples Citas |
| Cita | id, fecha, hora, estado, mascota_id, vet_id | Vincula Mascota con Veterinario |
| Consulta | id, diagnóstico, tratamiento, observaciones, cita_id | Asociada a una Cita existente |
| Tratamiento | id, medicamento, dosis, duración, consulta_id | Detalle de la Consulta médica |

### 3.4 Diagrama de relaciones (ER simplificado)

```
  Propietario  ──(1:N)──►  Mascota  ──(1:N)──►  Cita
       │                                           │
       │                                        (1:1)
       │                                           │
       │                                           ▼
       │                                       Consulta  ──(1:N)──►  Tratamiento
       │                                           │
       │                        Veterinario ◄──(N:1)──┘
       │                             │
       └─────────────────────────────┘
                 (referencia indirecta a través de Cita)
```

### 3.5 Estrategia de integración

El frontend consume la API REST del backend para todas las operaciones. El backend aplica reglas de validación clínica antes de persistir datos en PostgreSQL. Por ejemplo, el sistema impide registrar una consulta si la mascota no tiene una cita activa asociada.

**Ejemplo aplicado:** cuando un veterinario registra una consulta, el frontend envía los datos al endpoint `POST /api/consultas`. El backend valida que exista una cita vinculada, persiste el diagnóstico y genera automáticamente una entrada en el historial médico de la mascota.

---

## 4. Estrategia de Pipelines (CI/CD)

El proyecto utiliza **GitHub Actions** como motor de automatización para garantizar la calidad del código y el despliegue controlado en cada etapa del ciclo de vida del software.

### 4.1 Pipeline de Integración Continua (CI)

Se ejecuta automáticamente en cada push a las ramas `develop` y `feature/*`. Su objetivo es detectar errores lo antes posible.

```
  Push a rama feature/* o develop
           │
           ▼
  ┌─────────────────┐
  │  Paso 1: ESLint │  ← Validación de estándares de código
  └────────┬────────┘
           │  ✓ aprobado
           ▼
  ┌─────────────────────┐
  │  Paso 2: Jest Tests │  ← Pruebas unitarias (citas, consultas)
  └────────┬────────────┘
           │  ✓ todas pasan
           ▼
  ┌──────────────────────┐
  │  Paso 3: Build Auto  │  ← Compilación frontend y backend
  └────────┬─────────────┘
           │  ✓ build exitoso
           ▼
  ┌─────────────────────────┐
  │  Paso 4: Deploy Staging │  ← Despliegue en entorno de pruebas
  └─────────────────────────┘
```

| Paso | Acción | Herramienta | Objetivo |
|---|---|---|---|
| 1 | Lint de código | ESLint | Garantizar estándares de estilo consistentes |
| 2 | Pruebas unitarias | Jest | Validar servicios críticos: citas y consultas |
| 3 | Build automático | Webpack / Node | Compilar frontend y backend en artefactos desplegables |
| 4 | Deploy staging | GitHub Actions | Desplegar en entorno de pruebas para validación manual |

### 4.2 Pipeline de Entrega Continua (CD)

El despliegue a producción solo se ejecuta desde la rama `main` y requiere la aprobación formal de un Pull Request revisado por al menos un miembro del equipo.

```
  PR aprobado → merge a main
           │
           ▼
  ┌──────────────────────────┐
  │  Validación final (CI)   │  ← Re-ejecuta todos los pasos del CI
  └────────┬─────────────────┘
           │  ✓ todo pasa
           ▼
  ┌──────────────────────────┐
  │  Deploy a Producción     │  ← Entorno real de la clínica
  └──────────────────────────┘
```

**Ejemplo aplicado:** cuando se añade la funcionalidad de registro de tratamientos médicos, el pipeline CI valida automáticamente que el módulo de consultas no se vea afectado antes de permitir el despliegue en staging. Solo tras la aprobación del PR se despliega en producción.

---

## 5. Estrategia de Flujos de Desarrollo

### 5.1 Modelo de ramas (Git Flow adaptado)

El proyecto adopta un modelo de ramas inspirado en Git Flow, adaptado al contexto de un equipo pequeño y un producto que requiere despliegues frecuentes.

```
  main ─────────●─────────────────────●──── (producción)
                 │                     ▲
                 ▼                     │ merge (PR aprobado)
  develop ───●───●───●────────●────●──┘
             │       │        ▲    ▲
             ▼       ▼        │    │
  feature/   feature/ feature/ merge merge
  mascotas   citas   historial
             │
             ▼
  hotfix/error-historial ──► merge a main + develop
```

| Rama | Propósito | Origen | Merge hacia |
|---|---|---|---|
| `main` | Versión estable en producción | – | – |
| `develop` | Integración de nuevas funcionalidades | main | main (via PR) |
| `feature/registro-mascotas` | Registro y edición de mascotas | develop | develop |
| `feature/gestion-citas` | Agendamiento y cancelación de citas | develop | develop |
| `feature/historial-clinico` | Historial médico de mascotas | develop | develop |
| `hotfix/error-historial` | Corrección urgente de errores clínicos | main | main + develop |

### 5.2 Flujo de trabajo típico

**Ejemplo aplicado:** la funcionalidad del historial médico se desarrolló en la rama `feature/historial-clinico`. Tras completar el desarrollo y ejecutar pruebas exitosas en CI, se abrió un Pull Request hacia `develop`. El equipo revisó el código, se aprobó el PR y se fusionó en `develop` para integración.

---

## 6. Gestión de Historias de Usuario

### 6.1 Formato y historias definidas

Cada historia de usuario sigue el formato: *Como [rol], quiero [funcionalidad], para [beneficio].* A continuación se presentan las historias del backlog actual:

| ID | Rol | Historia de usuario | Prioridad |
|---|---|---|---|
| HU-01 | Veterinario | Quiero registrar diagnósticos y tratamientos, para llevar un historial clínico completo. | 🔴 Alta |
| HU-02 | Recepcionista | Quiero agendar y cancelar citas, para organizar la atención diaria. | 🔴 Alta |
| HU-03 | Administrador | Quiero generar reportes de consultas en PDF, para evaluar el desempeño de la clínica. | 🔴 Alta |
| HU-04 | Veterinario | Quiero ver el historial médico completo de una mascota, para tomar decisiones clínicas informadas. | 🟡 Media |
| HU-05 | Administrador | Quiero registrar y editar información de propietarios, para mantener datos de contacto actualizados. | 🟡 Media |
| HU-06 | Recepcionista | Quiero buscar mascotas por nombre o propietario, para agilizar la atención en recepción. | 🔵 Baja |
| HU-07 | Administrador | Quiero exportar datos de facturación mensual, para realizar rendiciones de cuentas. | 🔵 Baja |

### 6.2 Gestión en Jira / Trello

Cada historia se crea como un ticket individual en el tablero del proyecto. Se asigna una prioridad (Alta, Media, Baja), un responsable y se vincula a un sprint de dos semanas. Cada ticket se enlaza automáticamente con su rama `feature` correspondiente en GitHub.

| Elemento de gestión | Descripción |
|---|---|
| Tickets | Cada HU genera un ticket único con descripción, criterios de aceptación y estimación |
| Prioridad | Alta: funcionalidades críticas del negocio · Media: mejoras importantes · Baja: optimizaciones |
| Sprints | Ciclos de 2 semanas con objetivo definido y revisión al final |
| Trazabilidad | Cada ticket se enlaza con la rama feature y el PR correspondiente |
| Criterios de aceptación | Definidos antes del desarrollo; validados en la revisión del PR |

---

## 7. Estrategia de Revisiones y Aprobaciones

### 7.1 Pull Requests (PRs)

Todo cambio de código debe pasar por un Pull Request antes de integrarse en `develop` o `main`. Los PRs garantizan revisión colaborativa, detección temprana de errores y documentación de los cambios realizados.

| Requisito del PR | Detalle |
|---|---|
| Descripción | Debe incluir qué se desarrolló, por qué y cómo se prueba |
| Revisión obligatoria | Al menos un compañero del equipo debe aprobar |
| CI exitoso | Todos los pasos del pipeline CI deben pasar antes de merge |
| Impacto clínico | Se valida que no afecte funcionalidades existentes |
| Vinculación | Debe estar enlazado al ticket de Jira/Trello correspondiente |

### 7.2 Checklist de revisión

Cada revisor debe verificar los siguientes puntos antes de aprobar un Pull Request:

| # | Criterio de revisión | Estado |
|---|---|---|
| 1 | El código cumple con los estándares de estilo definidos por ESLint | ☐ Pendiente |
| 2 | Las pruebas unitarias están escritas y pasan correctamente | ☐ Pendiente |
| 3 | La documentación relevante ha sido actualizada | ☐ Pendiente |
| 4 | No se introducen vulnerabilidades de seguridad conocidas | ☐ Pendiente |
| 5 | El PR está vinculado al ticket correspondiente en Jira/Trello | ☐ Pendiente |
| 6 | El impacto en módulos existentes ha sido evaluado | ☐ Pendiente |

---

## 8. Herramientas y Conexiones

### 8.1 Resumen de herramientas

| Área | Herramienta | Función en el proyecto |
|---|---|---|
| Gestión de tareas | Jira / Trello | Creación y seguimiento de tickets, planificación de sprints |
| Repositorio de código | GitHub | Almacenamiento del código fuente y control de versiones |
| CI/CD | GitHub Actions | Automatización de pruebas, builds y despliegues |
| Comunicación | Slack / Microsoft Teams | Notificaciones de CI, aprobaciones de PR y comunicación del equipo |
| Linting | ESLint | Validación automática de estándares de código |
| Pruebas | Jest | Ejecución de pruebas unitarias |
| Frontend | React.js | Desarrollo de la interfaz de usuario |
| Backend | Node.js + Express | Servidor API y lógica de negocio |
| Base de datos | PostgreSQL | Almacenamiento persistente |
| ORM | Sequelize | Abstracción de la base de datos |

### 8.2 Integración entre herramientas

```
  ┌─────────┐   tickets    ┌────────┐   commits/PRs   ┌────────┐
  │  Jira /  │ ──────────► │ GitHub │ ──────────────► │ GitHub │
  │  Trello  │             │  Repo  │                 │Actions │
  └─────────┘             └────────┘                 └───┬────┘
       ▲                      │                          │
       │                      │ PR aprobado              │ notificaciones
       │                      ▼                          ▼
       └──────────────── ┌─────────┐              ┌─────────┐
       trazabilidad      │  Slack / │              │  Deploy │
                         │  Teams   │              │Staging/ │
                         └─────────┘              │  Prod   │
                                                  └─────────┘
```

Jira se integra con GitHub para permitir la trazabilidad entre historias de usuario y commits. Los Pull Requests se enlazan automáticamente a los tickets correspondientes y las notificaciones de aprobación se envían al canal de Slack del equipo, manteniendo a todos los miembros informados en tiempo real.

---

## 9. Conclusiones

El proyecto VetCare implementa un conjunto coherente de estrategias de arquitectura, desarrollo y automatización que garantizan la calidad, trazabilidad y evolución controlada del software. La separación en capas (frontend, backend, base de datos) permite un desarrollo modular y mantenible.

Los pipelines de CI/CD implementados con GitHub Actions aseguran que cada cambio sea validado automáticamente antes de llegar a producción, reduciendo el riesgo de errores clínicos en el sistema. El modelo de ramas Git Flow adaptado facilita la colaboración y el control de versiones.

La gestión de historias de usuario mediante Jira/Trello, combinada con sprints de dos semanas y revisiones colaborativas a través de Pull Requests, garantiza un proceso de desarrollo ordenado, trazable y alineado con los objetivos clínicos y administrativos de la clínica veterinaria.

| Estrategia | Beneficio principal |
|---|---|
| Arquitectura en capas | Separación de responsabilidades y mantenibilidad |
| CI/CD con GitHub Actions | Detección temprana de errores y despliegue controlado |
| Git Flow adaptado | Colaboración segura y versiones estables |
| Historias de usuario + Jira | Trazabilidad completa del requisito al código |
| Revisiones por PR | Calidad del código y conocimiento compartido en el equipo |
