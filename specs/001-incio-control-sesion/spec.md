# Spec 001 - Inicio y control de sesión

Estado: aprobada

HU de origen: docs/historias/HU-001.md

## Contexto y objetivo

La aplicación debe permitir a un estudiante iniciar una sesión de estudio y controlar su progreso con precisión. La sesión debe poder iniciarse, pausarse, reanudarse, reiniciarse y terminar sin perder la referencia del tiempo real transcurrido ni forzar decisiones no solicitadas por el estudiante.

## Usuarios

- Estudiante que quiere concentrarse en una sesión de estudio con un temporizador claro y controlado.

## Historias de usuario

- Como estudiante, quiero iniciar un temporizador de estudio para comenzar una sesión con el tiempo configurado.
- Como estudiante, quiero pausar y reanudar la sesión para mantener el control del tiempo sin perder el progreso.
- Como estudiante, quiero reiniciar la sesión para volver al tiempo inicial de la fase actual, con opción a cancelar.
- Como estudiante, quiero que la aplicación conserve el tiempo real transcurrido si la sesión continúa mientras la app está en segundo plano o cerrada.

## Definiciones

- Fase de estudio: periodo de tiempo asignado a la sesión de estudio actual, con un tiempo inicial configurado.
- Tiempo restante: cantidad de tiempo que falta para llegar a 00:00 en la fase activa.
- Sesión terminada: estado en el que la cuenta regresiva ha llegado a 00:00 y el sistema queda detenido hasta que el estudiante decida iniciar la siguiente fase.

## Requisitos funcionales

RF-1: CUANDO el estudiante inicia la sesión desde la pantalla principal, EL SISTEMA comienza la cuenta regresiva con el tiempo de estudio configurado y muestra el tiempo restante en minutos y segundos. Origen: Escenario: Iniciar el temporizador.

RF-2: CUANDO la sesión está en curso, EL SISTEMA permite pausarla y, si el estudiante la reanuda, continúa desde el instante en que fue pausada. Origen: Escenario: Pausar y continuar.

RF-3: CUANDO el estudiante confirma reiniciar la sesión, EL SISTEMA devuelve el temporizador al tiempo inicial de la fase actual y deja la cuenta lista para iniciar de nuevo. Origen: Escenario: Reiniciar el temporizador.

RF-4: CUANDO el estudiante cancela la acción de reinicio, EL SISTEMA conserva el tiempo restante actual y no altera el estado visible ni el progreso de la sesión. Origen: Escenario: Cambiar de opinión al reiniciar.

RF-5: CUANDO la fase de estudio llega a 00:00, EL SISTEMA se detiene, indica que terminó la sesión y deja preparada la siguiente fase sin iniciarla automáticamente. Origen: Decisión 1.

RF-6: CUANDO la aplicación pasa a segundo plano o se cierra mientras la sesión está en curso, EL SISTEMA conserva el tiempo realmente transcurrido y, si el plazo ya venció, muestra que la sesión terminó al volver a la aplicación. Origen: Decisiones 3 y 4.

RF-7: CUANDO la aplicación pasa a segundo plano o se cierra mientras la sesión está pausada, EL SISTEMA conserva el tiempo restante y mantiene la sesión pausada hasta que el estudiante la reanude. Origen: Decisión 6.

RF-8: CUANDO el estudiante no concede permiso de notificaciones, EL SISTEMA permite iniciar y completar la sesión normalmente, y al regresar a la aplicación informa que terminó si corresponde. Origen: Decisión 5.

RF-9: CUANDO la sesión termina mientras la aplicación no está visible, EL SISTEMA emite una notificación que informa que la fase terminó. Origen: Decisión 2.

## Requisitos no funcionales

- No se definen requisitos no funcionales adicionales específicos para esta historia más allá de la precisión del tiempo, la continuidad del estado y la disponibilidad del temporizador sin depender de conexión o registro.

## Casos límite

- La sesión llega exactamente a 00:00 sin que el estudiante haya realizado ninguna acción adicional.
- La aplicación se cierra mientras el temporizador está corriendo.
- La aplicación se cierra mientras el temporizador está pausado.
- El estudiante cancela el reinicio en lugar de confirmarlo.
- El estudiante niega el permiso de notificaciones y la sesión termina en segundo plano.

## Fuera de alcance

- Iniciar automáticamente la siguiente fase después de que termine la de estudio.
- Definir la lógica de configuraciones avanzadas del temporizador, fuera de la fase actual.
- Introducir nuevas reglas de negocio no contempladas por la historia ni por las decisiones registradas.

## Criterios de finalización

- La sesión puede iniciarse, pausarse, reanudarse y reiniciarse sin perder el tiempo restante actual cuando se cancela el reinicio.
- La cuenta regresiva refleja el tiempo realmente transcurrido incluso si la aplicación pasa a segundo plano o se cierra.
- La sesión se detiene en 00:00 y queda preparada para la siguiente fase sin iniciarla automáticamente.
- El estudiante recibe una notificación cuando la sesión termina y la aplicación no está visible, salvo restricciones del sistema que impidan mostrarla.
- El temporizador sigue funcionando aunque el permiso de notificaciones esté denegado.

## Dudas abiertas

- No hay dudas abiertas para esta historia; los escenarios y decisiones establecen el comportamiento esperado.
