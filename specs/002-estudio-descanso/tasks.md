# Tareas de la historia 002 - Estudio y descanso

- [x] **T1. Extender el modelo de sesión y sus estados. (25 min)** RF-1, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: las pruebas de `src/domain/session.test.ts` verifican las fases, el estado preparado/en curso/en pausa, el contador inicial en cero y el inicio explícito de una fase preparada; `npx jest src/domain/session.test.ts` pasa.

- [x] **T2. Implementar las transiciones al terminar estudio. (25 min)** RF-1, RF-7
  - Hecho cuando: pruebas de dominio demuestran que antes del umbral se prepara descanso corto, al umbral se prepara descanso largo según la Decisión 2, y en ninguno de los casos comienza automáticamente la cuenta regresiva siguiente; `npx jest src/domain/session.test.ts` pasa.

- [x] **T3. Implementar el conteo al terminar los descansos. (25 min)** RF-3, RF-6, RF-7
  - Hecho cuando: pruebas de dominio confirman que un descanso corto incrementa el contador y prepara estudio, mientras el descanso largo mantiene 3 durante toda su duración y lo restablece a cero solo al terminar; `npx jest src/domain/session.test.ts` pasa.

- [x] **T4. Persistir y restaurar el ciclo retrocompatiblemente. (25 min)** RF-5, RF-6, RF-7
  - Hecho cuando: las pruebas de `src/storage/session-storage.test.ts` verifican la persistencia de fase/contador, la normalización de un registro anterior sin esos campos y la preparación correcta tras recuperar una fase vencida; `npx jest src/storage/session-storage.test.ts` pasa.

- [x] **T5. Conectar controles y guardado de transiciones. (25 min)** RF-1, RF-3, RF-5, RF-6, RF-7
  - Hecho cuando: iniciar, pausar, reanudar y restaurar actúan sobre la fase actual; las transiciones de fase/progreso quedan guardadas y el vencimiento no inicia otra cuenta regresiva; `npx jest` pasa.

- [x] **T6. Mostrar fase, contador e imágenes correspondientes. (25 min)** RF-1, RF-3, RF-4, RF-6, RF-7
  - Hecho cuando: la pantalla muestra el nombre de fase y el contador correcto, utiliza la imagen correspondiente y ofrece iniciar la fase preparada con controles accesibles; se verifica manualmente en Expo Go.

- [x] **T7. Validar ciclo y recuperación en Expo Go. (25 min)** RF-1, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: se completa la lista manual de `rn-conventions`: orientación vertical y giro, contraste/legibilidad, fuente, imágenes inicial/estudio/descanso, controles táctiles y etiquetas accesibles, cierre y recuperación del ciclo, y comprensión de estados sin depender del color; se comprueba además 3 durante descanso largo, 0 al terminar y que ninguna fase siguiente se inicia sola.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6
7. T7

Las tareas de lógica y persistencia se comprueban con Jest. Las tareas de interfaz y el flujo completo requieren verificación manual en Expo Go. RF-2 queda excluido de este plan por indicación del usuario; la selección del descanso largo se sustenta en la Decisión 2 y el contador se rige por RF-7.
