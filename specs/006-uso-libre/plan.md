# Plan de la historia 006 - Uso libre

## Alcance

- Se planifican RF-1 a RF-8 de la spec aprobada.
- Se reutilizan las pantallas, la lógica del temporizador, los avisos y el almacenamiento local existentes.
- No se incorporan cuentas, registro, autenticación, servicios externos ni publicidad.
- La implementación debe mantener el comportamiento de las historias anteriores, especialmente la recuperación de sesión, los ajustes y los avisos de finalización.
- Las decisiones de producto se toman de `decisiones.md`: D-001, D-002, D-003, D-004, D-005 y D-006.
- Antes de modificar archivos, se revisará su contenido actual para evitar duplicar funciones o cambiar comportamientos ya implementados.

## 1. Archivos y responsabilidades

- `src/app/index.tsx`
  - Mantener el acceso directo al temporizador al abrir la aplicación.
  - Evitar introducir pantallas de bienvenida, registro o inicio de sesión como requisito para utilizar la aplicación.
  - Cubre RF-1.

- `src/app/` (pantalla o ruta existente de ajustes)
  - Mantener accesibles los ajustes sin conexión a internet.
  - Mostrar los estados de carga o error de lectura de los ajustes sin afirmar que se guardaron correctamente cuando no sea así.
  - Cubre RF-4 y RF-5.

- `src/domain/settings.ts`
  - Reutilizar la definición existente de los ajustes y sus valores predeterminados.
  - No introducir dependencias de red en la lógica de configuración.
  - Cubre RF-4 y RF-5.

- `src/storage/settings-storage.ts`
  - Reutilizar el almacenamiento local de los ajustes.
  - Confirmar que guardar y recuperar los valores no depende de una conexión a internet.
  - No cambiar el formato de almacenamiento si no es necesario.
  - Cubre RF-4 y RF-5.

- `src/storage/settings-storage.test.ts`
  - Verificar que los ajustes se guardan y recuperan correctamente mediante el almacenamiento local.
  - Cubrir los resultados de lectura y escritura necesarios para demostrar que la aplicación no afirma haber guardado datos cuando la operación falla.
  - Cubre RF-4 y RF-5.

- `src/context/settings-context.tsx`
  - Reutilizar el contexto actual para cargar y actualizar los ajustes.
  - Mantener el comportamiento existente ante errores de lectura y escritura.
  - Cubre RF-4 y RF-5.

- `src/domain/session.ts`
  - Reutilizar la lógica existente de sesión y sus funciones puras.
  - Confirmar que el temporizador y sus transiciones no necesitan servicios externos para funcionar.
  - No duplicar ni reemplazar la lógica de las HU anteriores.
  - Cubre RF-2 y RF-7.

- `src/domain/session.test.ts`
  - Verificar con Jest los comportamientos de sesión necesarios para confirmar que el temporizador funciona sin conexión y conserva las reglas actuales.
  - Cubre RF-2 y RF-7.

- `src/components/session-controls.tsx`
  - Reutilizar el flujo existente de avisos de finalización.
  - Confirmar que los avisos locales no requieren conexión a internet y que se mantiene el comportamiento definido en HU-004.
  - Cubre RF-3 y RF-7.

- `src/app/` y componentes de las pantallas existentes
  - Revisar todas las pantallas y componentes visibles para confirmar que no se presentan anuncios, banners ni ventanas publicitarias.
  - No añadir SDK, componentes ni servicios de publicidad.
  - Cubre RF-6 y RF-7.

- `src/app/explore.tsx`
  - Eliminar la pantalla «Explorar».
  - Cubre RF-8.

- `src/components/app-tabs.tsx` y `src/components/app-tabs.web.tsx`
  - Quitar la entrada «Explorar» y conservar Inicio y Ajustes.
  - Cubre RF-8.

- `src/components/session-controls.tsx`
  - Quitar el botón «Restablecer notificaciones (prueba)», su manejador, sus estilos y la importación que ya no se use. El resto del componente no cambia.
  - Cubre RF-8.

No se prevén archivos nuevos ni dependencias adicionales. No se desinstalan dependencias ni se borran otros componentes de plantilla en esta historia. Si la revisión detecta que un requisito ya está implementado, se conservará ese comportamiento y se añadirá o ajustará la verificación que falte, en lugar de reescribirlo.

## 2. Funciones puras de lógica

Se reutilizará la lógica de dominio existente y se evitará incorporar dependencias de red.

- En `src/domain/session.ts`, se reutilizarán las funciones actuales para crear, iniciar, pausar, reanudar, sincronizar y finalizar una sesión.
- En `src/domain/settings.ts`, se reutilizarán la definición de ajustes y los valores predeterminados existentes.
- No se crearán funciones nuevas para registro, autenticación, publicidad o acceso a servicios externos.

Las pruebas de dominio deberán demostrar que las operaciones necesarias del temporizador se resuelven con el estado local y no dependen de una respuesta de red.

Cubre RF-2, RF-4 y RF-7.

## 3. Persistencia

La aplicación ya utiliza `@react-native-async-storage/async-storage` para guardar los ajustes y la sesión localmente.

- Se reutilizará `src/storage/settings-storage.ts` para guardar y recuperar los ajustes.
- Se conservará `src/storage/session-storage.ts` para el estado de la sesión, respetando las reglas definidas en las HU anteriores.
- No se añadirá una base de datos remota ni sincronización obligatoria con un servidor.
- Se comprobará el guardado y la recuperación de los ajustes después de cerrar y volver a abrir la aplicación.
- Si el almacenamiento falla, no se declarará que los ajustes quedaron guardados.

Las decisiones D-002 y D-003 establecen el funcionamiento sin conexión y la conservación local de los ajustes. La implementación debe respetar también el comportamiento de recuperación de sesión de las historias anteriores.

Cubre RF-2, RF-3, RF-4, RF-5 y RF-7.

## 4. Algoritmo en pseudocódigo

### Inicio de la aplicación

1. Abrir la aplicación.
2. Mostrar directamente la pantalla principal del temporizador.
3. Cargar el estado de la sesión y los ajustes locales.
4. Si hay una sesión guardada, recuperarla según las reglas ya definidas.
5. Si no hay ajustes guardados, utilizar los valores predeterminados existentes.
6. Permitir el uso de la aplicación sin solicitar registro ni inicio de sesión.

### Uso sin conexión

1. El estudiante abre la aplicación sin conexión a internet.
2. El sistema permite utilizar el temporizador con la lógica local existente.
3. El sistema permite consultar y cambiar los ajustes.
4. Al guardar, el sistema utiliza el almacenamiento local.
5. Al reabrir la aplicación, el sistema recupera los ajustes guardados.
6. Los avisos locales de finalización siguen el comportamiento establecido en HU-004, sin depender de servicios externos.

### Ausencia de publicidad

1. El estudiante navega por las pantallas disponibles.
2. El sistema muestra únicamente el contenido funcional de la aplicación.
3. No se presentan anuncios, banners ni ventanas publicitarias.

Cubre RF-1 a RF-7.

## 5. Presentación en la interfaz

- Se conservará la pantalla principal existente y su acceso directo al temporizador.
- Los ajustes seguirán disponibles desde la navegación actual.
- Se respetarán los textos en español, los estilos y la lista manual de verificación de `rn-conventions`.
- Los errores de almacenamiento se comunicarán sin afirmar que un cambio quedó guardado.
- No se introducirán pantallas, banners ni ventanas publicitarias.
- No se incorporarán pantallas de registro o inicio de sesión para habilitar las funciones principales.

Cubre RF-1, RF-4, RF-5 y RF-6.

## 6. Decisiones técnicas justificadas

### D-001. Acceso directo al temporizador

- Decisión: utilizar la navegación y la pantalla principal existentes.
- Justificación: la historia requiere que el estudiante pueda empezar a usar la aplicación sin registro ni inicio de sesión.
- Alternativa descartada: añadir un flujo obligatorio de bienvenida, registro o autenticación.

### D-002. Funcionamiento sin conexión

- Decisión: mantener la lógica del temporizador y los avisos locales sin dependencia obligatoria de internet.
- Justificación: las funciones principales deben seguir disponibles sin datos móviles ni wifi.
- Alternativa descartada: consultar un servicio remoto para iniciar el temporizador o completar sus funciones esenciales.

### D-003. Persistencia local de los ajustes

- Decisión: reutilizar `@react-native-async-storage/async-storage` y el almacenamiento de ajustes existente.
- Justificación: el proyecto ya utiliza almacenamiento local y la historia requiere conservar los ajustes en el dispositivo.
- Alternativa descartada: almacenar los ajustes exclusivamente en un servidor o añadir una sincronización obligatoria.

### D-004. Ausencia de publicidad

- Decisión: no incorporar servicios, SDK ni componentes publicitarios.
- Justificación: la historia establece que no deben aparecer anuncios en ninguna pantalla.
- Alternativa descartada: mostrar publicidad integrada, banners o ventanas emergentes.

### D-005. Independencia de servicios externos

- Decisión: mantener las funciones esenciales independientes de servicios externos. Cualquier función futura que use internet no debe bloquear el uso sin conexión.
- Justificación: el temporizador, los ajustes y los avisos deben poder utilizarse sin conexión.
- Alternativa descartada: hacer que las funciones principales dependan de un servidor o de una respuesta de red.

## 7. Estrategia de pruebas con Jest

### Pruebas de lógica

- Ejecutar las pruebas existentes de `src/domain/session.test.ts`.
- Verificar el funcionamiento de la sesión con el estado local y sin incorporar dependencias de red.
- Comprobar que las transiciones y la recuperación mantienen las reglas definidas en las HU anteriores.
- Ejecutar `npx jest` para verificar la suite de pruebas.

### Pruebas de persistencia

- Ejecutar las pruebas existentes de `src/storage/settings-storage.test.ts`.
- Verificar el guardado y la recuperación de los ajustes.
- Verificar que los errores de almacenamiento no se interpreten como un guardado exitoso.
- Comprobar que la sesión continúa utilizando su almacenamiento actual sin cambios incompatibles.

### Verificación manual

La validación manual se realizará en el entorno móvil del proyecto, siguiendo la lista de `rn-conventions` cuando corresponda.

- Instalar y abrir la aplicación por primera vez; confirmar que se muestra directamente el temporizador.
- Activar el modo avión y comprobar el uso del temporizador, los ajustes y los avisos locales.
- Cambiar y guardar los ajustes; cerrar y volver a abrir la aplicación; comprobar que se conservan.
- Recorrer las pantallas disponibles y confirmar que no aparecen anuncios.
- Confirmar que los cambios no alteran el comportamiento de la sesión ni los avisos definidos en las historias anteriores.

Jest no sustituye la comprobación en un dispositivo o entorno móvil de que las funciones funcionan sin conexión ni la inspección visual de todas las pantallas.

## 8. Cobertura por requisito

- RF-1: acceso directo mediante la pantalla principal y la navegación existente; verificación manual de primera apertura.
- RF-2: lógica local de sesión; pruebas de dominio y verificación manual sin conexión.
- RF-3: avisos locales de finalización; revisión de la integración existente y verificación manual sin conexión.
- RF-4: ajustes disponibles sin conexión; revisión del contexto y de la pantalla de ajustes, más verificación manual.
- RF-5: persistencia local de los ajustes; pruebas de almacenamiento y comprobación después de cerrar y reabrir la aplicación.
- RF-6: ausencia de publicidad; revisión de las pantallas y componentes existentes y comprobación manual de navegación.
- RF-7: independencia de las funciones esenciales respecto de servicios externos; revisión de la lógica y de la persistencia, pruebas automatizadas y comprobación manual sin conexión.
- RF-8: navegación solo con Inicio y Ajustes y sin controles de prueba; `npx tsc --noEmit`, `npx expo lint` y comprobación manual.
