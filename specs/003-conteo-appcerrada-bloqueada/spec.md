# Spec 003 - Mantener el conteo con el celular bloqueado o la app cerrada

Estado: aprobada

HU de origen: docs/historias/HU-003.md

## Contexto y objetivo

El temporizador debe reflejar el tiempo realmente transcurrido aunque el estudiante bloquee el celular o cierre la aplicación. Al volver, debe recuperar la sesión con el tiempo correcto; si una fase terminó, debe reconocerla y dejar preparada la fase siguiente sin iniciarla automáticamente. El estudiante también debe poder recibir un aviso de finalización mientras la aplicación está cerrada, bloqueada o en segundo plano, sujeto a los permisos y configuraciones del celular.

## Usuarios

- Estudiante que desea mantener el tiempo y el avance de su sesión aunque no tenga la aplicación abierta en pantalla.

## Historias de usuario

- Como estudiante, quiero que el temporizador siga contando aunque bloquee el celular o cierre la aplicación, para no perder el tiempo que llevo estudiando.

## Definiciones

- Fase terminada: fase cuyo tiempo configurado ya se cumplió.
- Fase preparada: fase siguiente identificada y lista para que el estudiante la inicie, sin comenzar su cuenta regresiva automáticamente.

## Requisitos funcionales

- RF-1: MIENTRAS el temporizador esté corriendo y el celular permanezca bloqueado, EL SISTEMA descuenta el tiempo transcurrido y, cuando el estudiante lo desbloquea, muestra el tiempo restante correcto. Origen: Escenario «Bloquear el celular».
- RF-2: CUANDO el estudiante cierra la aplicación desde las aplicaciones recientes mientras el temporizador está corriendo y vuelve a abrirla antes de que termine la fase, EL SISTEMA recupera la sesión y muestra el tiempo restante correcto, descontando el tiempo transcurrido. Origen: Escenario «Cerrar la aplicación»; Decisión 3 de HU-002.
- RF-3: CUANDO una fase termina mientras la aplicación está cerrada, EL SISTEMA reconoce la finalización, actualiza el avance correspondiente y deja preparada la fase siguiente sin iniciar otra cuenta regresiva automáticamente. Origen: Escenario «El tiempo termina con la aplicación cerrada»; Decisión 4 de HU-002.
- RF-4: CUANDO una fase termina mientras la aplicación está cerrada, en segundo plano o el celular está bloqueado, EL SISTEMA muestra un aviso que identifica la fase terminada y lo mantiene disponible hasta que el estudiante lo toque o lo descarte. Origen: Escenario «El tiempo termina con la aplicación cerrada»; Decisiones 1, 6 y 7.
- RF-5: CUANDO el estudiante toca el aviso de finalización, EL SISTEMA abre la aplicación y muestra la sesión como terminada. Origen: Decisión 1.
- RF-6: CUANDO el estudiante inicia el temporizador por primera vez, EL SISTEMA explica que el permiso permite recibir avisos al terminar una fase y solicita el permiso de notificaciones. CUANDO el permiso ya fue concedido, EL SISTEMA no vuelve a solicitarlo en cada ciclo completo posterior de pomodoros, compuesto por cuatro sesiones de estudio: las tres primeras con descanso corto y la cuarta con descanso largo. Origen: Decisiones 4 y 9.
- RF-7: SI el permiso de notificaciones sigue denegado en cada ciclo completo posterior de pomodoros, compuesto por cuatro sesiones de estudio: las tres primeras con descanso corto y la cuarta con descanso largo, EL SISTEMA no vuelve a solicitar el permiso del sistema y puede explicar cómo habilitar las notificaciones al comenzar un ciclo. Origen: Decisiones 2, 5 y 9.
- RF-8: SI no se concede el permiso de notificaciones, EL SISTEMA mantiene el temporizador en funcionamiento y, al abrir la aplicación después de que termine una fase, muestra la fase como terminada aunque no se haya mostrado un aviso. Origen: Decisión 2.
- RF-9: CUANDO una fase termina mientras la aplicación está en segundo plano o el celular está bloqueado, EL SISTEMA muestra un aviso con sonido, vibración y notificación si el celular tiene el sonido activado; con vibración y notificación si solo tiene la vibración activada; y únicamente con notificación si el celular está en silencio. Origen: Decisiones 3, 7 y 8.
- RF-10: CUANDO el estudiante pausa el temporizador y luego cierra y vuelve a abrir la aplicación, EL SISTEMA conserva la sesión pausada con el mismo tiempo restante y no muestra un aviso de finalización por esa sesión pausada. Origen: Escenario «Pausar antes de cerrar».

## Requisitos no funcionales

- El tiempo restante y el estado recuperado deben corresponder al tiempo realmente transcurrido, de acuerdo con el principio de exactitud del temporizador de la constitución.
- La función debe ser compatible con la plataforma Android definida por la constitución.

## Casos límite

- La fase termina mientras el estudiante bloquea el celular o la aplicación pasa a segundo plano.
- La fase termina después de cerrar la aplicación y antes de volver a abrirla.
- La aplicación se vuelve a abrir después de que terminó la fase y debe mostrarla como terminada, con la fase siguiente preparada sin inicio automático.
- El permiso de notificaciones no se concede; la sesión y la recuperación de la fase terminada siguen funcionando.
- El temporizador queda pausado antes de cerrar la aplicación y debe recuperarse sin reanudar ni generar un aviso.

## Fuera de alcance

- Iniciar automáticamente la fase siguiente después de una finalización.
- Cambiar las reglas de actualización del avance del ciclo establecidas en HU-002 y sus decisiones.
- Definir nuevas duraciones, fases o configuraciones del temporizador.

## Criterios de finalización

- Al bloquear el celular y desbloquearlo, la aplicación muestra el tiempo restante correcto.
- Al cerrar la aplicación desde las aplicaciones recientes y abrirla de nuevo, la sesión se recupera con el tiempo restante correcto o como fase terminada, según corresponda.
- Si una fase termina con la aplicación cerrada, se muestra el aviso previsto cuando los permisos y las configuraciones del celular lo permiten, y la aplicación recupera la fase como terminada.
- Tocar el aviso abre la aplicación y muestra la sesión terminada; el aviso permanece hasta tocarlo o descartarlo.
- La denegación del permiso no impide el conteo ni la recuperación del estado terminado.
- Una sesión pausada se conserva pausada, con el mismo tiempo restante y sin aviso de finalización.

## Dudas abiertas

No hay dudas abiertas.
