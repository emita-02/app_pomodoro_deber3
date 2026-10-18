---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development en este proyecto: revisar o modificar docs/constitution.md, docs/historias/, decisiones, specs, planes y tareas; o implementar y validar tareas aprobadas.
---

# Spec-Driven Development (SDD)

## Flujo de trabajo y responsabilidades

Constitución + grill-me -> Spec -> Plan y tareas -> Implementación -> Cambio.

| Fase | Quien | Escribe solo |
| --- | --- | --- |
| Decisiones | skill grill-me | specs/NNN/decisiones.md |
| Spec | agente sdd-spec | specs/NNN/spec.md |
| Plan y tareas | agente sdd-plan | specs/NNN/plan.md y tasks.md |
| Implementación | agente sdd-implement | Código, pruebas y la casilla de la tarea |

- Nunca pases a la siguiente fase sin la aprobación explicita del usuario.
- La spec manda: si algo no esta en la spec, no se implementa.
- Si falta una decisión: al redactar la spec, márcala [NECESITA ACLARACIÓN];
al planificar o implementar, para y pregunta.
- Un cambio de requisitos se hace primero en la spec, luego en el plan y las
tareas, y por ultimo en el código.
- Cada spec vive en specs/NNN-nombre/. decisiones.md lo genera grill-me; solo
se le añade al final, numerada, una decision que dicte el usuario para
resolver una duda abierta.
- Al terminar una fase o tarea, actualiza en MEMORY.md solo "Estado actual" y
"Próximos pasos" (indicando el siguiente agente). No copies decisiones ni
contenido de la spec.


## Plantilla de spec (spec.md)

Usa esta estructura:

# Spec NNN - <Nombre>

Estado: borrador | aprobada | implementada

HU de origen: docs/historias/HU-00N.md

## Contexto y objetivo
## Usuarios
## Historias de usuario
## Definiciones (solo si hay términos que puedan interpretarse de varias formas)
## Requisitos funcionales
## Requisitos no funcionales
## Casos límite
## Fuera de alcance
## Criterios de finalización
## Dudas abiertas
- [NECESITA ACLARACIÓN] <duda>

La spec describe el QUE y el POR QUE. Nada de stack, arquitectura, formatos de almacenamiento ni nombres de archivos. Un RF por comportamiento visible.

## Requisitos en EARS (en español)

Redacta los requisitos utilizando las siguientes estructuras cuando correspondan:

- RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-x: EL SISTEMA <comportamiento permanente>.

Cada requisito funcional debe ser verificable y terminar con `Origen:`, indicando el escenario de la historia de usuario o la decisión registrada en `decisiones.md` que lo sustenta.

Cada escenario de las historias de usuario debe estar cubierto por uno o más requisitos funcionales. No elimines ni cambies el sentido de un criterio de aceptación para facilitar su implementación.

## Revisión final de la spec

Al terminar `spec.md`, presenta una revisión que identifique, sin proponer soluciones técnicas:

1. Contradicciones entre requisitos funcionales.
2. Escenarios de las historias de usuario sin requisitos asociados.
3. Conflictos con `docs/constitution.md`.
4. Dudas que requieren una decisión del usuario.
5. Criterios de aceptación cuya viabilidad todavía no se ha confirmado.

Máximo 10 observaciones. Si no existen observaciones, indícalo expresamente.

La spec debe permanecer en estado `borrador` hasta que el usuario la apruebe.

## Plan (plan.md)

Archivos y responsabilidades . Funciones puras . Persistencia .Algoritmo en pseudocódigo . Interfaz . Decisiones justificadas con su alternativa descartada . Estrategia de pruebas con Jest. Indica que RF cubre cada parte.

## Tareas (tasks.md)

```
- [ ] ** Tn. <Descripcion> .** RF-x, RF-y
  - Hecho cuando: <comprobacion verificable>.
```
Maximo 20-30 min por tarea, en orden de dependencia. Si salen más de 10,
propón dividir la spec.

## Implementación

Una sola tarea cada vez: pruebas primero (en rojo), después el código, npx jest en verde, marcar la tarea y parar. Si la tarea toca la interfaz, entrega la lista manual de verificacion y espera a que el usuario confirme que la probó en Expo Go antes de marcarla como hecha.

Al cerrar la tarea, lista que escenarios de la HU quedan cubiertos por pruebas y cuales no. Informa; no declares que algo "esta correcto".