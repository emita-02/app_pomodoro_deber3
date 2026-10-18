---
name: pomodoro-rules
description: Úsala siempre que escribas, modifiques o revises la lógica o los requisitos del temporizador Pomodoro, las fases de estudio y descanso, el conteo de pomodoros, las duraciones configurables o las transiciones entre fases.
---

# Reglas del temporizador Pomodoro

## Fuente de verdad

- Respeta `docs/constitution.md`, las historias de usuario de `docs/historias/` y la spec activa y aprobada.
- La spec aprobada define el comportamiento que debe implementarse. Esta skill no la sustituye ni puede introducir requisitos nuevos.
- Si existe una contradicción entre documentos, una regla no está definida o un criterio admite varias interpretaciones, detente y solicita una aclaración.
- No inventes reglas para completar una implementación aparentemente sencilla.

## Fases y valores predeterminados

- La aplicación contempla tres tipos de fase: estudio, descanso corto y descanso largo.
- Los valores predeterminados son:
  - Estudio: 25 minutos.
  - Descanso corto: 5 minutos.
  - Descanso largo: 15 minutos.
  - Pomodoros por ciclo antes del descanso largo: 4.
- El estudiante puede modificar las duraciones y la cantidad de pomodoros según las reglas definidas en la spec aprobada.
- Los valores predeterminados deben recuperarse cuando el usuario confirme la acción de restablecer la configuración.
- No establezcas límites mínimos o máximos para los valores configurables sin una decisión aprobada.

## Control del temporizador

- Al iniciar, utiliza la duración configurada para la fase actual.
- Al pausar, conserva el tiempo restante.
- Al reanudar, continúa desde el tiempo restante conservado.
- Al reiniciar, solicita confirmación cuando así lo establezcan los requisitos; si el usuario cancela, conserva el estado y el tiempo anteriores.
- Al confirmar el reinicio, vuelve al tiempo inicial de la fase actual.
- El tiempo mostrado debe corresponder al tiempo restante real y no depender exclusivamente de la frecuencia con la que se actualiza la interfaz.
- No permitas que el tiempo restante mostrado sea negativo.
- Los cambios de duración de una fase que ya está en curso deben aplicarse según los criterios de la HU-005 y la spec aprobada.

## Transiciones y ciclo Pomodoro

- Al terminar una fase de estudio, deja preparada la siguiente fase de descanso correspondiente, de acuerdo con la HU-002.
- Si todavía no corresponde un descanso largo, prepara un descanso corto.
- Cuando se completa la cantidad de pomodoros configurada para el ciclo, prepara un descanso largo y reinicia el contador del ciclo según los requisitos aprobados.
- Al terminar un descanso, deja preparado el siguiente período de estudio.
- Distingue entre una fase preparada y una fase en ejecución. No inicies automáticamente la cuenta regresiva de la siguiente fase si los requisitos aprobados no lo permiten.
- Muestra la fase actual y el avance del ciclo en la pantalla principal.
- No supongas que reiniciar, pausar o abandonar una fase equivale a completar un pomodoro.
- Si no está definido cómo afectan los reinicios o cierres anticipados al contador del ciclo, solicita una aclaración antes de implementar esa regla.

## Persistencia y recuperación

- Respeta los requisitos aprobados para recuperar el temporizador al volver a abrir la aplicación.
- Una fase en ejecución debe recuperar el tiempo restante correcto, considerando el tiempo transcurrido mientras la aplicación no estaba activa.
- Una fase pausada debe continuar pausada al recuperar la sesión.
- No confundas el tiempo restante con el valor inicial configurado para una fase.
- No asumas que guardar un contador en memoria es suficiente para recuperar una sesión después de cerrar la aplicación.
- No decidas por cuenta propia qué información de la sesión debe persistirse; sigue el plan aprobado.

## Validación de las configuraciones

- Rechaza los valores que incumplan las reglas de validación definidas en la spec aprobada.
- Los campos vacíos, el valor cero y los valores fuera del rango permitido deben gestionarse conforme a los criterios de aceptación.
- Si los rangos permitidos todavía no están definidos, solicita una decisión antes de establecerlos.
- Un cambio de configuración debe conservarse entre aperturas de la aplicación.
- Si se modifica la duración de una fase en curso, conserva el comportamiento definido en la HU-005: la fase actual termina con la duración con la que empezó y el cambio se aplica a la siguiente fase.
- No guardes configuraciones inválidas ni reemplaces silenciosamente los valores introducidos por el usuario.

## Checklist de revisión

Antes de dar por terminada una tarea relacionada con estas reglas, verifica los puntos que correspondan:

- [ ] ¿Se utilizan correctamente los valores predeterminados?
- [ ] ¿Iniciar, pausar y reanudar conservan el comportamiento esperado?
- [ ] ¿Reiniciar y cancelar el reinicio producen resultados diferentes y correctos?
- [ ] ¿Las transiciones entre estudio, descanso corto y descanso largo respetan el ciclo configurado?
- [ ] ¿Se distingue una fase preparada de una fase en ejecución?
- [ ] ¿El contador del ciclo se actualiza según las reglas aprobadas?
- [ ] ¿Los cambios de configuración se aplican a partir de la fase correspondiente?
- [ ] ¿Se rechazan los valores inválidos sin guardar cambios incorrectos?
- [ ] ¿La sesión se recupera correctamente después de bloquear el celular o cerrar la aplicación, según los requisitos aprobados?
- [ ] ¿Las pruebas cubren los límites y casos especiales definidos en la spec?
- [ ] ¿Se identificaron las reglas pendientes de aclaración?
- [ ] ¿Los resultados se comprobaron realmente y se registraron sin inventar evidencias?

## Al terminar

Informa:

1. Qué reglas se modificaron.
2. Qué requisitos y escenarios se verificaron.
3. Qué pruebas se ejecutaron y sus resultados.
4. Qué casos límite no se probaron.
5. Qué decisiones siguen pendientes.

No declares una regla como validada si no existe evidencia suficiente. No marques tareas como completadas cuando sus criterios de finalización no se hayan cumplido.