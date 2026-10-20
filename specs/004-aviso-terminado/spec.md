# Spec 004 - Recibir aviso al terminar el tiempo

Estado: aprobado

HU de origen: docs/historias/HU-004.md

## Contexto y objetivo

El estudiante necesita enterarse cuando termina una fase de estudio o descanso sin tener que mirar continuamente la pantalla. El aviso debe identificar la fase terminada y comunicar la finalización según el modo de sonido del celular y los permisos concedidos, incluyendo la solicitud de permiso al iniciar el temporizador por primera vez.

## Usuarios

- Estudiante que necesita saber cuándo termina una fase para cambiar de actividad.

## Historias de usuario

- Como estudiante, quiero que la aplicación me avise cuando termine el tiempo de estudio o de descanso, incluso con el celular en silencio, para cambiar de actividad sin estar mirando la pantalla.

## Definiciones

- Aviso de finalización: comunicación que indica que terminó una fase de estudio o descanso.
- Alarma: aviso con sonido y vibración asociado a la finalización de una fase.
- Fase siguiente preparada: fase que se muestra como siguiente, sin comenzar su cuenta regresiva automáticamente.

## Requisitos funcionales

- RF-1: CUANDO el temporizador llegue a cero mientras el celular tenga el sonido activado, EL SISTEMA mostrará un aviso con sonido y vibración que identifique la fase terminada. Origen: Escenario «Aviso con el celular en sonido».
- RF-2: CUANDO el temporizador llegue a cero mientras el celular esté en modo silencio o vibración, EL SISTEMA mostrará una notificación como alarma con sonido y vibración en la pantalla de bloqueo, identificando la fase terminada. Origen: Escenario «Aviso con el celular en silencio»; Decisión 6.
- RF-3: MIENTRAS la alarma de finalización esté activa, CUANDO el estudiante toque la notificación o el botón de detener, EL SISTEMA silenciará la alarma, abrirá la aplicación y mostrará la fase siguiente preparada, sin iniciar automáticamente su cuenta regresiva. Origen: Escenario «Detener el aviso»; Decisión 3.
- RF-4: CUANDO el estudiante descarte la notificación mientras la alarma esté activa, EL SISTEMA silenciará la alarma. Origen: Decisión 4.
- RF-5: CUANDO el estudiante inicie un temporizador por primera vez y no haya concedido el permiso de notificaciones, EL SISTEMA explicará para qué se necesita el permiso y lo solicitará. Origen: Escenario «Permiso de notificaciones»; Decisión 1.
- RF-6: SI el estudiante deniega el permiso de notificaciones, ENTONCES EL SISTEMA permitirá iniciar el temporizador y advertirá que el aviso puede ser limitado. Origen: Decisión 1.
- RF-7: SI una fase termina mientras el permiso de notificaciones está denegado y la aplicación está abierta, ENTONCES EL SISTEMA mostrará dentro de la aplicación un aviso que identifique la fase terminada. Origen: Decisión 2.

## Requisitos no funcionales

- La funcionalidad debe priorizar la plataforma Android definida en la constitución.
- El aviso debe identificar de forma comprensible si terminó una fase de estudio o de descanso.

## Casos límite

- El permiso se deniega al iniciar el temporizador por primera vez: el temporizador puede iniciar y se advierte que el aviso podría ser limitado.
- La fase termina con el permiso denegado y la aplicación visible: se muestra el aviso dentro de la aplicación.
- La notificación se descarta mientras suena la alarma: la alarma se silencia.

## Fuera de alcance

- Impedir el uso del temporizador cuando el estudiante no concede permiso de notificaciones.
- Iniciar automáticamente la cuenta regresiva de la fase siguiente.
- Cambiar las reglas de conteo, recuperación o avance entre fases definidas en otras historias y specs.

## Criterios de finalización

- Al terminar una fase con el sonido del celular activado, se presenta un aviso audible y con vibración que identifica la fase terminada.
- Al terminar una fase en modo silencio o vibración, se muestra una notificación como alarma con sonido y vibración en la pantalla de bloqueo, identificando la fase terminada.
- Al tocar la notificación o el botón de detener, la alarma se silencia y se abre la aplicación mostrando la fase siguiente preparada, sin iniciar su cuenta regresiva.
- Al descartar la notificación durante la alarma, la alarma se silencia.
- Al iniciar el temporizador por primera vez sin permiso, se explica y solicita el permiso; denegarlo no impide iniciar el temporizador.
- Si una fase termina con la aplicación abierta y el permiso denegado, se muestra un aviso dentro de la aplicación que identifica la fase terminada.

## Dudas abiertas

No hay dudas abiertas.