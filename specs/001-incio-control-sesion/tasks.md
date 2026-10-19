# Tareas de la historia 001 - Inicio y control de sesión

- [x] **T1. Definir el modelo de sesión y el flujo de estados base.** RF-1, RF-2, RF-5
  - Hecho cuando: el modelo de sesión contempla `durationMs`, `remainingMs`, `isRunning`, `isPaused`, `isCompleted`, `lastUpdatedAt` y el flujo de inicio/fin queda documentado y verificable con pruebas de lógica.

- [x] **T2. Implementar la lógica de inicio y cuenta regresiva exacta.** RF-1, RF-5, RF-6
  - Hecho cuando: la prueba de lógica demuestra que una sesión inicia con la duración base y llega a 00:00 sin iniciar la siguiente fase automáticamente.

- [x] **T3. Implementar pausa y reanudación sin perder progreso.** RF-2, RF-7
  - Hecho cuando: la prueba de lógica confirma que pausar y reanudar conserva el tiempo restante exacto y no avanza mientras la sesión está pausada.

- [x] **T4. Implementar reinicio con confirmación y cancelación.** RF-3, RF-4
  - Hecho cuando: las pruebas cubren ambos caminos y verifican que la cancelación conserva el estado actual y la confirmación regresa a la duración inicial.

- [x] **T5. Persistir el estado de la sesión para segundo plano y cierre.** RF-6, RF-7
  - Hecho cuando: la prueba de persistencia demuestra que el estado se guarda y recupera consistentemente, y que la cuenta se reanuda con el tiempo realmente transcurrido.

- [x] **T6. Gestionar la terminación y la información al volver a la app.** RF-5, RF-8, RF-9
  - Hecho cuando: la lógica evalúa la sesión como terminada al llegar a 00:00 y la pantalla informa al usuario sin bloquear la funcionalidad si no hay permiso de notificaciones.

- [x] **T7. Construir la vista principal de la sesión.** RF-1, RF-2, RF-3, RF-4, RF-5
  - Hecho cuando: la pantalla muestra el tiempo restante en mm:ss, los estados visibles y los botones de inicio, pausa, reanudación y reinicio, y se prueba manualmente en Expo Go.

- [x] **T8. Validar la experiencia completa con la checklist manual.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9
  - Hecho cuando: se ejecuta la verificación manual siguiendo los puntos de la lista de rn-conventions: flujo de inicio, pausa, reanudación, reinicio cancelado, reinicio confirmado, segundo plano y cierre de app, y comportamiento sin permiso de notificaciones.
  - Verificación manual reportada: pasaron los puntos 1, 2, 3, 4, 5, 6, 8 y 9. El punto 7 (notificación con permiso concedido) queda pendiente de probar en el development build Android.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6
7. T7
8. T8

## Notas de implementación

- Las tareas de lógica deben verificarse con `npx jest`.
- Las tareas de interfaz deben verificarse con la lista manual de comprobación de la convención RN del proyecto antes de considerarlas cerradas.
- Si durante la implementación aparece una decisión que cambie el comportamiento del usuario y no esté reflejada en la spec, se debe detener el trabajo y pedir aclaración antes de continuar.
