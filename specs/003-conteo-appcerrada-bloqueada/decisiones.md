# Decisiones - HU-003: Mantener el conteo con el celular bloqueado o la app cerrada

## 1. Contenido y acción del aviso de finalización

**Pregunta:** ¿Qué debe indicar el aviso cuando una fase termina con la aplicación cerrada y qué debe ocurrir al tocarlo?

**Respuesta:** El aviso identifica la fase que terminó. Al tocarlo, abre la aplicación y muestra la sesión como terminada.

**Motivo:** El estudiante puede reconocer qué finalizó y acceder directamente al estado actualizado de la sesión.

## 2. Finalización sin permiso de notificaciones

**Pregunta:** ¿Qué ocurre si Android no concede permiso para mostrar notificaciones?

**Respuesta:** El temporizador continúa funcionando. Al volver a abrir la aplicación, la fase aparece terminada, aunque no se haya podido mostrar el aviso.

**Motivo:** La recuperación de la sesión no debe depender del permiso de notificaciones.

## 3. Sonido y vibración del aviso

**Pregunta:** ¿Cómo debe comportarse el aviso respecto al sonido y la vibración?

**Respuesta:** Debe respetar las configuraciones del celular: reproducir sonido y vibrar, usar solo vibración o mostrar únicamente la notificación.

**Motivo:** El comportamiento del aviso debe ajustarse a las preferencias del estudiante en el dispositivo.

## 4. Momento de solicitar el permiso

**Pregunta:** ¿Cuándo debe solicitarse el permiso de notificaciones?

**Respuesta:** Se solicita al iniciar el temporizador por primera vez, explicando que permite recibir avisos cuando termina una fase. En los ciclos posteriores no se vuelve a solicitar el permiso del sistema si ya fue concedido.

**Motivo:** El estudiante conoce el propósito de la solicitud y no recibe solicitudes repetidas después de conceder el permiso.

## 5. Permiso aún denegado en ciclos posteriores

**Pregunta:** Si el permiso sigue denegado en ciclos posteriores, ¿debe repetirse la solicitud del sistema o mostrarse una explicación de la aplicación?

**Respuesta:** La aplicación puede volver a explicar cómo habilitar las notificaciones al comenzar un ciclo, pero no debe repetir la solicitud del sistema.

**Motivo:** Se informa al estudiante de la limitación sin insistir con una solicitud que Android ya resolvió.

## 6. Permanencia del aviso

**Pregunta:** ¿Cuánto tiempo debe permanecer el aviso en las notificaciones de Android?

**Respuesta:** Permanece hasta que el estudiante lo toque o lo descarte.

**Motivo:** El estudiante puede consultar el aviso aunque no lo haya visto cuando apareció.

## 7. Aviso al bloquear el celular o dejar la aplicación en segundo plano

**Pregunta:** ¿Debe aparecer el aviso de finalización si el celular está bloqueado o la aplicación está en segundo plano, aunque no se haya cerrado?

**Respuesta:** Sí. El aviso aparece cuando termina una fase activa, incluso si el celular está bloqueado o la aplicación permanece en segundo plano.

**Motivo:** El aviso depende de la finalización de la fase, no de que la aplicación haya sido cerrada.

## Decisiones relacionadas

La recuperación de una fase terminada con la aplicación cerrada, la preparación de la fase siguiente sin iniciarla automáticamente y la conservación del avance del ciclo siguen las decisiones 3 y 4 de [HU-002](../002-estudio-descanso/decisiones.md).

## 8. Aviso según la configuración de sonido del celular

**Pregunta:** ¿Qué combinación de sonido, vibración y notificación debe presentarse al terminar una fase mientras la aplicación está en segundo plano o el celular está bloqueado?

**Respuesta:** Si el celular tiene el sonido activado, el aviso incluye sonido, vibración y notificación. Si solo tiene la vibración activada, incluye vibración y notificación. Si el celular está en silencio, muestra únicamente la notificación.

**Motivo:** El aviso debe respetar el modo de sonido configurado en el celular y comunicar la finalización de la fase.

## 9. Significado de «ciclos posteriores» para los permisos

**Pregunta:** ¿Qué se entiende por «ciclos posteriores» en las reglas para solicitar el permiso de notificaciones?

**Respuesta:** Un ciclo completo de pomodoros comprende cuatro sesiones de estudio: las tres primeras se completan con un descanso corto cada una y la cuarta, con un descanso largo. «Ciclos posteriores» se refiere a cada ciclo completo siguiente, una vez finalizado el ciclo de cuatro sesiones.

**Motivo:** La solicitud y las explicaciones sobre el permiso siguen el ciclo de pomodoros definido en HU-002.
