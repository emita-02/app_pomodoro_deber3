# Decisiones - HU-004: Recibir aviso al terminar el tiempo

## 1. Iniciar el temporizador sin permiso de notificaciones

**Pregunta:** Si el estudiante deniega el permiso de notificaciones, ¿qué debe ocurrir al intentar iniciar el temporizador?

**Respuesta:** El temporizador inicia, pero la aplicación advierte que el aviso puede ser limitado.

**Motivo:** Denegar el permiso no debe impedir que el estudiante use el temporizador.

## 2. Aviso con permiso denegado y aplicación abierta

**Pregunta:** Si el permiso está denegado y la fase termina mientras la aplicación está abierta, ¿qué debe ver el estudiante?

**Respuesta:** Un aviso dentro de la aplicación que identifique la fase terminada, aunque no haya notificación del sistema.

**Motivo:** La aplicación debe comunicar la finalización cuando está visible, incluso si no puede mostrar una notificación del sistema.

## 3. Sonido y vibración en modo silencio

**Pregunta:** ¿HU-004 cambia la regla anterior de respetar el silencio del celular?

**Respuesta:** Sí. La aplicación debe intentar sonar como alarma y vibrar aunque el celular esté en silencio. Si Android limita ese comportamiento, la limitación debe documentarse antes de implementar.

**Motivo:** HU-004 pide explícitamente un aviso con sonido y vibración en silencio, aunque HU-003 había definido que en silencio solo se mostrara la notificación. La viabilidad de la plataforma debe confirmarse sin prometer capacidades que Android no garantice.

## 4. Descartar la notificación durante la alarma

**Pregunta:** Si el estudiante desliza la notificación para descartarla, ¿eso también debe detener el sonido de la alarma?

**Respuesta:** Sí. Descartar la notificación también silencia la alarma.

**Motivo:** La notificación ya está definida como descartable y esa acción debe permitir detener el aviso.

## 5. Sonido y vibración en modo vibración

**Pregunta:** ¿La alarma también debe sonar cuando el celular está en modo vibración?

**Respuesta:** Sí. Igual que en silencio, debe sonar como alarma y vibrar.

**Motivo:** HU-004 agrupa los modos silencio y vibración, y el estudiante confirmó que la alarma debe sonar en ambos.

## 6. Notificación como alarma en modo silencio o vibración

**Pregunta:** ¿Cómo debe mostrarse la notificación cuando el celular está en modo silencio o vibración?

**Respuesta:** La notificación debe mostrarse como alarma con sonido y vibración en ambos modos.

**Motivo:** Esta decisión confirma el comportamiento solicitado por HU-004 y sustituye, para los modos silencio y vibración, las salvedades sobre restricciones de Android de las decisiones 3 y 5.
