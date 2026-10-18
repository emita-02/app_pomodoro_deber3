# Constitución - Temporizador Pomodoro de la Academia Cotopaxi

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad primero:** no se añaden dependencias nuevas sin aprobación. Se priorizan las herramientas y librerías existentes en el proyecto.

2. **La spec manda:** nada se implementa si no está definido en la spec activa. Si falta una decisión importante o existe una ambigüedad en los requisitos, se detiene el desarrollo y se pregunta antes de continuar.

3. **Lógica separada de interfaz:** las reglas del temporizador, las transiciones entre fases y los cálculos del tiempo restante deben mantenerse separados de los componentes visuales. La lógica de negocio debe poder probarse sin depender de la interfaz.

4. **Pruebas como puerta:** la lógica del temporizador debe probarse con las herramientas de pruebas definidas en el proyecto. No se avanza a la siguiente etapa con pruebas fallidas. La interfaz y los flujos de uso se verifican mediante la lista de comprobación manual definida para cada tarea.

5. **Los datos del usuario son sagrados:** las configuraciones guardadas deben conservarse al cerrar y volver a abrir la aplicación, así como ante cambios de código. No se eliminan ni sobrescriben datos del usuario sin una razón justificada y, cuando corresponda, su confirmación explícita.

6. **Exactitud del temporizador:** el tiempo restante debe calcularse de forma que refleje el tiempo realmente transcurrido, incluso cuando la aplicación pasa a segundo plano o deja de ejecutarse temporalmente. Las pausas, reanudaciones, reinicios y finalizaciones deben respetar el estado de la sesión. La estrategia técnica debe definirse en la spec y justificarse en el plan.

7. **Transiciones controladas:** los cambios entre estudio, descanso corto y descanso largo deben respetar la cantidad de pomodoros configurada y los criterios de aceptación. No se inicia automáticamente una nueva cuenta regresiva cuando los requisitos solo establecen que la siguiente fase debe quedar preparada.

8. **Notificaciones y alarmas:** los avisos de finalización deben identificar la fase que terminó y cumplir los requisitos aprobados de sonido, vibración y controles. La solución debe considerar los permisos, el modo silencio, las restricciones del sistema operativo y el comportamiento cuando la aplicación está cerrada. Toda limitación técnica debe identificarse antes de implementar la funcionalidad, sin prometer comportamientos que la plataforma no garantice.

9. **Configuración validada:** las duraciones y la cantidad de pomodoros deben validarse antes de guardarse. Los valores predeterminados son 25 minutos de estudio, 5 minutos de descanso corto, 15 minutos de descanso largo y 4 pomodoros por ciclo. Los cambios deben aplicarse según las reglas de la fase en curso y conservarse entre aperturas de la aplicación.

10. **Privacidad y funcionamiento sin conexión:** la aplicación debe poder utilizarse sin registro, conexión a internet ni publicidad. Las funciones principales y las configuraciones guardadas deben funcionar localmente, sin depender de servicios externos innecesarios.

11. **Compatibilidad y coherencia:** las funcionalidades deben respetar las tecnologías, versiones y plataformas definidas para el proyecto. Antes de incorporar una solución específica de Android o iOS, se debe evaluar su compatibilidad con el resto de la aplicación y con los requisitos aprobados.

12. **Interfaz orientada al estudiante:** la interfaz debe ser clara, accesible y fácil de utilizar durante una sesión de estudio. Debe mostrar la fase actual, el tiempo restante y el avance del ciclo, y respetar los lineamientos visuales que se definan para la Academia Cotopaxi.

13. **Cambios controlados:** no se modifican archivos, configuraciones, dependencias ni funcionalidades ajenas a la tarea activa sin justificación y aprobación. Si un cambio afecta una decisión establecida en una spec anterior, se debe actualizar la documentación correspondiente antes de implementarlo.

14. **Plataforma objetivo:** la aplicación se desarrolla para Android. Las decisiones técnicas, dependencias, pruebas y funcionalidades deben priorizar la compatibilidad con Android. No se implementan funcionalidades específicas de iOS ni se añaden configuraciones para esa plataforma sin aprobación.