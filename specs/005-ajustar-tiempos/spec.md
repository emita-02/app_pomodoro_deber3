# Spec 005 - Ajustar tiempos

Estado: aprobada

HU de origen: docs/historias/HU-005.md

## Contexto y objetivo

Permitir que el estudiante adapte las duraciones de estudio y descanso, así como la cantidad de pomodoros por ciclo, con valores válidos que se conserven entre aperturas y se apliquen en el momento acordado.

## Usuarios

- Estudiante

## Historias de usuario

Como estudiante, quiero cambiar la duración del estudio, de los descansos y la cantidad de pomodoros antes del descanso largo, para adaptar la técnica a mi ritmo.

## Definiciones

- **Fase en curso:** período de estudio o descanso cuyo temporizador ya está corriendo.
- **Próxima fase del mismo tipo:** la siguiente vez que comience una fase de estudio, descanso corto o descanso largo del tipo cuya duración se modificó.
- **Ciclo en curso:** ciclo de pomodoros que ya comenzó. Un nuevo número de pomodoros por ciclo se aplica al ciclo siguiente.
- **Ciclo no comenzado:** ciclo con 0 pomodoros completados, en fase de estudio y con el temporizador ni corriendo ni en pausa. Un reinicio confirmado que devuelve el estudio a 0 deja el ciclo como no comenzado.

## Requisitos funcionales

- **RF-1:** CUANDO el estudiante guarde los ajustes, EL SISTEMA aceptará solo valores numéricos enteros: estudio entre 1 y 120 minutos, descanso corto entre 1 y 60 minutos, descanso largo entre 1 y 120 minutos, y una cantidad de 1 a 12 pomodoros por ciclo. Origen: HU-005, escenario «Ingresar un valor no válido»; decisiones.md, decisiones 1, 3 y 9.
- **RF-2:** CUANDO el estudiante guarde ajustes con valores vacíos, no numéricos, fraccionarios, cero o fuera de los rangos permitidos, EL SISTEMA mostrará junto a cada campo inválido un aviso con los valores numéricos enteros permitidos para ese campo (estudio: 1-120; descanso corto: 1-60; descanso largo: 1-120; pomodoros por ciclo: 1-12), mantendrá abierta la pantalla de ajustes y bloqueará el guardado hasta que se corrijan. Origen: HU-005, escenario «Ingresar un valor no válido»; decisiones.md, decisiones 2, 3 y 9.
- **RF-3:** CUANDO el estudiante guarde ajustes válidos, EL SISTEMA conservará los valores para que sigan disponibles y vigentes después de cerrar y volver a abrir la aplicación. Origen: HU-005, escenario «Cambiar un tiempo».
- **RF-4:** CUANDO el estudiante cambie la duración de un tipo de fase, EL SISTEMA mantendrá la duración con la que comenzó cualquier fase de ese tipo que ya esté en curso y aplicará el nuevo valor la próxima vez que comience una fase de ese mismo tipo. Origen: HU-005, escenario «Cambiar un tiempo con una fase en curso»; decisiones.md, decisión 6.
- **RF-5:** CUANDO el estudiante cambie la cantidad de pomodoros por ciclo mientras un ciclo está en curso, EL SISTEMA mantendrá para ese ciclo la cantidad con la que comenzó y aplicará el nuevo valor desde el ciclo siguiente. Origen: decisiones.md, decisión 7.
- **RF-10:** MIENTRAS el ciclo no haya comenzado, CUANDO el estudiante cambie la cantidad de pomodoros por ciclo, EL SISTEMA mostrará y usará el nuevo valor de inmediato. Origen: decisiones.md, decisión 10.
- **RF-6:** CUANDO el estudiante elija «Restablecer», EL SISTEMA mostrará una confirmación que explique que se reemplazarán los cuatro ajustes por sus valores predeterminados y ofrecerá las opciones «Cancelar» y «Restablecer», con «Cancelar» seleccionada por defecto. Origen: HU-005, escenario «Volver a los valores por defecto»; decisiones.md, decisión 5.
- **RF-7:** CUANDO el estudiante cancele la confirmación de restablecimiento, EL SISTEMA conservará sin cambios los valores de los ajustes. Origen: decisiones.md, decisión 5.
- **RF-8:** CUANDO el estudiante confirme el restablecimiento, EL SISTEMA guardará inmediatamente los valores predeterminados de 25 minutos de estudio, 5 minutos de descanso corto, 15 minutos de descanso largo y 4 pomodoros por ciclo, sin requerir otro guardado; su efecto sobre una fase o ciclo en curso respetará RF-4 y RF-5. Origen: HU-005, escenario «Volver a los valores por defecto»; decisiones.md, decisiones 4, 6 y 7.
- **RF-9:** SI el sistema no puede guardar los ajustes, ENTONCES EL SISTEMA mostrará un error claro indicando que los cambios no se guardaron, conservará en pantalla los valores editados para permitir reintentar y no los presentará como aplicados. Origen: decisiones.md, decisión 8.

## Requisitos no funcionales

- Los ajustes deben poder usarse sin conexión a internet, de acuerdo con la constitución del proyecto.

## Casos límite

- Se aceptan los extremos de cada rango indicado en RF-1.
- Los valores vacíos, cero y los valores inferiores o superiores al rango se rechazan conforme a RF-2.
- Las duraciones deben ser números enteros de minutos; no se aceptan fracciones, conforme a RF-1.
- Un cambio de duración no altera la fase de ese tipo que ya está en curso.
- Un cambio en la cantidad de pomodoros no altera el ciclo que ya está en curso.
- Un cambio en la cantidad de pomodoros se aplica de inmediato si el ciclo no ha comenzado, incluso después de iniciar y reiniciar el estudio (RF-10).
- Si falla el guardado, los valores editados permanecen disponibles en pantalla y no se consideran aplicados.

## Fuera de alcance

- Cambiar el comportamiento de inicio, pausa, reanudación o finalización del temporizador.
- Modificar las reglas de transición entre estudio y descansos.

## Criterios de finalización

- Se cubren los cuatro escenarios de HU-005: guardar y conservar ajustes, rechazar valores inválidos, restablecer con confirmación y aplicar una nueva duración después de la fase en curso.
- Se verifica que los rangos y valores predeterminados coincidan con las decisiones registradas.
- Se verifica el comportamiento cuando falla el guardado de los ajustes.
- Las dudas abiertas quedan resueltas antes de aprobar la spec.

## Dudas abiertas

No hay dudas abiertas.
