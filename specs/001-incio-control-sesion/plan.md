# Plan de la historia 001 - Inicio y control de sesión

## 1. Archivos y responsabilidades

- src/domain/session.ts
  - Lógica pura del temporizador: estado activo/pausado/terminado, duración de estudio, tiempo restante, control de inicio, pausa, reanudación, reinicio y fin de fase.
  - Cubre RF-1 a RF-7.

- src/domain/session.test.ts
  - Pruebas unitarias del algoritmo de cuenta regresiva y del manejo de estados transitorios.
  - Cubre RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7.

- src/storage/session-storage.ts
  - Persistencia local del estado de la sesión para conservar el progreso cuando la app pasa a segundo plano o se cierra.
  - Cubre RF-6 y RF-7.

- src/storage/session-storage.test.ts
  - Pruebas de guardado y recuperación del estado; valida que el flujo de pausa y reanudación no borre el progreso.
  - Cubre RF-6 y RF-7.

- src/app/index.tsx
  - Pantalla principal para iniciar, pausar, reanudar, reiniciar y visualizar el estado actual del temporizador.
  - Cubre RF-1 a RF-9 desde la experiencia del usuario.

- src/components/session-controls.tsx (o componente equivalente)
  - Botones y mensajes de estado para la sesión: iniciar, pausar, reanudar, reiniciar y notificación final.
  - Cubre RF-1 a RF-9 en la interfaz.

## 2. Funciones puras de lógica

La lógica debe mantenerse separada del render para poder probarla sin depender de React o de AsyncStorage.

- createSession(config): crea el estado inicial de una sesión de estudio.
- startSession(session, now): activa la cuenta regresiva desde el instante actual.
- pauseSession(session, now): congela el tiempo restante y guarda el momento de pausa.
- resumeSession(session, now): reanuda la cuenta sin perder el tiempo ya acumulado.
- resetSession(session, confirm): devuelve la fase al estado inicial si confirma; si no, conserva la sesión actual.
- advanceSession(session, now): calcula el tiempo realmente transcurrido y actualiza el estado de la sesión.
- finishSession(session): marca la fase como terminada y deja preparada la siguiente fase sin iniciarla.
- getRemainingTime(session, now): calcula el tiempo restante en milisegundos y lo expresa en minutos y segundos.
- shouldShowCompleted(session): evalúa si la sesión ya venció y debe mostrarse como terminada.

Estas funciones deberán operar sobre un estado estructurado con campos como:

- durationMs
- remainingMs
- isRunning
- isPaused
- isCompleted
- startedAt
- lastUpdatedAt
- lastPausedAt
- totalPausedMs
- lastNotifiedAt

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7.

## 3. Persistencia

Se usará almacenamiento local con AsyncStorage para guardar una instantánea del estado de la sesión y del instante de última actualización.

- El estado persistido debe incluir la duración base, el tiempo restante, el estado actual y el momento del último cambio relevante.
- Cuando la app vuelve a abrirse, se recalcula el tiempo transcurrido real con la diferencia entre el tiempo actual y el último registro guardado.
- Si la sesión estaba en marcha, se reconstituyen los segundos transcurridos desde el último checkpoint.
- Si la sesión estaba pausada, se conserva exactamente el tiempo restante sin avanzar.
- Las notificaciones no deben bloquear la ejecución principal; si no hay permiso, la sesión continúa y, al volver a la app, se informa que terminó si corresponde.

RF cubierto: RF-6, RF-7, RF-8, RF-9.

## 4. Algoritmo en pseudocódigo

```text
function syncSessionState(session, now):
  if session.isCompleted:
    return session

  if session.isRunning:
    elapsed = now - session.lastUpdatedAt
    session.remainingMs = max(0, session.remainingMs - elapsed)
    session.lastUpdatedAt = now

    if session.remainingMs == 0:
      session.isRunning = false
      session.isCompleted = true
      session.completedAt = now
      persist(session)
      return session

  persist(session)
  return session

function pauseSession(session, now):
  if session.isRunning:
    session.isRunning = false
    session.isPaused = true
    session.lastPausedAt = now
    persist(session)

function resumeSession(session, now):
  if session.isPaused:
    session.isPaused = false
    session.isRunning = true
    session.lastUpdatedAt = now
    persist(session)

function resetSession(session, confirmed):
  if confirmed:
    session.remainingMs = session.durationMs
    session.isRunning = false
    session.isPaused = false
    session.isCompleted = false
    session.lastUpdatedAt = now
    persist(session)

function finishSession(session):
  session.isCompleted = true
  session.isRunning = false
  session.isPaused = false
  session.remainingMs = 0
  persist(session)
```

La clave técnica es no confiar solo en el valor visual del reloj, sino que el sistema debe calcular el tiempo real transcurrido con marcas temporales. Esto evita que el estado se vuelva incorrecto cuando la app pasa a segundo plano o se cierra.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7.

## 5. Cómo se pinta en la interfaz

- La pantalla principal muestra el tiempo restante de la fase actual como mm:ss.
- El estado visible debe indicar claramente si la sesión está en curso, en pausa o terminada.
- Los botones deben permitir iniciar, pausar, reanudar, reiniciar y confirmar el reinicio antes de aplicar el cambio.
- Cuando la cuenta llega a 00:00, la interface debe mostrar que la sesión terminó y dejar preparada la siguiente fase sin activarla automáticamente.
- Si la app vuelve a la vista después de una sesión completada en segundo plano, la pantalla debe reflejar ese estado inmediatamente.
- En la pantalla se debe gestionar la ausencia de permiso de notificaciones sin bloquear la sesión; el usuario recibe la información cuando regresa a la app.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-8, RF-9.

## 6. Decisiones técnicas justificadas

### Decisión 1: almacenamiento basado en tiempo real y no solo en valor visual

- Se persistirá el tiempo real transcurrido y el último instante conocido, no solo el valor visible del temporizador.
- Justificación: la constitución exige precisión ante segundo plano y cierre, y la spec lo exige para RF-6 y RF-7.
- Alternativa descartada: guardar únicamente `remainingMs` cada vez que se renderiza. Eso produce desfases al volver a la app y no refleja el tiempo realmente transcurrido.

### Decisión 2: notificaciones como aviso complementario, no como bloqueo funcional

- La sesión debe seguir funcionando si no se concede permiso de notificaciones.
- Justificación: RF-8 dice que la sesión continúa normalmente y solo informa al volver a la app.
- Alternativa descartada: impedir iniciar la sesión si el permiso se niega. Eso contradice la historia y la constitución.

### Decisión 3: manejar la finalización sin iniciar automáticamente la fase siguiente

- El sistema se detiene en 00:00 y deja la siguiente fase preparada, sin activarla.
- Justificación: esto respeta la decisión de la historia y la decisión 1 registrada.
- Alternativa descartada: lanzar la siguiente fase de forma automática. Eso rompe la regla de no iniciar una nueva cuenta sin decisión del estudiante.

## 7. Estrategia de pruebas con Jest

1. Pruebas unitarias puras sobre la lógica:
   - iniciar la sesión desde una duración base y verificar 00:00 al completar.
   - pausar y reanudar sin perder el tiempo restante.
   - reiniciar con confirmación y cancelar el reinicio.
   - mantener el tiempo real transcurrido al simular segundo plano mediante diferencias de timestamps.

2. Pruebas de persistencia:
   - guardar el estado completo y recuperarlo al volver a la app.
   - conservar la sesión pausada sin avanzar el reloj durante la pausa.
   - no perder el estado cuando la sesión hay finalizado en segundo plano.

3. Pruebas de integración mínima de interfaz:
   - verificar que la pantalla renderiza `mm:ss` correcto.
   - verificar los mensajes de estado y los botones según la fase activa.
   - comprobar que al terminar la sesión el botón de iniciar la siguiente fase no se dispara automáticamente.

Se priorizarán pruebas de lógica pura, porque son la base de la precisión y la continuidad del temporizador. La interfaz se validará con comprobación manual en Expo Go, siguiendo la checklist del proyecto.

## 8. Criterios de cobertura por requisito

- RF-1: lógica de inicio + vista del tiempo restante.
- RF-2: lógica de pausa/reanudación + controles de interfaz.
- RF-3: lógica de reinicio con confirmación.
- RF-4: cancelación del reinicio y conservación del estado.
- RF-5: finalización en 00:00 y preparación de la fase siguiente.
- RF-6: cálculo del tiempo real transcurrido al reabrir la app.
- RF-7: mantenimiento del estado pausado al cerrar la app.
- RF-8: comportamiento sin permiso de notificaciones.
- RF-9: notificación al volver a la app si la sesión terminó en segundo plano.
