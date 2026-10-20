# Plan de la historia 004 - Recibir aviso al terminar el tiempo

## 1. Archivos y responsabilidades

- `src/domain/session.ts`
  - Conservar la política pura de cuándo solicitar permiso y cuándo explicar cómo habilitarlo. Ajustarla solo si las pruebas muestran que no respeta la primera solicitud y el permiso denegado.
  - Cubre RF-5 y RF-6.

- `src/domain/session.test.ts`
  - Verificar la política para permiso concedido, sin decisión previa y denegado, incluyendo que denegar el permiso no impida iniciar la sesión.
  - Cubre RF-5 y RF-6.

- `src/storage/session-storage.ts`
  - Reutilizar las marcas existentes de solicitud de permiso y ciclo completado. No cambiar el formato persistido de la sesión.
  - Cubre RF-5 y RF-6.

- `src/storage/session-storage.test.ts`
  - Verificar que las marcas de permiso persisten localmente y que la sesión continúa recuperándose sin depender de las notificaciones.
  - Cubre RF-5, RF-6 y RF-7.

- `src/components/session-controls.tsx`
  - Configurar el canal Android y la notificación local de finalización, resolver el permiso al iniciar, presentar el aviso alternativo en la app y gestionar el toque, la acción «Detener» y el descarte de la notificación.
  - La fase que terminó se identifica antes de mostrar la fase siguiente preparada; no se inicia automáticamente.
  - Cubre RF-1 a RF-7.

No se prevén archivos nuevos ni cambios en `app.json` o dependencias: `expo-notifications` ya está instalado y las notificaciones locales están disponibles. Solo se reconsideraría configuración nativa si la comprobación de viabilidad demuestra que hace falta; no se añadirá permiso o acceso especial sin autorización.

## 2. Funciones puras de lógica

Se reutilizarán las funciones existentes en `src/domain/session.ts`; no hace falta crear un segundo modelo de temporizador.

- `getNotificationPermissionAction(permissionState, hasRequestedPermission, isLaterCycle)`: decide entre solicitar, explicar cómo activar o no mostrar otro aviso de permiso. Cubre RF-5 y RF-6.
- `startSession(session, now)` y `advanceSession(session, now)`: mantienen el inicio independiente del resultado del permiso y preparan la fase siguiente cuando el tiempo llega a cero. Cubre RF-3, RF-6 y RF-7.
- `shouldShowCompleted(session)`: determina si la pantalla muestra el aviso dentro de la app cuando no hay notificación. Cubre RF-7.

La reproducción, programación y respuesta a notificaciones permanecen en la capa de interfaz/Expo; no se incorporan efectos del sistema a la lógica pura.

## 3. Persistencia

- Reutilizar `@app_pomodoro/notification-permission-requested` y `@app_pomodoro/notification-cycle-completed` de `src/storage/session-storage.ts`, según Decisión 1.
- Mantener la instantánea de sesión existente; no guardar nuevos datos ni cambiar su formato.
- Al volver desde una notificación, restaurar la sesión con `loadSession(Date.now())`. La lógica existente debe dejar visible la fase siguiente preparada y sin cuenta regresiva automática, conforme a la Decisión 3.
- Si el permiso se deniega o no se puede programar una notificación, la sesión sigue en marcha y la pantalla comunica la limitación; al terminar en primer plano, el estado de finalización identifica la fase terminada.

Cubre RF-3, RF-5, RF-6 y RF-7.

## 4. Algoritmo en pseudocódigo

```text
al iniciar la sesión:
  iniciar y persistir la sesión sin esperar el permiso
  consultar permiso y marcas locales
  si corresponde la primera solicitud:
    explicar el uso de las notificaciones
    solicitar permiso al confirmar
  si el permiso se deniega:
    mantener el temporizador y mostrar el aviso de limitación
  si el permiso está concedido:
    programar aviso local para la fecha límite de la fase

al llegar la fase a cero:
  actualizar la sesión y dejar preparada la fase siguiente
  si hay permiso:
    mostrar notificación que identifica la fase terminada
  si la app está visible y no hay permiso:
    mostrar el aviso dentro de la app

al tocar la notificación o «Detener»:
  silenciar/detener el aviso
  restaurar la sesión finalizada
  mostrar la fase siguiente preparada sin iniciarla

al descartar la notificación:
  silenciar/detener el aviso
```

El algoritmo de sonido y descarte queda condicionado a la comprobación técnica inicial: no se dará por cumplido solo porque la notificación se programe correctamente.

Cubre RF-1 a RF-7.

## 5. Cómo se pinta en la interfaz

- La notificación muestra qué terminó: estudio, descanso corto o descanso largo; se configura para la pantalla de bloqueo, sonido y vibración según RF-1 y RF-2.
- En primer inicio sin permiso, se explica el propósito antes de solicitarlo. Denegar o posponer no detiene la sesión y se presenta el aviso de limitación requerido por RF-6.
- Si la fase termina con la app abierta y las notificaciones denegadas, el texto de finalización dentro de la pantalla identifica la fase terminada (RF-7).
- El toque de la notificación y la acción «Detener» llevan a la pantalla con la siguiente fase preparada. Descartar la notificación debe silenciar el aviso (RF-3 y RF-4).
- Se conserva el estilo actual de la pantalla; no se añaden controles visuales ajenos a la spec.

La verificación manual seguirá los puntos aplicables de `rn-conventions`: vertical y giro, contraste/legibilidad, fuente e imágenes existentes, controles táctiles y accesibles, recuperación de sesión y comprensión del estado sin depender del color. Además, se probarán en un dispositivo Android físico los modos sonido, silencio y vibración, pantalla bloqueada, app en segundo plano/cerrada, permiso denegado, toque, acción «Detener» y descarte.

## 6. Decisiones técnicas justificadas

### Decisión 1: reutilizar `expo-notifications` y notificaciones locales

- La dependencia ya está instalada y Expo SDK 57 documenta programación local, canales Android, permisos y respuestas a interacciones.
- Alternativa descartada: añadir otra librería o servicio externo. No es necesario para los flujos descritos y chocaría con la simplicidad y operación local.
- Referencia: [Expo Notifications para SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/notifications/).

### Decisión 2: validar la alarma como puerta previa a implementarla

- RF-2 exige sonido y vibración en silencio/vibración, pero la documentación de Expo advierte que los sonidos personalizados pueden no reproducirse en modo silencio o concentración. Android también da al usuario control final del comportamiento del canal y no permite cambiar sus ajustes de comportamiento después de crearlo.
- Por tanto, T1 debe revisar las capacidades documentadas y T2 confirmar en Android físico la viabilidad de RF-2 y RF-4. La documentación de Expo expone `customDismissAction` solo para iOS; no se asumirá que Android avisa a la app cuando se descarta la notificación. Tampoco se asumirá que `bypassDnd`, una categoría de alarma o el sonido predeterminado garantizan el sonido. Si la prueba no cumple la spec, se detiene la implementación de esos RF y se solicita una decisión antes de cambiar la experiencia o añadir acceso nativo/especial.
- Alternativa descartada: afirmar que un canal de alta prioridad garantiza sonido y vibración en todos los modos del teléfono. La documentación no respalda esa garantía.
- Referencias: [canales de notificación Android](https://developer.android.com/develop/ui/views/notifications/channels) y [permisos de notificación Android](https://developer.android.com/develop/ui/views/notifications/notification-permission).

### Decisión 3: versionar el canal si cambia su configuración

- Android no permite modificar el comportamiento de un canal creado. Si T2 confirma configuración viable y el canal actual `session-completion-v2` no tiene los atributos necesarios, usar un identificador nuevo para que el dispositivo aplique la configuración inicial correcta.
- Alternativa descartada: volver a configurar el mismo ID esperando que Android cambie sonido, vibración o prioridad; el sistema conserva los ajustes originales y las preferencias del usuario.

### Decisión 4: no modificar el formato persistido

- Las marcas requeridas para permiso y ciclo ya existen de forma independiente a la sesión; la sesión y `loadSession` ya preparan la fase siguiente.
- Alternativa descartada: almacenar el permiso o estado de alarma en la sesión. No es necesario para RF y alteraría datos que la HU no pide cambiar.

### Decisión 5: conservar la lógica del temporizador fuera de React

- Las transiciones de fase siguen usando las funciones puras existentes; la capa de componente solo conecta sus resultados con las APIs de notificaciones.
- Alternativa descartada: poner cálculo de tiempo o transiciones dentro de callbacks nativos/UI, lo que haría más difícil probarlo y arriesgaría duplicar las reglas de HU-002/HU-003.

## 7. Estrategia de pruebas con Jest

1. Lógica pura:
   - Probar las ramas de permiso concedido, primera solicitud, denegación y explicación posterior en `src/domain/session.test.ts`.
   - Confirmar que iniciar mantiene `status: running` aunque el permiso se deniegue y que terminar deja la fase siguiente preparada sin iniciar.
   - Ejecutar `npx jest src/domain/session.test.ts`.

2. Persistencia:
   - Probar las marcas existentes de permiso/ciclo y que recuperar una sesión no depende del permiso.
   - Ejecutar `npx jest src/storage/session-storage.test.ts`.

3. Integración manual Android:
   - Verificar sonido y vibración con teléfono en sonido, silencio y vibración, con pantalla bloqueada y app cerrada.
   - Verificar permiso denegado, aviso visible en primer plano, toque, acción «Detener» y descarte.
   - Confirmar que la fase siguiente no empieza sola.
   - Las pruebas en Expo Go no sustituyen la validación de sonido en silencio ni de comportamiento de canales en el Android objetivo.

La verificación final es manual porque las APIs nativas, preferencias del canal y modos del dispositivo no se reproducen fielmente con Jest.

## 8. Cobertura por requisito

- RF-1: canal/notificación local con etiqueta de fase; `session-controls.tsx`; prueba manual en modo sonido.
- RF-2: canal Android, pantalla de bloqueo, sonido y vibración; puerta técnica T1 y prueba manual en silencio/vibración.
- RF-3: respuesta al toque/acción «Detener», restauración y fase siguiente preparada; lógica existente y comprobación manual.
- RF-4: descarte y silenciamiento; puerta técnica T1 y comprobación manual Android.
- RF-5: explicación y solicitud al iniciar sin permiso; política pura y flujo de interfaz.
- RF-6: denegación no bloquea sesión y presenta advertencia; Jest y comprobación manual.
- RF-7: finalización dentro de la app con identificación de fase ante permiso denegado; estado existente y comprobación manual.
