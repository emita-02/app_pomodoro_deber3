# Spec 002 - Estudio y descanso

Estado: aprobada

HU de origen: docs/historias/HU-002.md

## Contexto y objetivo

La aplicación debe alternar automáticamente entre fases de estudio y descanso para que el estudiante pueda seguir la técnica Pomodoro sin llevar la cuenta manualmente. El sistema debe mantener el avance del ciclo, conservarlo si la aplicación se cierra o pasa a segundo plano y dejar preparada la siguiente fase sin iniciar otra cuenta regresiva sin que el estudiante lo solicite.

## Usuarios

- Estudiante que quiere seguir un ciclo de estudio y descanso con un seguimiento claro del progreso actual.

## Historias de usuario

- Como estudiante, quiero que la aplicación pase sola del tiempo de estudio al de descanso para seguir la técnica Pomodoro sin tener que llevar la cuenta yo mismo.
- Como estudiante, quiero que la aplicación me muestre si estoy en estudio o descanso y cuánto avance llevo en el ciclo actual.
- Como estudiante, quiero que el ciclo conserve su progreso aunque abra y cierre la aplicación durante una sesión o mientras está preparada la siguiente fase.

## Definiciones

- Fase preparada: estado en el que la aplicación ya ha identificado la siguiente fase del ciclo y la deja lista para que el estudiante la inicie, pero no la empieza automáticamente.
- Descanso corto: pausa breve que sigue a una sesión de estudio y que cuenta como una sesión completada al terminarse.
- Descanso largo: pausa más prolongada que sigue a la cuarta sesión de estudio y reinicia el ciclo cuando termina.
- Contador de pomodoros: indicador del número de sesiones completadas en el ciclo actual.

## Requisitos funcionales

RF-1: CUANDO termina un tiempo de estudio y todavía no se alcanza la cantidad configurada para el descanso largo, EL SISTEMA deja preparada una sesión de descanso corto y no inicia su cuenta regresiva automáticamente. Origen: Escenario: Terminar un pomodoro.

RF-2: CUANDO termina el último tiempo de estudio del ciclo y se completa la cantidad configurada de pomodoros, EL SISTEMA deja preparada una sesión de descanso largo y reinicia el contador de pomodoros a cero. Origen: Escenario: Llegar al descanso largo.

RF-3: CUANDO termina un descanso corto o largo, EL SISTEMA deja preparada la siguiente sesión de estudio y no inicia otra cuenta regresiva sin la acción explícita del estudiante. Origen: Escenario: Terminar un descanso.

RF-4: CUANDO la aplicación está en una sesión activa, EL SISTEMA muestra si la fase actual es estudio o descanso y refleja el número de pomodoros completados en el ciclo actual. Origen: Escenario: Ver mi avance.

RF-5: CUANDO una sesión de estudio finaliza mientras la aplicación está cerrada o en segundo plano, EL SISTEMA conserva el avance del ciclo y, al volver a la aplicación, deja preparada la fase siguiente correspondiente sin iniciar automáticamente otra cuenta regresiva. Origen: Decisiones 3 y 4.

RF-6: CUANDO termina cada descanso corto de los primeros tres ciclos, EL SISTEMA incrementa el contador de pomodoros en una unidad y lo muestra en la pantalla principal. Origen: Decisión 5.

RF-7: CUANDO termina el descanso largo, EL SISTEMA vuelve el contador de pomodoros a cero para iniciar un nuevo ciclo y mantiene el avance visible según el estado del descanso largo. Origen: Decisión 6.

## Requisitos no funcionales

- No se definen requisitos no funcionales adicionales específicos para esta historia más allá de la precisión del avance del ciclo, la continuidad del estado y la disponibilidad del temporizador sin depender de conexión o registro.

## Casos límite

- La sesión de estudio termina justo en el instante de cierre de la aplicación.
- La aplicación se abre después de un descanso corto y la siguiente fase debe quedar preparada.
- La aplicación se abre después de un descanso largo y el contador debe reiniciarse a cero.
- El estudiante mira la pantalla principal durante una sesión activa y debe ver el avance del ciclo correcto.

## Fuera de alcance

- Definir nuevas duraciones o configuraciones del temporizador fuera de las fases previstas por la historia.
- Iniciar automáticamente la siguiente fase tras detectar el fin de una sesión sin la acción del estudiante.
- Cambiar la regla de contaje del ciclo una vez establecida en la historia y sus decisiones.

## Criterios de finalización

- La aplicación alterna correctamente entre estudio y descanso según el avance del ciclo.
- El contador de pomodoros refleja el avance real de las sesiones completadas según el descanso correspondiente.
- El sistema conserva el avance del ciclo si la aplicación se cierra o se pone en segundo plano.
- La próxima fase queda preparada al terminar la actual, sin iniciar automáticamente la cuenta regresiva.
- La pantalla principal informa claramente si la fase activa es estudio o descanso y cuántos pomodoros lleva el estudiante.

## Dudas abiertas

- No hay dudas abiertas para esta historia; los escenarios y decisiones establecen el comportamiento esperado.
