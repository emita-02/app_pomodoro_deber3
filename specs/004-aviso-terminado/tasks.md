# Tareas de la historia 004 - Recibir aviso al terminar el tiempo

- [x] **T1. Revisar las capacidades y límites de notificaciones Android.** RF-2, RF-4
  - Hecho cuando: la documentación de Expo SDK 57 y Android identifica qué garantías hay para sonido, vibración, bloqueo, acción de detener y descarte, y registra cualquier capacidad que requiera aprobación adicional.
  - Resultado: los canales permiten configurar sonido, vibración e importancia y las notificaciones admiten acciones; Android conserva el control del canal y del modo silencio, por lo que no se garantiza que suene en silencio. Expo documenta `customDismissAction` solo para iOS; el descarte Android no ofrece aquí una señal para silenciar la alarma. Evitar DND requeriría acceso especial del usuario, no aprobado.

- [ ] **T2. Probar en Android la alarma en silencio y vibración.** RF-2
  - Hecho cuando: en un Android físico se comprueba sonido, vibración y presentación en pantalla bloqueada con el modo silencio/vibración activado; si RF-2 no es viable con las APIs aprobadas, se detiene el trabajo y se solicita decisión antes de continuar. El toque, «Detener» y descarte se validan en T6 y T7 una vez implementados.

- [x] **T3. Cubrir con pruebas la política de permiso y el avance sin permiso.** RF-5, RF-6
  - Hecho cuando: las pruebas de `src/domain/session.test.ts` cubren permiso concedido, primera solicitud, denegación y explicación posterior; `npx jest src/domain/session.test.ts` pasa. La continuidad del temporizador se valida en la UI como parte de T5.
  - Nota: completada fuera de orden con autorización del usuario; T2 sigue pendiente.

- [ ] **T4. Configurar notificación local con fase, sonido y vibración.** RF-1, RF-2
  - Hecho cuando: la configuración Android aprobada por T2 programa una notificación al vencimiento que identifica estudio/descanso y aparece en bloqueo; si el canal existente impide cambiar la configuración, se usa un ID nuevo y la prueba manual confirma el resultado.
  - Implementación provisional: canal `session-completion-v3` con prioridad alta, visibilidad pública en bloqueo, sonido y vibración predeterminados. T2 y la prueba física de la notificación siguen pendientes; la tarea no está completada.

- [ ] **T5. Completar solicitud de permiso y aviso en primer plano.** RF-5, RF-6, RF-7
  - Hecho cuando: al primer inicio sin permiso se explica su propósito y se solicita; denegar no impide usar el temporizador; con la app visible y permiso denegado, el aviso identifica la fase terminada; Jest pasa y la interfaz cumple los puntos aplicables de la checklist manual de `rn-conventions`.
  - Apoyo de prueba añadido: control de desarrollo que borra solo las marcas locales de notificación; falta validar el diálogo de Android y el aviso en primer plano en un entorno compatible.

- [ ] **T6. Gestionar toque y acción «Detener» de la notificación.** RF-3
  - Hecho cuando: tocar la notificación o su acción «Detener» silencia el aviso y abre la app con la fase siguiente preparada, sin iniciar su cuenta regresiva; se confirma en Android físico.
  - Implementación provisional: categoría Android con acción «Detener»; el toque y la acción restauran la sesión, descartan la notificación y limpian la respuesta pendiente. Falta validación en un Android con build compatible; la tarea sigue abierta.

- [ ] **T7. Gestionar el descarte de la notificación durante el aviso.** RF-4
  - Hecho cuando: descartar la notificación silencia el aviso en Android físico; si la plataforma no expone la acción necesaria con las APIs aprobadas, se detiene el trabajo y se solicita decisión antes de cambiar el comportamiento.
  - Bloqueo técnico: Expo SDK 57 no expone un callback de descarte en Android; `customDismissAction` está implementado para iOS. No se añadió código nativo ni se cambió RF-4; se solicita decisión.

- [ ] **T8. Ejecutar la regresión manual del flujo de finalización.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: se revisan los resultados registrados en T2 y T4–T7 contra todos los RF, no queda ningún escenario sin comprobar y `npx jest` pasa.

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

- Las tareas de lógica se verifican con Jest; las tareas de interfaz, con la lista manual de `rn-conventions` en Android.
- T1 y T2 son puertas: si la plataforma no cumple RF-2 o RF-4, no se deben reinterpretar esos requisitos ni modificar el comportamiento visible sin actualizar primero la decisión/spec con aprobación del usuario.
- No se añaden dependencias ni se cambia el formato de los datos guardados.
