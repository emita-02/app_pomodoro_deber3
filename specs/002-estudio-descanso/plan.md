# Plan de la historia 002 - Estudio y descanso

## Alcance

- Se planifican RF-1, RF-3, RF-4, RF-5, RF-6 y RF-7.
- Por indicación del usuario, RF-2 no se planifica como requisito independiente. La selección del descanso largo al terminar la sesión de estudio se toma de la Decisión 2; el comportamiento del contador durante y al terminar ese descanso se rige únicamente por RF-7 y la Decisión 6.
- Se conserva la regla de inicio explícito: preparar la fase siguiente no inicia su cuenta regresiva.
- La autorización del usuario permite ampliar retrocompatiblemente el registro de AsyncStorage con la fase y el contador. Los registros existentes sin esos campos se interpretan como una sesión de estudio con cero pomodoros completados.

## 1. Archivos y responsabilidades

- `src/domain/session.ts`
  - Ampliar el modelo de sesión para distinguir estudio, descanso corto y descanso largo, el estado preparado/en curso/en pausa y los pomodoros completados.
  - Mantener las transiciones y el cálculo del tiempo transcurrido como lógica pura. La duración de la fase preparada se toma de la configuración existente; se mantienen los valores predeterminados de la constitución si no hay otro valor configurado.
  - Cubre RF-1, RF-3, RF-4, RF-5, RF-6 y RF-7; la selección del descanso largo también sigue la Decisión 2.

- `src/domain/session.test.ts`
  - Probar límites del contador, elección de fase, preparación sin inicio automático, vencimiento mediante marcas de tiempo y transiciones de descansos.
  - Cubre RF-1, RF-3, RF-5, RF-6 y RF-7.

- `src/storage/session-storage.ts`
  - Persistir y restaurar la fase y el contador junto con el estado actual de la sesión.
  - Normalizar registros existentes que no tengan los nuevos campos y recalcular una sesión en curso al recuperarla.
  - Cubre RF-5, RF-6 y RF-7.

- `src/storage/session-storage.test.ts`
  - Verificar persistencia del ciclo, recuperación tras vencimiento en segundo plano/cierre y compatibilidad con registros previos.
  - Cubre RF-5, RF-6 y RF-7.

- `src/components/session-controls.tsx`
  - Conectar los controles actuales con el estado de fase preparado, iniciado y pausado; guardar los cambios de fase/contador y presentar el texto, imagen y contador correspondientes.
  - Mantener el inicio de la siguiente fase sujeto a la acción del estudiante. Adaptar el aviso de finalización existente para que identifique la fase que terminó.
  - Cubre RF-1, RF-3, RF-4, RF-5, RF-6 y RF-7.

- `src/app/index.tsx`
  - Sin cambios previstos: continúa delegando la pantalla principal a `SessionControls`.

## 2. Funciones puras de lógica

La lógica del ciclo permanecerá en `src/domain/session.ts`, sin dependencias de React ni AsyncStorage.

- `createSession(config)`: crea una sesión de estudio preparada con contador cero.
- `startSession(session, now)`: inicia explícitamente la fase que está preparada y registra el instante de inicio.
- `advanceSession(session, now)`: descuenta el tiempo real de la fase en curso; al llegar a cero prepara la fase siguiente y se detiene sin consumir tiempo de esa siguiente fase.
- `prepareNextPhase(session)`: decide la fase siguiente según la fase que terminó y el avance del ciclo; establece su duración completa y estado preparado.
- `resetSession(session, confirmed)`: conserva el comportamiento actual de reinicio con confirmación; el reinicio de la fase no altera por sí mismo el contador del ciclo.
- `getRemainingTime(session, now)`: conserva el cálculo del tiempo visible de la fase actual.

La configuración debe proporcionar las duraciones de estudio, descanso corto y descanso largo, además de la cantidad de pomodoros por ciclo. Se utilizarán los valores predeterminados de la constitución (25, 5 y 15 minutos; 4 pomodoros) si la aplicación aún no proporciona valores configurados. Esta historia no agrega una pantalla de configuración.

## 3. Persistencia

- Extender el objeto de sesión que ya guarda `session-storage.ts`; no crear una segunda clave de almacenamiento para el ciclo.
- Guardar la fase actual, el contador de pomodoros completados, el estado preparado/en curso/en pausa, la duración/tiempo restante de la fase y las marcas temporales necesarias para recalcular el tiempo real.
- Al leer registros anteriores sin fase ni contador, aplicar los valores compatibles autorizados: estudio y cero pomodoros completados.
- Si una fase en curso venció mientras la aplicación estaba cerrada o en segundo plano, recalcularla al restaurar y dejar preparada la fase que corresponde. No descontar el tiempo transcurrido de esa fase siguiente ni iniciarla automáticamente.
- Persistir las transiciones de fase y contador para que una nueva apertura no recupere el ciclo previo al vencimiento.

RF cubiertos: RF-5, RF-6 y RF-7. Decisiones relacionadas: 3, 4, 5 y 6.

## 4. Algoritmo en pseudocódigo

```text
function advanceSession(session, now):
	if session.status != "running":
		return session

	elapsed = max(0, now - session.lastUpdatedAt)
	remaining = max(0, session.remainingMs - elapsed)

	if remaining > 0:
		return session with remainingMs = remaining, lastUpdatedAt = now

	# Solo se completa la fase que estaba corriendo; no se inicia ni consume tiempo de la siguiente.
	completedPhase = session.phase
	next = prepareNextPhase(session, completedPhase)
	persist(next)
	return next

function prepareNextPhase(session, completedPhase):
	if completedPhase == "study":
		if session.pomodorosCompleted < session.pomodorosPerCycle - 1:
			nextPhase = "shortBreak"
		else:
			nextPhase = "longBreak"  # Decisión 2

	else if completedPhase == "shortBreak":
		pomodorosCompleted = session.pomodorosCompleted + 1  # Decisión 5
		nextPhase = "study"

	else:
		pomodorosCompleted = 0  # RF-7 y Decisión 6
		nextPhase = "study"

	return session with:
		phase = nextPhase
		remainingMs = durationFor(nextPhase)
		status = "prepared"
		lastUpdatedAt = null

function startSession(session, now):
	if session.status != "prepared":
		return session
	return session with status = "running", lastUpdatedAt = now
```

Durante todo el descanso largo, el contador conserva el valor 3; solo vuelve a cero al terminar ese descanso. El descanso largo queda preparado al terminar el cuarto estudio conforme a la Decisión 2, pero no empieza hasta que el estudiante lo inicia.

RF cubiertos: RF-1, RF-3, RF-5, RF-6 y RF-7. La selección de fase larga se basa en la Decisión 2, no en RF-2.

## 5. Cómo se pinta en la interfaz

- Mostrar el tiempo restante de la fase preparada o en curso con el formato `mm:ss` que ya usa la pantalla.
- Mostrar en español si la fase es estudio, descanso corto o descanso largo, junto con el número de pomodoros completados en el ciclo.
- En estado preparado, ofrecer el inicio explícito de esa fase; en curso y en pausa, conservar los controles actuales de pausa, reanudación y reinicio.
- Usar la imagen de estudio para estudio y la imagen de descanso para ambos descansos, conforme a `rn-conventions`.
- Al terminar una fase, actualizar la pantalla y el contador correspondiente, sin iniciar la cuenta regresiva siguiente.
- Mantener etiquetas accesibles y los estados legibles sin depender solo del color. El texto del aviso existente debe identificar la fase que terminó.

RF cubiertos: RF-1, RF-3, RF-4, RF-6 y RF-7.

## 6. Decisiones técnicas justificadas

### Decisión técnica 1: ampliar el modelo puro de sesión

- Separar fase, progreso del ciclo y estado preparado/en curso/en pausa en la lógica de dominio.
- Justificación: permite probar las transiciones sin depender de React y representa que una fase preparada no está corriendo (Constitución 3 y 7; RF-1 y RF-3).
- Alternativa descartada: elegir fase y modificar el contador directamente en `SessionControls`; mezclaría reglas del ciclo con renderizado y haría más difícil probar los límites.

### Decisión técnica 2: una sola instantánea persistida con compatibilidad

- Añadir fase y contador al objeto de sesión ya persistido, y asignar valores iniciales a registros antiguos sin esos campos.
- Justificación: el estado de temporizador y ciclo se restaura de forma conjunta y el usuario autorizó esta ampliación para cubrir RF-5.
- Alternativa descartada: una clave independiente para el ciclo, porque permitiría recuperar fase y temporizador de instantes distintos.

### Decisión técnica 3: marcas temporales para recuperar vencimientos

- Reutilizar el cálculo por tiempo transcurrido y marcas temporales existente al restaurar una fase activa.
- Justificación: refleja el tiempo real tras segundo plano/cierre y respeta la Constitución 6 y las Decisiones 3 y 4.
- Alternativa descartada: descontar únicamente los intervalos observados mientras React está activo, porque se perdería tiempo durante suspensión o cierre.

### Decisión técnica 4: preparar, no encadenar, la fase siguiente

- Al vencer una fase, dejar la siguiente con duración completa y estado preparado; exigir una acción del estudiante para iniciarla.
- Justificación: respeta la definición de fase preparada, RF-1/RF-3 y la Constitución 7.
- Alternativa descartada: trasladar el exceso de tiempo vencido a la fase siguiente, porque implicaría que esta empezó automáticamente.

## 7. Estrategia de pruebas con Jest

- Lógica pura: iniciar la fase preparada; terminar estudio antes y al umbral del descanso largo; preparar descanso corto/largo; verificar que la fase siguiente no corre hasta iniciarse explícitamente.
- Contador: comprobar que aumenta solo al terminar cada descanso corto, permanece en 3 durante el descanso largo y vuelve a 0 cuando este termina.
- Tiempo real: simular con marcas temporales el vencimiento en segundo plano/cierre; comprobar que solo se prepara la fase siguiente y no se consume su duración.
- Persistencia: guardar/restaurar fase, contador y estado temporal; normalizar un registro antiguo sin los nuevos campos; cubrir sesión pausada y fase activa recuperada.
- Interfaz: las transiciones y texto/imagen/contador se comprobarán manualmente en Expo Go según la lista de `rn-conventions`; no se agrega una dependencia de pruebas de UI.

## 8. Cobertura por requisito

- RF-1: `session.ts`, `session.test.ts`, `session-controls.tsx`; prepara descanso corto sin iniciarlo.
- RF-2: excluido del plan por indicación del usuario. Para la selección del descanso largo se sigue la Decisión 2; para el contador en y después del descanso largo se sigue RF-7 y la Decisión 6.
- RF-3: `session.ts`, `session.test.ts`, `session-controls.tsx`; prepara estudio tras cualquier descanso y espera la acción del estudiante.
- RF-4: `session-controls.tsx`; muestra fase y pomodoros completados.
- RF-5: `session-storage.ts`, `session-storage.test.ts`, `session-controls.tsx`; restaura el vencimiento y conserva la siguiente fase preparada.
- RF-6: `session.ts`, pruebas de dominio/persistencia y `session-controls.tsx`; aumenta y muestra el contador tras descanso corto.
- RF-7: `session.ts`, pruebas de dominio/persistencia y `session-controls.tsx`; conserva 3 durante descanso largo y reinicia el contador al terminarlo.
