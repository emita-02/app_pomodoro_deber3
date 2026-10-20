# Tareas - Spec 005: Ajustar tiempos

- [x] **T1. Definir ajustes y validación pura.** RF-1, RF-2, RF-8
  - Hecho cuando: `settings.ts` exporta los cuatro valores predeterminados y valida enteros/rangos; `npx jest` pasa pruebas de extremos, vacíos, no numéricos, fracciones, cero y fuera de rango para cada campo.

- [x] **T2. Persistir los ajustes localmente.** RF-3, RF-8, RF-9
  - Hecho cuando: `settings-storage.ts` carga valores predeterminados si no hay datos, guarda y recupera los cuatro ajustes y propaga errores de escritura; `npx jest` verifica guardado, recarga, restablecimiento y fallo.

- [x] **T3. Aplicar cambios en límites de fase y ciclo.** RF-4, RF-5, RF-8
  - Hecho cuando: las funciones puras de sesión conservan duración y umbral activos, aplican cambios a la próxima fase del mismo tipo/al siguiente ciclo y cubren el caso previo al primer ciclo; `npx jest` pasa esos escenarios y el de restablecimiento.

- [x] **T3b. Aplicar de inmediato la cantidad de pomodoros si el ciclo no ha comenzado.** RF-5, RF-10
  - Hecho cuando: el ciclo no comenzado se deduce del estado (estudio, 0 completados, sin correr ni pausa); cambiar los pomodoros en ese estado se aplica al instante, también tras iniciar y reiniciar; reiniciar adopta el valor pendiente; con el ciclo comenzado se conserva el valor activo; `npx jest` pasa esos escenarios.

- [x] **T4. Recuperar instantáneas de sesión compatibles.** RF-4, RF-5
  - Hecho cuando: la carga de sesiones antiguas normaliza los campos añadidos sin alterar fases/ciclos activos; `npx jest` pasa pruebas de sesión nueva, sesión antigua y recuperación de instantáneas.

- [x] **T5. Compartir los ajustes y aplicarlos a la sesión activa.** RF-3, RF-4, RF-5, RF-8
  - Hecho cuando: la configuración cargada al inicio se comparte con ambas pantallas y un guardado exitoso actualiza Inicio al instante; no cambia el tiempo de la fase activa ni el umbral del ciclo iniciado, y la siguiente fase/ciclo usa los nuevos valores; `npx jest` pasa las pruebas de actualización de sesión.

- [x] **T6. Crear formulario y acceso a Ajustes.** RF-1, RF-2
  - Hecho cuando: la ruta Ajustes presenta los cuatro campos, valida y muestra junto a cada campo inválido el rango correcto, y queda accesible desde pestañas nativa/web; en Expo Go se comprueban manualmente campos, mensajes, legibilidad en vertical/horizontal, paleta, Crafty Girls y accesibilidad de controles.

- [x] **T7. Conectar guardar y restablecer en la interfaz.** RF-3, RF-6, RF-7, RF-8, RF-9
  - Hecho cuando: Guardar persiste solo valores válidos; Restablecer solicita confirmación con Cancelar predeterminado, cancelarlo no cambia ajustes y confirmarlo guarda inmediatamente los cuatro predeterminados; ante error se avisa que no se guardó y se conservan los valores editados. Confirmar manualmente en Expo Go, incluyendo reapertura y reintento.

- [x] **T8. Verificar regresión y cobertura de la spec.** RF-1–RF-9
  - Hecho cuando: `npx jest`, `npx tsc --noEmit` y `npx expo lint` terminan sin errores, y la lista manual de rn-conventions confirma el flujo de ajustes en Android Expo Go, incluida recuperación después de cerrar y abrir la app.
