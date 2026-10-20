# Plan - Spec 005: Ajustar tiempos

## Alcance

Implementar la configuración local de las cuatro opciones, su validación y restablecimiento, y conectar los valores persistidos con las siguientes fases/ciclos sin alterar la fase o el ciclo que ya comenzaron. Se mantienen las reglas de temporizador y navegación existentes fuera de este alcance.

## Archivos y responsabilidades

| Archivo | Acción | Responsabilidad | RF |
|---|---|---|---|
| `src/domain/settings.ts` | Crear | Tipo de ajustes, valores predeterminados, validación pura de enteros y rangos. | RF-1, RF-2, RF-8 |
| `src/domain/settings.test.ts` | Crear | Casos límite para valores válidos e inválidos y valores predeterminados. | RF-1, RF-2, RF-8 |
| `src/storage/settings-storage.ts` | Crear | Leer y guardar los cuatro ajustes con AsyncStorage; propagar errores de lectura/escritura al llamador. | RF-3, RF-8, RF-9 |
| `src/storage/settings-storage.test.ts` | Crear | Persistencia, carga sin datos previos, restablecimiento y fallo de escritura. | RF-3, RF-8, RF-9 |
| `src/context/settings-context.tsx` | Crear | Cargar una vez los ajustes guardados y compartirlos entre Ajustes e Inicio; publicar cambios solo después de persistirlos. | RF-3, RF-4, RF-5, RF-8, RF-9 |
| `src/app/_layout.tsx` | Modificar | Proveer el estado compartido de ajustes a las rutas existentes. | RF-3, RF-4, RF-5 |
| `src/domain/session.ts` | Modificar | Aplicar ajustes a la sesión sin cambiar la duración capturada de una fase en curso ni el umbral del ciclo en curso; conservar el nuevo umbral como pendiente y adoptarlo al iniciar el ciclo siguiente. | RF-4, RF-5, RF-8 |
| `src/domain/session.test.ts` | Modificar | Probar cambios durante una fase/ciclo, antes del primer ciclo y al comenzar el ciclo siguiente. | RF-4, RF-5, RF-8 |
| `src/storage/session-storage.ts` | Modificar | Normalizar el umbral pendiente nuevo para sesiones guardadas anteriores, sin cambiar el formato ya almacenado de los ajustes de sesión. | RF-4, RF-5 |
| `src/storage/session-storage.test.ts` | Modificar | Asegurar la recuperación de sesiones existentes y conservar las instantáneas activa y pendiente. | RF-4, RF-5 |
| `src/app/settings.tsx` | Crear | Pantalla Ajustes con cuatro campos, mensajes por campo, acción de guardar, restablecimiento confirmado y mensajes de error. | RF-1, RF-2, RF-3, RF-6, RF-7, RF-8, RF-9 |
| `src/components/app-tabs.tsx` | Modificar | Añadir acceso «Ajustes» a la navegación Android/React Native. | RF-1–RF-9 |
| `src/components/app-tabs.web.tsx` | Modificar | Mantener el acceso a Ajustes en la navegación web ya existente. | RF-1–RF-9 |
| `src/components/session-controls.tsx` | Modificar | Aplicar inmediatamente los cambios compartidos a las fases/ciclos futuros y conservar la sesión activa; esperar a que sesión y ajustes estén cargados antes de iniciar. | RF-3, RF-4, RF-5, RF-8 |

No se añaden dependencias ni se modifica el almacenamiento de sesiones para guardar las preferencias: la configuración persistida y la instantánea de la sesión son datos con propósitos distintos.

## Funciones puras de dominio

En `src/domain/settings.ts`:

- `DEFAULT_SETTINGS`: estudio 25 min, descanso corto 5 min, descanso largo 15 min y 4 pomodoros por ciclo.
- `SettingsDraft`: los cuatro valores de texto tal como se editan en el formulario.
- `validateSettings`: recibe `SettingsDraft` y devuelve errores por campo y, solo cuando todo es válido, los cuatro valores numéricos tipados. Solo acepta enteros dentro de los rangos definidos en RF-1; los avisos de cada campo indican ese rango.

En `src/domain/session.ts`:

- `applySettingsToSession`: recibe la sesión y los ajustes nuevos para preparar los valores futuros de cada fase/ciclo.
- La duración y el tiempo restante de la fase actual no se recalculan.
- El umbral de pomodoros activo se conserva desde que comienza el ciclo hasta que termina el descanso largo; `pendingPomodorosPerCycle` guarda el último valor configurado para el ciclo siguiente.
- El ciclo se considera no comenzado cuando la fase es de estudio, hay 0 pomodoros completados y el temporizador no corre ni está en pausa (decisión 10, RF-10). Esto se deduce del estado de la sesión, no de una bandera guardada, de modo que un reinicio que devuelve el estudio a 0 también cuenta. En ese caso los ajustes se aplican de inmediato y el reinicio adopta el valor pendiente.
- Al completar el descanso largo, el valor pendiente pasa a ser el umbral activo del ciclo que comienza y el pendiente se sincroniza con la configuración vigente.
- Restablecer usa los mismos límites de aplicación que guardar otros ajustes; no reinicia ni completa la fase o ciclo.

## Persistencia

- `settings-storage.ts` usará el AsyncStorage ya instalado y una clave independiente para la configuración, con los cuatro valores en una única estructura tipada.
- `settings-context.tsx` cargará esa configuración al iniciar la app y la compartirá entre las rutas. Una escritura exitosa actualiza el contexto; una fallida propaga el error y deja intactos los ajustes aplicados. La carga distingue entre ausencia de configuración (usar predeterminados) y fallo de almacenamiento (no afirmar que la configuración se cargó correctamente).
- Si no existe una configuración guardada, la carga devuelve los valores predeterminados sin reemplazar los datos de sesión.
- La escritura solo se considera exitosa cuando AsyncStorage resuelve. Los errores se propagan para que la pantalla conserve el borrador y comunique que no se guardó (RF-9).
- La pantalla primero valida y después persiste. Solo tras una escritura exitosa confirma los valores en su estado aplicado. Restablecer persiste inmediatamente los cuatro valores predeterminados.
- La sesión sigue guardándose con `session-storage.ts`; cualquier campo nuevo de instantánea de ciclo tendrá normalización compatible con sesiones existentes.

## Algoritmo en pseudocódigo

```text
al abrir Ajustes:
  cargar configuración persistida o DEFAULT_SETTINGS
  mostrar los cuatro valores como borrador editable

al guardar:
  validar cada borrador
  si hay campos inválidos:
    mostrar junto a cada uno el rango de enteros permitido
    mantener pantalla y borrador; no escribir
  si todos son válidos:
    intentar persistir la configuración
    si falla:
      mostrar error explícito de que no se guardó
      conservar el borrador y los valores aplicados anteriores
    si tiene éxito:
      publicar los ajustes en el estado compartido
      marcar configuración como aplicada y regresar/permitir regresar

al elegir Restablecer:
  pedir confirmación con Cancelar como opción predeterminada
  si cancela: no modificar ajustes ni sesión
  si confirma:
    persistir los cuatro valores predeterminados inmediatamente
    aplicar el mismo manejo de éxito/error que al guardar

al recibir una configuración nueva o recuperar una sesión:
  sincronizar primero la sesión con el tiempo real transcurrido
  actualizar las duraciones futuras, sin alterar duration/remaining de la fase actual
  si el ciclo ya comenzó:
    mantener el umbral de ese ciclo y guardar el nuevo umbral en pendingPomodorosPerCycle
  si el ciclo no ha comenzado (estudio, 0 completados, sin correr ni pausa):
    aplicar el umbral nuevo de inmediato

al reiniciar con confirmación:
  si el ciclo no ha comenzado: adoptar el umbral pendiente
  si no: conservar el umbral activo
  al terminar el descanso largo:
    adoptar pendingPomodorosPerCycle para el ciclo que empieza
  guardar la sesión actualizada sin convertir una fase preparada en ejecución
```

## Interfaz

- La ruta Ajustes tendrá campos separados para «Estudio (minutos)», «Descanso corto (minutos)», «Descanso largo (minutos)» y «Pomodoros por ciclo». Los campos numéricos mostrarán mensajes de error junto al campo correspondiente, con los rangos exactos de RF-2.
- Guardar mantiene la pantalla y los valores ingresados si la validación falla o el almacenamiento rechaza la escritura. Un mensaje claro comunica el fallo y que los cambios no se guardaron.
- «Restablecer» abre una confirmación que explica que reemplazará los cuatro valores. Ofrece «Cancelar» y «Restablecer», con Cancelar como opción predeterminada; cancelar deja ajustes y sesión intactos.
- La confirmación de restablecimiento solo presenta los predeterminados como aplicados después de que se hayan guardado.
- Ajustes respeta las convenciones de interfaz del proyecto: textos en español, StyleSheet, paleta Academia Cotopaxi, Crafty Girls, áreas seguras, objetivos táctiles de al menos 44x44 puntos y etiquetas accesibles. La pantalla de ajustes no necesita imágenes del temporizador.
- La navegación nativa y web presentará el destino con el rótulo «Ajustes» sin cambiar el comportamiento de las demás rutas.

## Decisiones técnicas

1. **Separar la configuración persistida de la sesión guardada.** Preferencias editables se guardan con clave AsyncStorage propia y la sesión conserva las instantáneas de fase/ciclo que ya empezaron. Así un cambio de preferencia no reescribe retroactivamente la sesión activa (RF-3–RF-5; decisiones 6–8). Se descarta guardar las cuatro preferencias únicamente dentro del objeto de sesión, porque mezclaría configuración futura con el umbral/duración activos.
2. **Validación en dominio antes de persistir y mostrar errores por campo en la pantalla.** Una función pura evita que las reglas dependan del renderizado y permite probar todos los rangos con Jest (RF-1, RF-2; decisiones 1–3 y 9). Se descarta validar solo al guardar en la interfaz, porque otras entradas al dominio podrían eludir la regla.
3. **Aplicar los valores nuevos en límites explícitos de fase y ciclo, no recalculando una sesión activa.** El valor `durationMs`/`remainingMs` de una fase iniciada permanece como instantánea, y el umbral vigente se conserva hasta el ciclo siguiente (RF-4, RF-5; decisiones 6 y 7). Se descarta reemplazar todos los campos de sesión al guardar, ya que cambiaría el resultado del período/ciclo en curso.
4. **Escritura confirmada antes de presentar cambios como aplicados.** Un fallo de AsyncStorage se propaga a la UI; no se oculta con una captura silenciosa ni con valores predeterminados de éxito (RF-8, RF-9; decisiones 4 y 8). Se descarta actualizar primero el estado aplicado y guardar después, porque puede presentar como vigente una configuración que no quedó almacenada.
5. **Compartir los ajustes guardados a nivel de la app.** Un contexto actualiza la sesión activa inmediatamente después de un guardado exitoso, incluso si Inicio sigue montado detrás de Ajustes; se evita depender del foco de pantalla o de una lectura tardía (RF-3–RF-5; decisiones 6–8). Se descarta sincronizar solo al regresar a Inicio, porque el temporizador podría completar una fase mientras Ajustes permanece abierto y usar una duración obsoleta.
6. **Usar la navegación de pestañas existente para exponer una ruta Ajustes.** Se mantiene Expo Router y sus implementaciones nativa/web actuales, sin añadir librerías ni rutas de navegación alternativas (RF-1–RF-9; constitución, principios 1 y 11). Se descarta introducir una navegación o dependencia nueva, que no aporta a los escenarios aprobados.

## Estrategia de pruebas con Jest

- **Dominio de configuración:** probar valores predeterminados; extremos válidos; vacío, no numérico, fracción, cero, inferior/superior al rango; y errores por cada campo con el rango esperado (RF-1, RF-2, RF-8).
- **Almacenamiento:** probar carga de valores predeterminados sin configuración guardada, persistencia/relectura de los cuatro valores, escritura de los predeterminados al restablecer y propagación de fallo sin reportar éxito (RF-3, RF-8, RF-9).
- **Sesión:** probar que cambiar cada duración no afecta la fase del mismo tipo ya iniciada y que el valor se usa en la siguiente fase; que el ciclo activo conserva su umbral, y que el siguiente ciclo toma el valor cambiado; probar ajuste antes del primer ciclo y restablecimiento durante fase/ciclo (RF-4, RF-5, RF-8).
- **Recuperación:** probar compatibilidad con sesiones persistidas antes de la nueva instantánea de ciclo y comprobar que una fase/ciclo activos mantienen sus valores después de cargar la sesión (RF-4, RF-5).
- **Integración del componente:** cubrir mediante pruebas de dominio/almacenamiento los resultados que usa la pantalla. La presentación, accesibilidad, confirmación y flujo de navegación se validan manualmente en Expo Go siguiendo la lista de `rn-conventions`; no se añadirá una librería de pruebas de UI.

## Cobertura de requisitos

- RF-1 y RF-2: `settings.ts`, validación pura, formulario y pruebas de dominio; errores por campo también se revisan manualmente.
- RF-3: persistencia independiente, carga al reabrir/volver a Inicio y pruebas de almacenamiento.
- RF-4: instantánea de duración de fase y pruebas de transición.
- RF-5: umbral de ciclo activo y adopción del valor nuevo al iniciar el ciclo siguiente, con pruebas de dominio.
- RF-6 y RF-7: confirmación, opción Cancelar predeterminada y cancelación sin cambios, validadas manualmente.
- RF-8: escritura inmediata de valores predeterminados y aplicación en los límites RF-4/RF-5; pruebas de almacenamiento y dominio.
- RF-9: error de escritura propagado, texto claro y borrador conservado; pruebas de almacenamiento y validación manual del flujo de error.

## Riesgos y límites de verificación

- Las pruebas Jest no pueden probar el aspecto real, foco/selección predeterminada ni comportamiento táctil del diálogo nativo; comprobar estos puntos en Expo Go en Android.
- El fallo de AsyncStorage debe simularse en Jest para la ruta lógica y comprobarse que la pantalla deja los campos editados disponibles para reintentar.
- La pantalla se valida en orientación vertical y horizontal; el foco y la legibilidad de los campos no se consideran demostrados por pruebas unitarias.
