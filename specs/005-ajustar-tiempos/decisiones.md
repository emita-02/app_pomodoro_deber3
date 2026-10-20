# Decisiones - HU-005: Ajustar los tiempos del pomodoro

## 1. Rangos permitidos

**Pregunta:** ¿Qué límites deben aceptar los cuatro campos?

**Respuesta:** Estudio: de 1 a 120 minutos; descanso corto: de 1 a 60 minutos; descanso largo: de 1 a 120 minutos; pomodoros por ciclo: de 1 a 12.

**Motivo:** La historia exige rechazar valores fuera del rango, pero no define límites. Estos rangos precisan los valores válidos que la aplicación debe aceptar e indicar.

## 2. Indicación de valores inválidos

**Pregunta:** ¿Cómo debe indicar la aplicación el error para valores vacíos, cero o fuera de rango?

**Respuesta:** Mostrar junto a cada campo inválido un mensaje con sus límites permitidos, mantener abierta la pantalla de ajustes y bloquear el guardado hasta corregirlo.

**Motivo:** El estudiante puede identificar y corregir el campo que impide guardar sin perder el contexto de los ajustes.

## 3. Formato de las duraciones

**Pregunta:** ¿Las duraciones deben aceptar únicamente minutos enteros?

**Respuesta:** Sí. Solo se aceptan minutos enteros, sin fracciones.

**Motivo:** Se establece un formato de entrada inequívoco para las duraciones y se evita admitir valores distintos de los acordados.

## 4. Efecto de confirmar el restablecimiento

**Pregunta:** ¿Al confirmar “Restablecer” se deben aplicar y guardar inmediatamente los valores predeterminados, sin requerir otro guardado?

**Respuesta:** Sí. Se aplican y guardan inmediatamente los cuatro valores predeterminados: 25 minutos de estudio, 5 de descanso corto, 15 de descanso largo y 4 pomodoros por ciclo.

**Motivo:** El restablecimiento confirmado deja la configuración completa en sus valores predeterminados y persistidos.

## 5. Confirmación del restablecimiento

**Pregunta:** ¿Qué debe ocurrir al elegir “Restablecer”?

**Respuesta:** Abrir una confirmación que explique que se reemplazarán los cuatro ajustes por los valores predeterminados, con las opciones “Cancelar” y “Restablecer”. “Cancelar” debe ser la opción seleccionada por defecto y no debe cambiar ningún valor.

**Motivo:** La confirmación hace explícito el alcance de la acción y permite evitar una sustitución accidental.

## 6. Aplicación de cambios de duración

**Pregunta:** ¿Cuándo se aplica una nueva duración si ya hay una fase en curso?

**Respuesta:** La fase en curso conserva la duración con la que empezó. El nuevo valor se aplica la próxima vez que comience una fase de ese mismo tipo.

**Motivo:** Se conserva el tiempo de la fase iniciada, tal como exige la HU-005, sin recalcular una cuenta regresiva en curso.

## 7. Cambio de pomodoros por ciclo durante un ciclo

**Pregunta:** ¿Cuándo se aplica el nuevo número de pomodoros si el ciclo actual ya empezó?

**Respuesta:** El ciclo en curso conserva la cantidad con la que empezó; el nuevo valor se aplica desde el siguiente ciclo.

**Motivo:** Evita cambiar retroactivamente el punto en que corresponde preparar el descanso largo.

## 8. Error al guardar

**Pregunta:** ¿Qué debe hacer la aplicación si no logra guardar los ajustes en el almacenamiento local?

**Respuesta:** Mostrar un error claro indicando que los cambios no se guardaron, conservar los valores editados en pantalla para reintentar y no presentarlos como aplicados.

**Motivo:** El estudiante puede distinguir entre cambios guardados y no guardados, y reintentar sin volver a introducirlos.

## 9. Validación numérica y aviso de rango

**Pregunta:** ¿Qué valores se aceptan y qué aviso se muestra cuando se ingresa un valor fuera de rango?

**Respuesta:** Solo se aceptan valores numéricos enteros. Si se ingresa un número menor o mayor que el rango permitido, se muestra junto al campo un aviso que indica que solo se aceptan valores numéricos enteros dentro de su rango: estudio, de 1 a 120; descanso corto, de 1 a 60; descanso largo, de 1 a 120; pomodoros por ciclo, de 1 a 12.

**Motivo:** El aviso identifica los valores enteros que se pueden ingresar en cada campo y permite corregir el dato inválido.

## 10. Cantidad de pomodoros mientras el ciclo no ha comenzado

**Pregunta:** ¿Cuándo se aplica de inmediato un cambio en los pomodoros por ciclo y cuándo se conserva el valor del ciclo?

**Respuesta:** Si el ciclo ya comenzó, se conserva su cantidad de pomodoros. Mientras el ciclo siga en 0 y no se haya iniciado el temporizador de la sesión de estudio, el nuevo valor de los ajustes debe aplicarse de inmediato. Se considera que el ciclo no ha comenzado cuando la fase es de estudio, hay 0 pomodoros completados y el temporizador no está corriendo ni en pausa, incluso si el estudiante lo inició antes y lo reinició.

**Motivo:** Precisa la decisión 7. El estudiante espera ver reflejado el cambio antes de empezar a estudiar, y un reinicio que devuelve el ciclo a 0 no debe dejar fijo el valor anterior.

