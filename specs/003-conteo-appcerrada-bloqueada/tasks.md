# Tareas de la historia 003 - Conteo con el celular bloqueado o la app cerrada

- [x] **T1. Definir el modelo de sesión y la sincronización exacta del tiempo.** RF-1, RF-2, RF-10
  - Hecho cuando: `src/domain/session.test.ts` cubre que, al bloquear el celular o al cerrar la app y volver a abrirla, la diferencia real de tiempo se descuenta sin perder ni ganar segundos; `npx jest src/domain/session.test.ts` pasa.

- [x] **T2. Recuperar la sesión al reabrir la app con el tiempo restante correcto.** RF-1, RF-2, RF-8
  - Hecho cuando: la prueba de lógica y persistencia demuestra que, al reabrir la app, el tiempo restante refleja el tiempo real transcurrido y la sesión sigue funcionando aunque la app estuviera cerrada; `npx jest src/domain/session.test.ts src/storage/session-storage.test.ts` pasa.

- [x] **T3. Reconocer finalización con la app cerrada y dejar preparada la siguiente fase.** RF-3, RF-8, RF-10
  - Hecho cuando: la prueba de lógica confirma que, al llegar a 00:00 con la aplicación cerrada, la fase queda terminada y la siguiente fase aparece preparada sin iniciarse automáticamente; `npx jest src/domain/session.test.ts` pasa.

- [x] **T4. Persistir y restaurar la sesión pausada y terminada en segundo plano.** RF-2, RF-3, RF-8, RF-10
  - Hecho cuando: la prueba de persistencia confirma que una sesión pausada conserva el mismo tiempo restante y que una fase terminada se recupera como terminada y no vuelve a iniciar; `npx jest src/storage/session-storage.test.ts` pasa.

- [x] **T5. Gestionar permiso y avisos de finalización.** RF-4, RF-5, RF-6, RF-7, RF-9
  - Hecho cuando: la lógica y la UI expresan que el aviso identifica la fase terminada, permanece hasta tocarlo o descartarlo, abre la app al tocarlo, y no solicita repetidamente el permiso del sistema si ya fue concedido o si sigue denegado; `npx jest` pasa y la comprobación manual en Expo Go confirma el flujo.

- [x] **T6. Mostrar el estado correcto en la pantalla y validar la experiencia manual.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-8, RF-9, RF-10
  - Hecho cuando: la pantalla refleja el tiempo restante correcto, la sesión terminada al volver a la app y el aviso de finalización con el texto correcto; la check-list manual de `rn-conventions` confirma flujo de bloqueo, segundo plano, cierre de app, toque del aviso y pausa conservada.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6

## Notas de implementación

- Las tareas de lógica y persistencia se verificarán con `npx jest`.
- Las tareas de interfaz y flujo completo se verifican con la lista manual de comprobación de `rn-conventions` en Expo Go.
- Si durante la implementación aparece una decisión que cambie el comportamiento del estudiante y no esté reflejada en la spec aprobada, se debe parar y pedir aclaración antes de avanzar.
