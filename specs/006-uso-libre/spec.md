# Spec 006 - Uso libre

Estado: aprobada

HU de origen: docs/historias/HU-006.md

## Contexto y objetivo

La aplicación Temporizador Pomodoro de la Academia Cotopaxi está dirigida a estudiantes que necesitan organizar sus sesiones de estudio y descanso.

Esta historia busca que el estudiante pueda utilizar la aplicación desde la primera apertura, sin crear una cuenta, sin depender de una conexión a internet y sin interrupciones publicitarias.

El objetivo es facilitar el acceso al temporizador y permitir su uso en entornos donde no hay conexión disponible.

## Usuarios

- **Estudiante:** persona que utiliza el temporizador para organizar sus sesiones de estudio y descanso.

## Historias de usuario

Como estudiante, quiero usar la aplicación apenas la instalo, sin crear una cuenta, sin datos móviles y sin anuncios, para empezar a estudiar sin trabas.

## Definiciones

- **Sin conexión:** uso de las funciones principales de la aplicación sin acceso a datos móviles ni wifi.
- **Publicidad:** anuncios, banners o ventanas emergentes cuyo propósito sea promocionar productos o servicios.
- **Ajustes:** configuración de las duraciones de estudio y descanso, y de la cantidad de pomodoros por ciclo.

## Requisitos funcionales

### RF-001: Acceso directo al temporizador

CUANDO el estudiante abra la aplicación por primera vez después de instalarla, EL SISTEMA DEBERÁ mostrar directamente la pantalla principal del temporizador, sin exigir que cree una cuenta, inicie sesión o complete una pantalla de bienvenida obligatoria.

**Origen:** Escenario «Abrir la aplicación por primera vez» de HU-006; decisión D-001 de `decisiones.md`.

### RF-002: Uso del temporizador sin conexión

MIENTRAS el dispositivo no tenga conexión a datos móviles ni wifi, EL SISTEMA DEBERÁ permitir al estudiante utilizar las funciones principales del temporizador.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisiones D-002 y D-005 de `decisiones.md`.

### RF-003: Avisos de finalización sin conexión

CUANDO el temporizador termine una fase mientras el dispositivo no tenga conexión a internet, EL SISTEMA DEBERÁ mantener disponible el mecanismo de aviso de finalización definido para la aplicación, de acuerdo con los requisitos de la HU-004 y los permisos del dispositivo.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisión D-002 de `decisiones.md`; HU-004, «Recibir aviso al terminar el tiempo».

### RF-004: Uso de los ajustes sin conexión

MIENTRAS el dispositivo no tenga conexión a internet, EL SISTEMA DEBERÁ permitir al estudiante consultar y modificar los ajustes del temporizador.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisión D-002 de `decisiones.md`.

### RF-005: Conservación de los ajustes

CUANDO el estudiante guarde sus ajustes y cierre la aplicación, EL SISTEMA DEBERÁ conservar la configuración en el dispositivo para que esté disponible al volver a abrir la aplicación, sin requerir conexión a internet.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisión D-003 de `decisiones.md`; HU-005, «Ajustar los tiempos del pomodoro».

### RF-006: Ausencia de publicidad

EL SISTEMA NO DEBERÁ mostrar anuncios, banners ni ventanas emergentes publicitarias en ninguna de las pantallas de la aplicación.

**Origen:** Escenario «Usarla sin publicidad» de HU-006; decisión D-004 de `decisiones.md`.

### RF-007: Independencia de servicios externos

EL SISTEMA DEBERÁ permitir el funcionamiento de las funciones principales sin depender de servidores o servicios externos que requieran conexión a internet.

**Origen:** Decisión D-005 de `decisiones.md`.

### RF-008: Solo pantallas funcionales

EL SISTEMA NO DEBERÁ ofrecer una pantalla «Explorar» ni controles de prueba visibles para el estudiante; la navegación incluirá únicamente Inicio y Ajustes.

**Origen:** Decisión D-006 de `decisiones.md`.

## Requisitos no funcionales

### RNF-001: Disponibilidad sin conexión

La disponibilidad de las funciones principales no deberá depender de que el dispositivo tenga acceso a internet.

**Origen:** Decisiones D-002 y D-005 de `decisiones.md`.

### RNF-002: Persistencia local

Los ajustes deberán mantenerse disponibles en el dispositivo después de cerrar y volver a abrir la aplicación, de acuerdo con la decisión D-003.

**Origen:** Decisión D-003 de `decisiones.md`.

### RNF-003: Experiencia sin publicidad

La experiencia de uso deberá mantenerse libre de elementos publicitarios en todas las pantallas de la aplicación.

**Origen:** Decisión D-004 de `decisiones.md`.

## Casos límite

- **Primera apertura sin conexión:** la aplicación deberá mostrar directamente el temporizador sin exigir conectividad ni registro.
- **Cierre y reapertura sin conexión:** los ajustes guardados deberán seguir disponibles.
- **Finalización de una fase sin conexión:** el mecanismo de aviso deberá respetar los requisitos de la HU-004 y los permisos del dispositivo.
- **Pantallas sin publicidad:** ninguna pantalla deberá mostrar anuncios, incluidos banners o ventanas emergentes publicitarias.

## Fuera de alcance

- Crear cuentas, iniciar sesión o administrar perfiles de usuario.
- Incorporar publicidad o servicios destinados a mostrar anuncios.
- Incorporar nuevas funciones que dependan de internet y que no estén contempladas en las historias aprobadas.

La posibilidad de incorporar funciones futuras que utilicen internet no queda prohibida por esta historia, siempre que sean aprobadas y no impidan el funcionamiento principal sin conexión.

## Criterios de finalización

- Al abrir la aplicación por primera vez, se muestra directamente el temporizador sin solicitar registro ni inicio de sesión.
- El temporizador puede utilizarse sin datos móviles ni wifi.
- Los avisos de finalización mantienen el comportamiento establecido en la HU-004 cuando no hay conexión.
- Los ajustes pueden consultarse y modificarse sin conexión.
- Los ajustes guardados se conservan al cerrar y volver a abrir la aplicación.
-  Ninguna pantalla muestra anuncios, banners o ventanas emergentes publicitarias.
- Las funciones principales no dependen de servicios externos que requieran conexión a internet.
- La navegación solo incluye Inicio y Ajustes, y la pantalla de inicio no muestra controles de prueba.

## Dudas abiertas

No hay dudas abiertas.
