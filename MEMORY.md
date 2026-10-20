# MEMORY.md - Temporizador Pomodoro

Estado del trabajo entre sesiones. Máximo ~50 líneas.

## Estado actual

- HU-003 queda cerrada tras implementar sus tareas y confirmar manualmente bloqueo, cierre, aviso y pausa.
- La spec HU-004 está aprobada y planificada en ocho tareas. T1 completada; T3 completada fuera de orden. T4 (canal v3) y T6 (acción «Detener») tienen implementación provisional, pendientes de prueba física. T5 sigue pendiente de validación manual; T2 pendiente. T7 bloqueada: Expo SDK 57 no expone callback de descarte Android.
- Las decisiones de HU-005 quedaron documentadas en `specs/005-ajustar-tiempos/decisiones.md`. No se redactó la spec ni se modificó código.

## Próximos pasos

- Pedir decisión para RF-4/T7: conservar el requisito y aprobar evaluar una integración Android nativa, o modificar el comportamiento mediante una actualización aprobada de spec/plan. Después resolver el entorno compatible y validar T2, T4 y T6; validar también T5.
- Al retomar HU-005, continuar solo con la fase SDD solicitada.
