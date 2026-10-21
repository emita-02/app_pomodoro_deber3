# Tareas de la historia 006 - Uso libre

- [x] **T1. Revisar el acceso inicial y las dependencias de las funciones principales. (25 min)** RF-1, RF-2, RF-3, RF-7
  - Revisar la pantalla principal, la navegación, la lógica de sesión y los avisos existentes. Identificar si alguna función esencial depende de autenticación, servicios externos o conexión de red.
  - Hecho cuando: queda identificado qué comportamiento ya cumple la spec y qué cambios son realmente necesarios; no se duplican pantallas ni lógica de las HU anteriores.

- [x] **T2. Verificar la persistencia local de los ajustes. (25 min)** RF-4, RF-5, RF-7
  - Revisar `src/domain/settings.ts`, `src/storage/settings-storage.ts` y `src/context/settings-context.tsx`. Añadir o ajustar únicamente las pruebas necesarias para cubrir guardado, recuperación y errores de almacenamiento.
  - Hecho cuando: las pruebas de `src/storage/settings-storage.test.ts` comprueban que los ajustes se guardan y recuperan correctamente, y que un fallo de escritura no se presenta como un guardado exitoso; `npx jest src/storage/settings-storage.test.ts` pasa.

- [x] **T3. Verificar el funcionamiento local del temporizador y los avisos. (25 min)** RF-2, RF-3, RF-7
  - Revisar la lógica existente de sesión y el flujo de avisos locales. Añadir o ajustar pruebas de dominio solo si falta cobertura.
  - Hecho cuando: las pruebas verifican que la lógica esencial de sesión no requiere una respuesta de red y que se mantienen las reglas de finalización y recuperación de las HU anteriores; `npx jest src/domain/session.test.ts` pasa.

- [x] **T4. Validar el acceso directo y los ajustes en la interfaz. (25 min)** RF-1, RF-4, RF-5
  - Revisar la primera apertura de la aplicación y la pantalla existente de ajustes. Realizar cambios solo si se detecta una desviación de la spec.
  - Hecho cuando: en la comprobación manual la aplicación abre directamente el temporizador, no exige registro ni inicio de sesión y permite consultar y guardar los ajustes desde la interfaz existente; se verifican los puntos aplicables de `rn-conventions`.

- [ ] **T4b. Retirar la pestaña «Explorar» y el control de prueba de notificaciones. (25 min)** RF-8
  - Eliminar `src/app/explore.tsx`, su entrada en la navegación nativa y web, y el botón «Restablecer notificaciones (prueba)» con su manejador y estilos en `session-controls.tsx`. No se desinstalan dependencias ni se borran otros componentes.
  - Hecho cuando: la navegación solo muestra Inicio y Ajustes; la pantalla de inicio no muestra el botón de prueba; la app recorre ambas pantallas sin errores; `npx tsc --noEmit`, `npx expo lint` y `npx jest` pasan.

- [ ] **T5. Validar la aplicación sin conexión y sin publicidad. (25 min)** RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Realizar la prueba manual con el dispositivo sin conexión, comprobar los ajustes después de reabrir la aplicación y recorrer las pantallas disponibles.
  - Hecho cuando: el temporizador, los avisos locales y los ajustes funcionan sin datos móviles ni wifi; los ajustes se conservan después de cerrar y reabrir la aplicación; no aparece publicidad en las pantallas; y se registra el resultado de la lista manual aplicable de `rn-conventions`.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T4b
6. T5

## Notas de implementación

- Las tareas de lógica y persistencia se verifican con `npx jest`.
- Las tareas de interfaz y funcionamiento sin conexión requieren verificación manual en el entorno móvil del proyecto.
- No se deben añadir dependencias ni servicios externos para resolver requisitos que ya pueden cubrirse con la lógica y el almacenamiento local existentes.
- Si se detecta que una función esencial depende de internet o que un cambio altera el comportamiento visible definido en la spec aprobada, se debe detener la implementación y solicitar aclaración antes de cambiar el alcance.
- Una tarea solo se marcará como completada cuando se cumpla su criterio de «Hecho cuando».
