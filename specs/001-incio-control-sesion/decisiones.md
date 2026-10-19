# Decisiones - HU-001: Iniciar y controlar una sesión de estudio

## 1. Comportamiento al terminar la sesión

**Pregunta:** ¿Qué debería ocurrir cuando termina el tiempo de estudio?

**Respuesta:** El temporizador se detiene en `00:00`, indica que terminó la sesión y deja que el estudiante inicie la siguiente fase.

**Motivo:** La fase siguiente no debe comenzar automáticamente; el estudiante decide cuándo iniciarla, de acuerdo con la constitución del proyecto.

## 2. Aviso cuando la app no está visible

**Pregunta:** Si el temporizador llega a `00:00` en segundo plano o con la app cerrada, ¿cómo debería avisar al estudiante?

**Respuesta:** Mostrar una notificación. El sonido y/o la vibración dependen de los permisos y ajustes del sistema.

**Motivo:** El estudiante debe poder enterarse de que terminó la fase, respetando los permisos y preferencias configurados en Android.

## 3. Cerrar la app mientras el temporizador corre

**Pregunta:** Si el estudiante cierra la app mientras el temporizador corre y la abre después, ¿debe continuar con el tiempo realmente transcurrido o volver al estado anterior al cierre?

**Respuesta:** La cuenta continúa considerando el tiempo realmente transcurrido. Si ya venció, se muestra la sesión terminada.

**Motivo:** La constitución requiere que el tiempo restante refleje el tiempo realmente transcurrido aunque la app deje de ejecutarse temporalmente.

## 4. Reiniciar después de terminar

**Pregunta:** Una vez que la sesión llegó a `00:00`, ¿debería permitirse reiniciar el temporizador de estudio o la sesión debe quedarse terminada hasta iniciar la siguiente fase?

**Respuesta:** La sesión queda terminada; se pasa a la siguiente fase solo cuando el estudiante decide iniciarla.

**Motivo:** Mantiene la decisión del estudiante y evita repetir o iniciar fases sin una acción explícita.

## 5. Permiso de notificaciones denegado

**Pregunta:** Si el estudiante no concede permiso para las notificaciones, ¿la app debería seguir el temporizador o impedir iniciar la sesión?

**Respuesta:** Se permite iniciar y completar la sesión normalmente. Al volver a la app, se muestra que terminó, sin exigir el permiso para usar el temporizador.

**Motivo:** El permiso de notificaciones no debe bloquear la función principal del temporizador.

## 6. Cerrar la app mientras el temporizador está pausado

**Pregunta:** Si el estudiante pausa el temporizador y cierra la app, ¿al volver debe seguir pausado con el mismo tiempo restante?

**Respuesta:** Sí. El tiempo queda en pausa y la cuenta continúa cuando el estudiante la reanuda.

**Motivo:** Respeta la pausa elegida por el estudiante y evita que el tiempo avance mientras la sesión está pausada.
