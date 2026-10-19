# Plan de la historia 003 - Conteo con el celular bloqueado o la app cerrada

## 1. Archivos y responsabilidades

- `src/domain/session.ts`
  - Mantener la lógica pura del temporizador en tiempo real: estados de sesión, marcas temporales, cálculo del tiempo transcurrido, finalización de fase y recuperación al volver a la app.
  - Cubre RF-1, RF-2, RF-3, RF-8, RF-10.

- `src/domain/session.test.ts`
  - Probar el cálculo exacto del tiempo restante al bloquear el celular y al reabrir la app, la finalización de la fase con la aplicación cerrada y la conservación de una sesión pausada.
  - Cubre RF-1, RF-2, RF-3, RF-8, RF-10.

- `src/storage/session-storage.ts`
  - Persistir el estado completo de la sesión, la marca temporal de última actualización y la señal de finalización para recuperarla con precisión después de segundo plano, cierre o bloqueo del celular.
  - Cubre RF-2, RF-3, RF-8, RF-10.

- `src/storage/session-storage.test.ts`
  - Verificar que al cerrar la aplicación se conserva el tiempo correcto, que una fase terminada se recupera y que una sesión pausada se mantiene pausada.
  - Cubre RF-2, RF-3, RF-8, RF-10.

- `src/app/index.tsx`
  - Renderizar el estado visible de la sesión recuperada al volver a la app, incluyendo fase terminada o tiempo restante correcto según el caso.
  - Cubre RF-1, RF-2, RF-3, RF-5, RF-8, RF-10.

- `src/components/session-controls.tsx`
  - Conectar la pantalla con el flujo de sesión, el aviso de finalización y la experiencia de usuario al tocar la notificación o volver a la app.
  - Cubre RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9, RF-10.

## 2. Funciones puras de lógica

La lógica debe vivir en `src/domain/session.ts` para poder probarse sin depender de React ni de `AsyncStorage`.

- `createSession(config)`: crea la sesión con duración base, tiempo restante, estado en curso o pausado y marca de última actualización.
- `startSession(session, now)`: activa la cuenta regresiva y marca el instante de inicio.
- `pauseSession(session, now)`: congela la sesión sin perder el tiempo acumulado.
- `resumeSession(session, now)`: reanuda la cuenta con una marca de tiempo nueva.
- `syncSessionState(session, now)`: calcula el tiempo real transcurrido desde la última actualización y descuenta el tiempo restante; si llega a cero, marca la fase como terminada y deja la siguiente preparada.
- `markPhaseCompleted(session, now)`: actualiza el estado a fase terminada y guarda la siguiente fase como preparada sin iniciar su cuenta automáticamente.
- `getRemainingTime(session, now)`: devuelve el tiempo restante visible en el formato adecuado para la UI.
- `shouldShowCompletionNotice(session, isBackgroundedOrLocked)`: evalúa si la finalización requiere un aviso visible o notificación.
- `shouldRequestNotificationPermission(permissionState, cycleState)`: aplica la regla de solicitud solo al inicio del primer ciclo y no vuelve a requerir el sistema si ya fue concedido o si el permiso sigue denegado en ciclos posteriores.

RF cubierto: RF-1, RF-2, RF-3, RF-8, RF-10. La lógica de avisos y permisos se cubre con la regla de presentación y el cálculo de estados visibles (`RF-4` a `RF-9`).

## 3. Persistencia

Se usará `AsyncStorage` para guardar una instantánea del estado de la sesión junto con la última marca temporal y la sesión finalizada o pausada.

- El estado persistido debe incluir la fase actual, el tiempo restante, el reloj de última actualización, el estado de ejecución, si está pausada o completada, y si la fase ya terminó en segundo plano.
- Cuando la app se reabre, se calcula el tiempo real transcurrido entre la última marca guardada y el `now` actual del sistema.
- Si la sesión estaba corriendo, se resta el tiempo transcurrido y se conserva la fase en curso o la fase terminada con la siguiente preparada.
- Si la sesión estaba pausada, se conserva sin avanzar ni generar un aviso de finalización por esa pausa.
- Si el permiso de notificaciones no se concedió, la sesión sigue funcionando y al volver a la app aparece la fase terminada aunque no exista aviso del sistema.

RF cubierto: RF-2, RF-3, RF-8, RF-10. La persistencia también sirve de base para `RF-4` a `RF-7` al permitir que la UI restablezca el estado correcto al reabrir la aplicación.

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
      session.nextPhase = prepareNextPhase(session)
      persist(session)
      return session

  persist(session)
  return session

function restoreSession(session, now):
  if session.isRunning:
    return syncSessionState(session, now)

  if session.isPaused:
    return session

  return session

function markNotificationVisible(session, phaseName):
  if session.phaseFinishedAndNotified:
    return session
  return session with notificationVisible = true, phaseName = phaseName

function requestNotificationPermissionIfNeeded(permissionState, cycleState):
  if permissionState == "granted":
    return "not-needed"
  if cycleState == "firstCycle" and permissionState == "unknown":
    return "show-system-request"
  return "explain-how-to-enable"
```

La clave técnica es no depender del valor visual del reloj en memoria, sino del tiempo real medido por marcas temporales. Esto evita errores cuando la app queda en segundo plano, se bloquea el celular o se cierra la aplicación.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9.

## 5. Cómo se pinta en la interfaz

- La pantalla principal muestra el tiempo restante en formato `mm:ss` mientras la fase está activa.
- Si el celular fue bloqueado o la app pasó a segundo plano, al volver a la pantalla se recalcula y muestra el estado correcto sin que el estudiante tenga que ajustar nada.
- Cuando una fase termina con la app cerrada, la pantalla debe reflejar el estado como terminada y dejar preparada la siguiente fase sin iniciarla automáticamente.
- El aviso de finalización debe identificar la fase terminada y mantenerse visible hasta que el estudiante lo toque o lo descarte.
- Al tocar el aviso, la app abre la sesión terminada y presenta la fase correcta.
- Si el permiso de notificaciones está denegado, la sesión sigue funcionando y la UI informa al volver a la app sin bloquear el temporizador.
- Cuando el estudiante pausa antes de cerrar la aplicación, la sesión vuelve exactamente en el mismo punto y sin aviso de finalización.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-8, RF-9, RF-10.

## 6. Decisiones técnicas justificadas

### Decisión técnica 1: usar marcas temporales para sincronizar el tiempo real

- Se calculará el tiempo transcurrido en base a la diferencia entre `now` y la última marca guardada, y no solo al valor visual del reloj.
- Justificación: la constitución exige exactitud del temporizador ante segundo plano, bloqueo o cierre; esto es necesario para RF-1 y RF-2.
- Alternativa descartada: recalcular solo cuando la app vuelve a primer plano y confiar en el valor visible. Eso introduciría desfases y rompería la precisión del temporizador.

### Decisión técnica 2: el aviso es auxiliar, no un bloqueo funcional

- El temporizador debe seguir funcionando aunque Android no otorgue permiso de notificaciones.
- Justificación: RF-8 exige que la sesión siga funcionando y solo informe al volver a la app si no se muestra el aviso.
- Alternativa descartada: bloquear la sesión si el permiso se niega. Eso contradice la historia y la constitución.

### Decisión técnica 3: finalización sin iniciar la siguiente fase automáticamente

- Cuando la fase termina, el sistema marca la fase como terminada y prepara la siguiente fase sin iniciar su cuenta regresiva.
- Justificación: esto respeta la Definición de “fase preparada” y la regla de éxito de la HU-003.
- Alternativa descartada: iniciar la siguiente fase al instante para “seguir el flujo”. Eso rompe la decisión del usuario y la definición de la historia.

### Decisión técnica 4: solicitar permiso solo en el primer ciclo y explicar más adelante

- La solicitud del sistema se hace al principio del primer uso; luego, si el permiso sigue denegado, la app puede explicar cómo habilitarlo en un ciclo posterior sin repetir la solicitud del sistema.
- Justificación: RF-6 y RF-7 lo exigen y reduce la fricción del estudiante.
- Alternativa descartada: solicitar en cada ciclo completo. Eso genera molestias repetidas y contradice la decisión de la HU.

## 7. Estrategia de pruebas con Jest

1. Pruebas unitarias puras sobre la lógica:
   - bloquear el celular y comprobar que se descuentan los segundos y se recupera el tiempo restante correcto.
   - cerrar la app antes del fin de la fase y comprobar la restauración del tiempo transcurrido.
   - detectar fase terminada en segundo plano y dejar la siguiente fase preparada sin auto-inicio.
   - mantener una sesión pausada sin generar aviso de finalización.

2. Pruebas de persistencia:
   - guardar y recuperar el estado con `AsyncStorage` cuando la app se cierra.
   - asegurarse de que el tiempo restante se recalcule desde la última marca guardada.
   - verificar que, si no se concedió el permiso, la fase terminada se recupera aunque no haya aviso.

3. Pruebas de integración mínima de interfaz:
   - verificar que la pantalla muestra la fase terminada y el tiempo restante correcto al reabrir la app.
   - probar la permanencia del aviso y la apertura al tocarlo.
   - comprobar que la sesión pausada no genera un aviso al reabrir la app.

Se priorizan las pruebas de lógica por ser la base de la exactitud del temporizador. La interfaz se valida con la lista manual de `rn-conventions` en Expo Go.

## 8. Cobertura por requisito

- RF-1: `session.ts`, `session.test.ts`, `session-controls.tsx`; soluciona el cálculo correcto al bloquear el celular.
- RF-2: `session.ts`, `session-storage.ts`, `session-storage.test.ts`; restaura la sesión tras cerrar la app y volver a abrirla.
- RF-3: `session.ts`, `session-storage.ts`, `session.test.ts`; reconoce una fase terminada con la app cerrada y deja la siguiente preparada.
- RF-4: `session-controls.tsx`; muestra el aviso de finalización y lo mantiene visible hasta tocarlo o descartarlo.
- RF-5: `session-controls.tsx`; al tocar el aviso abre la app y muestra la sesión como terminada.
- RF-6: `session.ts`, `session-controls.tsx`; solicita el permiso al iniciar por primera vez y no repite la solicitud del sistema si ya fue concedido.
- RF-7: `session.ts`, `session-controls.tsx`; si el permiso sigue denegado en ciclos posteriores, explica cómo habilitarlo y no vuelve a pedirlo.
- RF-8: `session-storage.ts`, `session.test.ts`; la sesión continúa aunque no haya notificaciones.
- RF-9: `session-controls.tsx`, `session.test.ts`; notificación con sonido, vibración y/o avisos según el modo del celular.
- RF-10: `session-storage.ts`, `session.test.ts`; conserva la pausa y evita los avisos de finalización por una sesión pausada.
