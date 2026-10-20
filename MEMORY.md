# MEMORY.md - Temporizador Pomodoro

Estado del trabajo entre sesiones. Máximo ~50 líneas.

## Estado actual

- HU-003 queda cerrada tras implementar sus tareas y confirmar manualmente bloqueo, cierre, aviso y pausa.
- La spec HU-004 está aprobada y planificada en ocho tareas. T1 completada; T3 completada fuera de orden. T4 (canal v3) y T6 (acción «Detener») tienen implementación provisional, pendientes de prueba física. T5 sigue pendiente de validación manual; T2 pendiente. T7 bloqueada: Expo SDK 57 no expone callback de descarte Android.
- HU-005: T1 y T2 completadas. T3–T7 entregados; T6/T7 probados parcialmente en Expo Go. Se añadió la decisión 10 (RF-10, tarea T3b): la cantidad de pomodoros se aplica de inmediato si el ciclo no ha comenzado. Pendiente: `npx jest`, repetir `npx expo lint` (se corrigió use-color-scheme.web.ts) y probar T3b en Expo Go. T8 sin ejecutar.
- HU-006: sin decisiones.md todavía; falta la ronda de grill-me.

## Próximos pasos

- HU-005 (sdd-implement): ejecutar `npx jest`, `npx tsc --noEmit` y `npx expo lint`; marcar T3–T5 si pasan; probar T6/T7 en Expo Go con la lista de rn-conventions; después T8.
- HU-006 (grill-me, luego sdd-spec): responder la ronda de decisiones para generar decisiones.md.
- Para HU-004, pedir decisión para RF-4/T7: conservar el requisito y aprobar evaluar una integración Android nativa, o modificar el comportamiento mediante una actualización aprobada de spec/plan. Después resolver el entorno compatible y validar T2, T4 y T6; validar también T5.
