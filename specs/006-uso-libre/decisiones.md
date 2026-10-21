# Decisiones de la HU-006 — Uso sin registro, internet ni publicidad

## Contexto

La HU-006 busca que los estudiantes puedan utilizar el Temporizador Pomodoro de la Academia Cotopaxi desde la primera apertura, sin crear una cuenta, sin depender de una conexión a internet y sin interrupciones publicitarias.

Las siguientes decisiones concretan el comportamiento esperado antes de redactar la especificación.

## D-001: Acceso directo a la aplicación

**Decisión:** La aplicación abrirá directamente la pantalla principal del temporizador, incluso en el primer inicio.

**Justificación:** El estudiante debe poder comenzar a utilizar la aplicación sin pasos previos innecesarios.

**Consecuencias:**
- No se solicitará crear una cuenta ni iniciar sesión.
- No se mostrará una pantalla de bienvenida obligatoria antes del temporizador.

## D-002: Funcionamiento sin conexión

**Decisión:** Las funciones principales del temporizador, los ajustes y los avisos de finalización deberán funcionar sin conexión a internet.

**Justificación:** El estudiante debe poder estudiar aunque no tenga datos móviles ni acceso a una red wifi.

**Consecuencias:**
- El funcionamiento principal no dependerá de un servidor.
- Los avisos de finalización deberán apoyarse en mecanismos locales del dispositivo, coordinados con la HU-004.
- La aplicación no deberá necesitar conexión para consultar o utilizar los ajustes guardados.

## D-003: Persistencia local de los ajustes

**Decisión:** Los ajustes del usuario se guardarán en el dispositivo y estarán disponibles al volver a abrir la aplicación, sin requerir conexión a internet.

**Justificación:** El estudiante no debería tener que configurar nuevamente sus tiempos cada vez que abre la aplicación.

**Consecuencias:**
- La configuración se conservará entre aperturas de la aplicación.
- Esta decisión se coordinará con la HU-003, que define la recuperación de la sesión del temporizador.

## D-004: Ausencia de publicidad

**Decisión:** La aplicación no mostrará publicidad en ninguna de sus pantallas.

**Justificación:** El objetivo es ofrecer una experiencia de estudio sin interrupciones.

**Consecuencias:**
- No aparecerán anuncios, banners ni ventanas emergentes publicitarias.
- No se incorporarán servicios o SDK destinados a mostrar anuncios.

## D-005: Independencia de servicios externos para las funciones principales

**Decisión:** Las funciones principales de la aplicación no dependerán de servicios externos ni de una conexión a internet para funcionar.

**Justificación:** El temporizador debe seguir siendo útil en entornos sin conectividad.

**Consecuencias:**
- El funcionamiento básico deberá resolverse en el dispositivo.
- Esta decisión no prohíbe por sí sola posibles funciones futuras que utilicen internet, siempre que sean aprobadas y no impidan el funcionamiento principal sin conexión.

## D-006: Solo pantallas funcionales para el estudiante

**Decisión:** La aplicación solo ofrecerá las pantallas Inicio y Ajustes. Se retiran la pestaña «Explorar» (contenido de plantilla en inglés con enlaces a sitios externos) y el control «Restablecer notificaciones (prueba)» de la pantalla de inicio.

**Justificación:** Lo solicitó la usuaria. El estudiante debe empezar a estudiar sin contenido ajeno al temporizador, y los enlaces externos necesitan conexión a internet.

**Consecuencias:**
- La navegación mostrará únicamente Inicio y Ajustes.
- La pantalla de inicio no mostrará controles de prueba. Las marcas locales de notificaciones se restablecen borrando los datos de la aplicación desde los ajustes del dispositivo.
- No se desinstalan dependencias ni se borran otros componentes en esta historia.

## Relación con otras historias

- **HU-003:** Coordinar la persistencia y recuperación de la sesión cuando se cierra y vuelve a abrir la aplicación.
- **HU-004:** Coordinar los avisos locales de finalización y su funcionamiento sin conexión.
- **HU-005:** Mantener la configuración de los tiempos disponible sin conexión.

## Estado

Decisiones aceptadas por la usuaria. Pendiente redactar y revisar `spec.md` antes de generar el plan y las tareas.
