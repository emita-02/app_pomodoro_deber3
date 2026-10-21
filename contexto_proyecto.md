# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
ðŸ“„ ARCHIVO: .github\agents\sdd-implement.agent.md
================================================

---
name: sdd-implement
description: SDD · Implementa una tarea de tasks.md con las pruebas primero y comprueba los escenarios de la HU
---

Eres el agente de implementación del Temporizador Pomodoro de la Academia Cotopaxi.

Antes de empezar lee MEMORY.md, docs/constitution.md,
.github/skills/sdd/SKILL.md, y de la carpeta specs/NNN-nombre/ lee
spec.md, plan.md y tasks.md. Si no te digo qué tarea, usa la primera pendiente de
tasks.md y dime cuál es antes de empezar.

## Qué haces, por cada tarea
1. En la lógica, escribes primero las pruebas y compruebas que fallan.
2. Escribes el código hasta que pasen, siguiendo plan.md y las skills
academic-rules, rn-conventions y epn-brand cuando correspondan.
3. Ejecutas npx jest y me muestras el resultado.
4. Si la tarea toca la interfaz, no ejecutas la app: me entregas los puntos de la lista manual de rn-conventions que debo probar en Expo Go y esperas mi confirmación.
5. Con las pruebas en verde (y mi confirmación si hubo interfaz), marcas la tarea en tasks.md e indicas qué RF cubre.
6. Listas qué escenarios de la HU quedan cubiertos por pruebas y cuáles no. Informas, no declaras que algo está correcto.
7. Actualizas en MEMORY.md solo "Estado actual" y "Próximos pasos".

Después PÁRATE. No empieces la siguiente tarea.

## Varias tareas seguidas
Solo si te nombro las tareas explícitamente (por ejemplo T2 a T4): las haces en
ese orden, con las pruebas primero, y paras y me avisas si una prueba falla o
si una tarea toca la interfaz.

## Qué no haces
- No tocas spec.md, plan.md ni decisiones.md. Si algo no cuadra, para y dímelo.
- No instalas dependencias ni ejecutas npx expo start sin que te lo pida.
- No haces commit.

================================================
ðŸ“„ ARCHIVO: .github\agents\sdd-plan.agent.md
================================================

---
name: sdd-plan
description: SDD . Genera plan.md y tasks.md de una spec aprobada
handoffs:
- label: Implementar una tarea
  agent: sdd-implement
  prompt: Implementa la primera tarea pendiente de la spec que acabamos de planificar y dime cuál es.
  send: false
---

Eres el agente de planificación del Temporizador Pomodoro de la Academia Cotopaxi. Solo escribes
specs/NNN-nombre/plan.md y specs/NNN-nombre/tasks.md. NO escribas código.

Antes de empezar lee MEMORY.md, docs/constitution.md,
.github/skills/sdd/SKILL.md, specs/NNN-nombre/spec.md y
specs/NNN-nombre/decisiones.md. Si no te digo qué carpeta, pregúntamelo.

Si spec.md no tiene "Estado: aprobada" o aún tiene [NECESITA ACLARACIÓN],
PARA y avísame; no generes nada.

## Qué haces
1. plan.md, con: archivos que se crean o modifican y la responsabilidad de
cada uno, funciones puras de lógica, persistencia, algoritmo en
pseudocódigo, cómo se pinta en la interfaz, decisiones técnicas
justificadas (con su alternativa descartada) y estrategia de pruebas con
Jest. Marca qué RF cubre cada parte.
2. tasks.md, con el formato de la skill sdd: tareas de 20-30 minutos como
máximo, en orden de dependencia, cada una con sus RF y una línea
"Hecho cuando:" verificable. Las de lógica se verifican con npx jest; las
de interfaz, con puntos de la lista manual de rn-conventions. Si salen más
de 10 tareas, propón dividir la spec.
3. Todo debe respetar la constitución y cubrir todos los RF.
4. Al terminar, dime cuántas tareas hay y actualiza en MEMORY.md solo "Estado
actual" y "Próximos pasos".

## Qué no haces
- No modificas spec.md ni decisiones.md. Solo paras y me avisas si una decisión
cambia lo que el usuario ve y la spec no lo recoge.
- No inventas decisiones. Las decisiones técnicas de decisiones.md
(representación de datos, almacenamiento) van en plan.md, citando su número.
- No escribes código ni pruebas.

================================================
ðŸ“„ ARCHIVO: .github\agents\sdd-spec.agent.md
================================================

---
name: sdd-spec
description: SDD · Redacta o ajusta la spec de una historia a partir de la HU y de decisiones.md
handoffs:
  - label: Pasar al plan
    agent: sdd-plan
    prompt: Planifica la spec que acabamos de aprobar.
    send: false
---

Eres el agente de especificación del Temporizador Pomodoro de la Academia Cotopaxi. Solo escribes specs/NNN-nombre/spec.md. NO escribas código en ningún momento.

Antes de empezar lee MEMORY.md, docs/constitution.md y
.github/skills/sdd/SKILL.md. Luego lee docs/historias/HU-00N.md y
specs/NNN-nombre/decisiones.md. Si no te digo qué historia o qué carpeta,
pregúntamelo antes de hacer nada.

## Qué haces
1. Generas spec.md con la plantilla de la skill sdd, con los requisitos en EARS
y "Estado: borrador".
2. Cada escenario de la HU queda cubierto por al menos un RF.
3. Cada RF termina con "Origen:" y el escenario o la decisión de la que sale.
4. Lo que decisiones.md no resuelva lo marcas [NECESITA ACLARACIÓN]. No inventes
ni añadas decisiones.
5. No me haces preguntas mientras redactas: las decisiones ya están escritas.
6. Cuando termines, haces la "Revisión final de la spec" de la skill sdd
(máximo 10 puntos, sin proponer soluciones).
7. Actualizas en MEMORY.md solo "Estado actual" y "Próximos pasos".

## Qué no haces
- No modificas decisiones.md. Única excepción: si te dicto cómo resolver una
duda abierta, añades esa decisión al final, numerada, y la aplicas en spec.md.
- Ignoras las decisiones que decisiones.md marque como revocadas.
No escribes stack, arquitectura, formatos de almacenamiento ni nombres de
archivos: solo el QUÉ y el POR QUÉ.
- No tocas plan.md, tasks.md ni el código.

================================================
ðŸ“„ ARCHIVO: .github\copilot-instructions.md
================================================


# Temporizador Pomodoro

App movil para estudiantes de la Academia Cotopaxi: Utilizar un temporizador para sesiones de estudio siguien el metodo pomodoro. Proyecto didactico construido con Spec-Driven Development (SDD).

## Stack y estructura
- Expo (plantilla por defecto de create-expo-app), TypeScript y Expo Router.
- Persistencia local con @react-native-async-storage/async-storage. Sin
backend ni cuentas.
src/domain/: lógica pura (sin React ni AsyncStorage). src/storage/:
persistencia. app/: pantallas. Pruebas junto a cada módulo, en _tests_/.

## Comandos
- Pruebas: npx jest
- Tipos: npx tsc -- noEmit
- Ejecutar la app: npx expo start (solo cuando yo lo pida)

## Dónde está cada cosa
- docs/constitution.md: principios del proyecto.
- docs/historias/: historias de usuario en Gherkin (la entrada de todo).
- specs/NNN-nombre/: decisiones.md, spec.md, plan.md y tasks.md de cada historia.
- MEMORY.md: estado actual del trabajo.
- .github/skills/: método SDD, reglas académicas, paleta y convenciones.

## Cómo trabajar
1. Al empezar, lee MEMORY.md y docs/constitution.md.
2. Codigo y nombres en ingles; textos de interfaz, comentarios y documentos
en español.
3. No tomes decisiones de producto o de diseno que la historia o decisiones.md
no definan. Marcalas como [NECESITA ACLARACIÓN] y avisame.
4. Haz solo la fase o la tarea que te pido. No avances a la siguiente.
5. En la logica, escribe primero las pruebas.
6. Pregunta antes de instalar dependencias, crear archivos fuera del plan o
cambiar el formato de los datos guardados.
7. No reemplaces archivos existentes si la tarea no lo pide. No guardes datos
sensibles. No hagas commit.

## MEMORY.md
Solo tiene "Estado actual" y "Proximos pasos". Al terminar una fase o tarea
actualiza unicamente esas dos secciones. No copies decisiones ni contenido de
la spec. Mantenlo en unas 50 lineas.

================================================
ðŸ“„ ARCHIVO: .github\skills\academia-design\SKILL.md
================================================

---
name: academia-design
description: Úsala siempre que crees o modifiques colores, estilos o pantallas del Temporizador Pomodoro de la Academia Cotopaxi.
---

# Paleta de colores del Temporizador Pomodoro de la Academia Cotopaxi

## Paleta de colores
- Azul oscuro: #141759.
- Azul violeta: #252368.
- Dorado: #D9A91A.
- Crema: #F2D194.
- Gris claro: #F2F2F2.

## Roles (fondo, texto y contraste)
- Usa los colores de la paleta de manera equilibrada y coherente en los fondos, textos, botones y demás elementos de la interfaz.
- Mantén un contraste adecuado entre el fondo y el texto para facilitar la lectura.
- Si una combinación de colores no ofrece suficiente contraste, utiliza otra combinación de la paleta.
- No asignes colores nuevos ni uses colores fuera de la paleta sin autorización.

## Imágenes
- Estado inicial del temporizador en 00:00: utiliza `puma_saludo.png`, ubicado en `assets/images`.
- Fase de estudio: utiliza `puma_estudiando.png`, ubicado en `assets/images`.
- Fase de descanso corto o largo: utiliza `puma_descansando.png`, ubicado en `assets/images`.
- Reutiliza las imágenes existentes. No crees imágenes nuevas ni dupliques los archivos.
- Muestra la imagen que corresponda al estado actual del temporizador.

## Tipografía
- Utiliza la fuente Crafty Girls de Google Fonts, desde https://fonts.google.com/share?selection.family=Crafty+Girls
- Sigue las instrucciones de importación e integración de la fuente para el proyecto Expo/React Native.
- Aplica la fuente de manera coherente en los textos de la interfaz.

## Reglas
- Mantén la coherencia visual entre las pantallas y los distintos estados del temporizador.
- Asegúrate de que los textos sean legibles sobre sus fondos.
- Si falta un color, una imagen o una decisión de diseño necesaria, pregunta antes de añadir o modificar elementos fuera de lo establecido.

================================================
ðŸ“„ ARCHIVO: .github\skills\grill-me\SKILL.md
================================================

---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".


================================================
ðŸ“„ ARCHIVO: .github\skills\grilling\SKILL.md
================================================

---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Format a round like so:

```
❓ **Q1** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>

---

❓ **Q2** - **<question title>**: <question body, might be multiple paragraphs, including multiple choices>

➡️ <your recommended answer>
```

Word each question so "yes" accepts your recommended answer.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.


================================================
ðŸ“„ ARCHIVO: .github\skills\pomodoro-rules\SKILL.md
================================================

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

================================================
ðŸ“„ ARCHIVO: .github\skills\rn-conventions\SKILL.md
================================================

---
name: rn-conventions
description: Úsala siempre que crees o modifiques pantallas, formularios o componentes de interfaz del Temporizador Pomodoro de la Academia Cotopaxi.
---

# Convenciones de interfaz en React Native

- Estilos con StyleSheet. Sin librerías de interfaz adicionales.
- Evitar diseños genéricos.
- Respetar la paleta de colores y las reglas visuales definidas en la skill academia-design.
- Utilizar la fuente Crafty Girls definida en la skill academia-design.
- Mostrar las imágenes existentes de `assets/images` según el estado del temporizador: `puma_saludo.png` para el estado inicial en 00:00, `puma_estudiando.png` para la fase de estudio y `puma_descansando.png` para la fase de descanso corto o largo.
- Respetar las áreas seguras del dispositivo (muesca y barras del sistema).
- Los objetivos táctiles deben ser de al menos 44x44 puntos. Añadir etiquetas de accesibilidad en botones e iconos.
- Todos los textos visibles en español.

## Lista manual de verificación en Expo Go
- [ ] La interfaz se ve bien en vertical y al girar el teléfono.
- [ ] Los colores y los textos mantienen un contraste adecuado y son legibles.
- [ ] La fuente Crafty Girls se muestra correctamente en los textos de la interfaz.
- [ ] En el estado inicial del temporizador en 00:00 se muestra `puma_saludo`.
- [ ] En la fase de estudio se muestra `puma_estudiando`.
- [ ] Durante el descanso corto y el descanso largo se muestra `puma_descansando`.
- [ ] Los botones e iconos se pueden tocar correctamente y cuentan con etiquetas de accesibilidad.
- [ ] Cerrar la app por completo y abrirla conserva la configuración y recupera la sesión según lo establecido en la spec.
- [ ] Los textos de los estados se entienden sin depender únicamente del color.

================================================
ðŸ“„ ARCHIVO: .github\skills\sdd\SKILL.md
================================================

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

================================================
ðŸ“„ ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

example

# generated native folders
/ios
/android


================================================
ðŸ“„ ARCHIVO: AGENTS.md
================================================

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md


================================================
ðŸ“„ ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "app_pomodoro",
    "slug": "app_pomodoro",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "apppomodoro",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "server",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 76
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
ðŸ“„ ARCHIVO: dist\metadata.json
================================================

{"version":0,"bundler":"metro","fileMetadata":{"android":{"bundle":"_expo/static/js/android/entry-3e4cd6a8b693caf96917a1e7735e2ad1.hbc","assets":[{"path":"assets\\8b042be199ec74ce82b9cd2604568e73","ext":"ttf"},{"path":"assets\\0a328cd9c1afd0afe8e3b1ec5165b1b4","ext":"png"},{"path":"assets\\778ffc9fe8773a878e9c30a6304784de","ext":"png"},{"path":"assets\\c79c3606a1cf168006ad3979763c7e0c","ext":"png"},{"path":"assets\\02bc1fa7c0313217bde2d65ccbff40c9","ext":"png"},{"path":"assets\\35ba0eaec5a4f5ed12ca16fabeae451d","ext":"png"},{"path":"assets\\3cd68ccdb8938e3711da2e8831b85493","ext":"png"},{"path":"assets\\61ca7e64b7d605716c57706cef640b9a","ext":"png"},{"path":"assets\\aff2c65b39a296d4f7e96d0f58169170","ext":"png"},{"path":"assets\\d8e7601e3df962f83c62371ac14964d8","ext":"png"},{"path":"assets\\0747a1317bbe9c6fc340b889ef8ab3ae","ext":"png"},{"path":"assets\\d84e297c3b3e49a614248143d53e40ca","ext":"png"},{"path":"assets\\1190ab078c57159f4245a328118fcd9a","ext":"png"},{"path":"assets\\78c625386b4d0690b421eb0fc78f7b9c","ext":"png"},{"path":"assets\\4403c6117ec30c859bc95d70ce4a71d3","ext":"png"},{"path":"assets\\069d99eb1fa6712c0b9034a58c6b57dd","ext":"png"},{"path":"assets\\c3273c9e5321f20d1e42c2efae2578c4","ext":"png"},{"path":"assets\\286d67d3f74808a60a78d3ebf1a5fb57","ext":"png"},{"path":"assets\\d1ea1496f9057eb392d5bbf3732a61b7","ext":"png"},{"path":"assets\\19eeb73b9593a38f8e9f418337fc7d10","ext":"png"},{"path":"assets\\ab19f4cbc543357183a20571f68380a3","ext":"png"},{"path":"assets\\d8b800c443b8972542883e0b9de2bdc6","ext":"png"},{"path":"assets\\412dd9275b6b48ad28f5e3d81bb1f626","ext":"png"},{"path":"assets\\017bc6ba3fc25503e5eb5e53826d48a8","ext":"png"},{"path":"assets\\20e71bdf79e3a97bf55fd9e164041578","ext":"png"},{"path":"assets\\98a4e3d00dbf5d65da99a69b38a7def2","ext":"xml"},{"path":"assets\\9b5cb09b4e669ed0f28f3b3f2871a0a5","ext":"xml"},{"path":"assets\\5ee5db91d59518c45ebcc99a2f5afc57","ext":"png"},{"path":"assets\\dbca075a49dc45e550c5d2e3e9601039","ext":"png"},{"path":"assets\\8409922f7d5c981001e3c9b25e4bfae5","ext":"png"},{"path":"assets\\dd40200ba8e8d98061578292d6b73791","ext":"png"},{"path":"assets\\c4278d79298bb11a8b0e68ed3e40da9e","ext":"png"},{"path":"assets\\eeb5de2ac12ace75b31dfda235208956","ext":"png"},{"path":"assets\\456346cfb0b82cc0f39e921e05d082d9","ext":"png"},{"path":"assets\\5d86e963002b3664ab81c128c838559d","ext":"png"},{"path":"assets\\02efb8472f161bcf8afc8c8489a28fca","ext":"png"},{"path":"assets\\6b0da8ec880685d1bd053c0f5ea9d09d","ext":"png"},{"path":"assets\\c62d22797f3002396754d8cc55b0ae1a","ext":"png"},{"path":"assets\\695d5a1c6f29a689130f3aaa573aec6e","ext":"png"},{"path":"assets\\b507e7f2c91ebc8fe24dee79ccb3b600","ext":"png"},{"path":"assets\\8a4d0e5b845044e56e3b2df627d01cfd","ext":"png"},{"path":"assets\\f8543f63f58dc9c4d1c24b9d495e5d3b","ext":"ttf"},{"path":"assets\\7ae6b723b26801782e96915fd6cd914f","ext":"png"},{"path":"assets\\49e0c5d534dd9c126f01919fe3aa64e9","ext":"png"}]}}}

================================================
ðŸ“„ ARCHIVO: docs\constitution.md
================================================

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

================================================
ðŸ“„ ARCHIVO: docs\historias\HU-001.md
================================================

# HU-001 - Iniciar y controlar una sesión de estudio

Usuario: Estudiante

Prioridad para el negocio: Alta · Riesgo para desarrollo:  Bajo

## Descripción (Como... quiero... para...):

Como estudiante, quiero iniciar, pausar y reiniciar un temporizador de estudio, para concentrarme durante un tiempo definido.

## Criterios de aceptación:

### Escenario: Iniciar el temporizador

Dado que estoy en la pantalla principal

Cuando presiono iniciar

Entonces empieza la cuenta regresiva con el tiempo de estudio que tengo configurado y veo los minutos y segundos que faltan

### Escenario: Pausar y continuar

Dado que tengo el temporizador corriendo

Cuando lo pauso y luego lo reanudo

Entonces la cuenta sigue desde el tiempo en que la pausé

### Escenario: Reiniciar el temporizador
Dado que tengo el temporizador corriendo o pausado

Cuando decido reiniciarlo y lo confirmo

Entonces el temporizador vuelve al tiempo inicial de la fase en la que estoy

### Escenario: Cambiar de opinión al reiniciar

Dado que tengo el temporizador corriendo o pausado

Cuando decido reiniciarlo y cancelo

Entonces el temporizador conserva el tiempo que llevaba

================================================
ðŸ“„ ARCHIVO: docs\historias\HU-002.md
================================================

# HU-002 - Alternar entre estudio y descanso

Usuario: Estudiante

Prioridad para el negocio: Media· Riesgo para desarrollo:  Bajo

## Descripción (Como... quiero... para...):

Como estudiante, quiero que la aplicación pase sola del tiempo de estudio al de descanso, para seguir la técnica Pomodoro sin tener que llevar la cuenta yo mismo.

## Criterios de aceptación:

### Escenario: Terminar un pomodoro
Dado que termina un tiempo de estudio
Cuando todavía no completo los pomodoros necesarios para el descanso largo
Entonces la aplicación deja listo un descanso corto para que yo lo inicie

### Escenario: Llegar al descanso largo
Dado que completé la cantidad de pomodoros configurada (cuatro por defecto)
Cuando termina el último tiempo de estudio
Entonces la aplicación deja listo un descanso largo y el contador de pomodoros vuelve a cero

### Escenario: Terminar un descanso 
Dado que termina un descanso corto o largo
Cuando vuelvo a la aplicación
Entonces la aplicación deja listo el siguiente tiempo de estudio

### Escenario: Ver mi avance
Dado que estoy en una sesión
Cuando miro la pantalla principal
Entonces veo si estoy en estudio o en descanso y cuántos pomodoros llevo en el ciclo actual

================================================
ðŸ“„ ARCHIVO: docs\historias\HU-003.md
================================================

# HU-003 - Mantener el conteo con el celular bloqueado o la app cerrada

Usuario: Estudiante

Prioridad para el negocio: Alta · Riesgo para desarrollo:  Alto

## Descripción (Como... quiero... para...):

Como estudiante, quiero que el temporizador siga contando aunque bloquee el celular o cierre la aplicación, para no perder el tiempo que llevo estudiando.

## Criterios de aceptación:

### Escenario: Bloquear el celular
Dado que tengo el temporizador corriendo
Cuando bloqueo el celular y lo desbloqueo unos minutos después
Entonces la aplicación muestra el tiempo restante correcto, descontando lo que pasó mientras estaba bloqueado

### Escenario: Cerrar la aplicación
Dado que tengo el temporizador corriendo
Cuando cierro la aplicación desde las apps recientes y la vuelvo a abrir
Entonces la aplicación recupera la sesión y muestra el tiempo restante correcto

### Escenario: El tiempo termina con la aplicación cerrada
Dado que cerré la aplicación con el temporizador corriendo
Cuando el tiempo se cumple antes de que vuelva a abrirla
Entonces igual recibo el aviso de fin y, al abrir la aplicación, la fase aparece como terminada

### Escenario: Pausar antes de cerrar
Dado que pausé el temporizador
Cuando cierro la aplicación y la vuelvo a abrir
Entonces el temporizador sigue pausado con el mismo tiempo restante y no recibo ningún aviso

================================================
ðŸ“„ ARCHIVO: docs\historias\HU-004.md
================================================

# HU-004 - Recibir aviso al terminar el tiempo

Usuario: Estudiante

Prioridad para el negocio: Alta · Riesgo para desarrollo:  Alto

## Descripción (Como... quiero... para...):

Como estudiante, quiero que la aplicación me avise cuando termine el tiempo de estudio o de descanso, incluso con el celular en silencio, para cambiar de actividad sin estar mirando la pantalla.

## Criterios de aceptación:

### Escenario: Aviso con el celular en sonido
Dado que el temporizador llega a cero
Cuando el celular tiene el sonido activado
Entonces recibo una notificación con sonido y vibración que me dice qué fase terminó

### Escenario: Aviso con el celular en silencio
Dado que el temporizador llega a cero
Cuando el celular está en modo silencio o vibración
Entonces la aplicación suena como alarma, vibra y muestra el aviso en la pantalla de bloqueo

### Escenario: Detener el aviso
Dado que la alarma está sonando
Cuando toco la notificación o el botón de detener
Entonces la alarma se calla y la aplicación se abre mostrando la siguiente fase

### Escenario: Permiso de notificaciones
Dado que no he dado permiso de notificaciones a la aplicación
Cuando inicio un temporizador por primera vez
Entonces la aplicación me explica para qué necesita el permiso y me lo solicita

================================================
ðŸ“„ ARCHIVO: docs\historias\HU-005.md
================================================

# HU-005 - Ajustar los tiempos del pomodoro

Usuario: Estudiante

Prioridad para el negocio: Media · Riesgo para desarrollo:  Bajo

## Descripción (Como... quiero... para...):

Como estudiante, quiero cambiar la duración del estudio, de los descansos y la cantidad de pomodoros antes del descanso largo, para adaptar la técnica a mi ritmo.

## Criterios de aceptación:

### Escenario: Cambiar un tiempo
Dado que estoy en la pantalla de ajustes
Cuando cambio un tiempo y guardo
Entonces el nuevo valor se usa desde la próxima fase y se mantiene aunque cierre la aplicación

### Escenario: Ingresar un valor no válido
Dado que estoy en la pantalla de ajustes
Cuando dejo un campo vacío, pongo cero o un valor fuera del rango permitido
Entonces la aplicación no guarda el cambio y me indica qué valores puedo usar

### Escenario: Volver a los valores por defecto
Dado que modifiqué los tiempos
Cuando elijo restablecer y lo confirmo
Entonces los tiempos vuelven a 25 minutos de estudio, 5 de descanso corto, 15 de descanso largo y 4 pomodoros por ciclo

### Escenario: Cambiar un tiempo con una fase en curso
Dado que tengo el temporizador corriendo
Cuando cambio la duración de esa misma fase
Entonces la fase actual termina con el tiempo con el que empezó y el cambio se aplica a la siguiente

================================================
ðŸ“„ ARCHIVO: docs\historias\HU-006.md
================================================

# HU-006 - Usar la aplicación sin registro, sin internet y sin publicidad
Usuario: Estudiante

Prioridad para el negocio: Alta · Riesgo para desarrollo:  Bajo

## Descripción (Como... quiero... para...):

Como estudiante, quiero usar la aplicación apenas la instalo, sin crear una cuenta, sin datos móviles y sin anuncios, para empezar a estudiar sin trabas.

## Criterios de aceptación:

### Escenario: Abrir la aplicación por primera vez
Dado que acabo de instalar la aplicación
Cuando la abro por primera vez
Entonces llego directo al temporizador, sin pantallas de registro ni de inicio de sesión

### Escenario: Usarla sin conexión
Dado que no tengo datos móviles ni wifi
Cuando uso el temporizador, los avisos y los ajustes
Entonces todo funciona igual y mis ajustes quedan guardados en el celular

### Escenario: Usarla sin publicidad
Dado que estoy usando la aplicación
Cuando paso por cualquiera de sus pantallas
Entonces no aparece ningún anuncio

================================================
ðŸ“„ ARCHIVO: eas.json
================================================

{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}


================================================
ðŸ“„ ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);


================================================
ðŸ“„ ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
ðŸ“„ ARCHIVO: MEMORY.md
================================================

# MEMORY.md - Temporizador Pomodoro

Estado del trabajo entre sesiones. Máximo ~50 líneas.

## Estado actual

- HU-003 queda cerrada tras implementar sus tareas y confirmar manualmente bloqueo, cierre, aviso y pausa.
- La spec HU-004 está aprobada y planificada en ocho tareas. T1 completada; T3 completada fuera de orden. T4 (canal v3) y T6 (acción «Detener») tienen implementación provisional, pendientes de prueba física. T5 sigue pendiente de validación manual; T2 pendiente. T7 bloqueada: Expo SDK 57 no expone callback de descarte Android.
- HU-005: T1 y T2 completadas. T3–T7 entregados; T6/T7 probados parcialmente en Expo Go. Se añadió la decisión 10 (RF-10, tarea T3b): la cantidad de pomodoros se aplica de inmediato si el ciclo no ha comenzado. Pendiente: `npx jest`, repetir `npx expo lint` (se corrigió use-color-scheme.web.ts) y probar T3b en Expo Go. T8 sin ejecutar.
- HU-006: sin decisiones.md todavía; falta la ronda de grill-me.

## Próximos pasos

- HU-005 (sdd-implement): ejecutar `npx jest`, `npx tsc --noEmit` y `npx expo lint`; marcar T3–T5 si pasan; probar T6/T7 en Expo Go con la lista de rn-conventions; después T8.
- HU-006 (grill-me, luego sdd-spec): responder la ronda de decisiones para generar decisiones.md.
- Para HU-004, pedir decisión para RF-4/T7: conservar el requisito y aprobar evaluar una integración Android nativa, o modificar el comportamiento mediante una actualización aprobada de spec/plan. Después resolver el entorno compatible y validar T2, T4 y T6; validar también T5.


================================================
ðŸ“„ ARCHIVO: package.json
================================================

{
  "name": "app_pomodoro",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@expo-google-fonts/crafty-girls": "^0.4.0",
    "@expo/ui": "~57.0.25",
    "@react-native-async-storage/async-storage": "2.2.0",
    "expo": "^57.0.0",
    "expo-constants": "~57.0.22",
    "expo-dev-client": "~57.0.20",
    "expo-device": "~57.0.2",
    "expo-font": "~57.0.4",
    "expo-glass-effect": "~57.0.4",
    "expo-image": "~57.0.5",
    "expo-linking": "~57.0.13",
    "expo-notifications": "~57.0.23",
    "expo-router": "~57.0.28",
    "expo-splash-screen": "~57.0.10",
    "expo-status-bar": "~57.0.1",
    "expo-symbols": "~57.0.3",
    "expo-system-ui": "~57.0.4",
    "expo-web-browser": "~57.0.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-gesture-handler": "~2.32.0",
    "react-native-reanimated": "4.5.1",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-web": "~0.21.4",
    "react-native-worklets": "0.10.1"
  },
  "devDependencies": {
    "@types/jest": "29.5.14",
    "@types/react": "~19.2.4",
    "eslint": "^9.0.0",
    "eslint-config-expo": "~57.0.2",
    "jest": "~29.7.0",
    "jest-expo": "~57.0.6",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "private": true,
  "jest": {
    "preset": "jest-expo"
  }
}


================================================
ðŸ“„ ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
ðŸ“„ ARCHIVO: scripts\reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /src and /scripts directories to /example based on user input and creates a new /src/app directory with an index.tsx and _layout.tsx file.
 * Demo images in /assets/images are deleted or moved along with them.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["src", "scripts"];
const exampleDir = "example";
const newAppDir = "src/app";
const exampleDirPath = path.join(root, exampleDir);
// Demo images and folders used only by the files in /src
const exampleAssets = [
  "expo-badge.png",
  "expo-badge-white.png",
  "expo-logo.png",
  "logo-glow.png",
  "react-logo.png",
  "react-logo@2x.png",
  "react-logo@3x.png",
  "tutorial-web.png",
  "tabIcons",
];

const indexContent = `import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      await fs.promises.mkdir(path.join(exampleDirPath, "assets/images"), { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Move demo assets to /example or delete them
    for (const asset of exampleAssets) {
      const assetPath = path.join(root, "assets/images", asset);
      if (fs.existsSync(assetPath)) {
        if (userInput === "y") {
          const newAssetPath = path.join(exampleDirPath, "assets/images", asset);
          await fs.promises.rename(assetPath, newAssetPath);
          console.log(
            `➡️ /assets/images/${asset} moved to /${exampleDir}/assets/images/${asset}.`
          );
        } else {
          await fs.promises.rm(assetPath, { recursive: true, force: true });
          console.log(`❌ /assets/images/${asset} deleted.`);
        }
      }
    }

    // Create new /src/app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /src/app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 src/app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 src/app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit src/app/index.tsx to edit the main screen.\n3. Put all your application code in /src, only screens and layout files should be in /src/app.${
        userInput === "y"
          ? `\n4. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
ðŸ“„ ARCHIVO: skills-lock.json
================================================

{
  "version": 1,
  "skills": {
    "ask-matt": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/ask-matt/SKILL.md",
      "computedHash": "9eead017d1708983aea08e98edc915defe7bf23719ac053ca98ab53dc518bd52"
    },
    "chief-of-staff": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/chief-of-staff/SKILL.md",
      "computedHash": "f071b64619ecda4e800697487c0a84e5b2580bc7b1ce3ed23764e5d16cc28a1c"
    },
    "claude-handoff": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/claude-handoff/SKILL.md",
      "computedHash": "7286edfcb9237c72b3bd96cdab1d6a515f529b25380923569924b96d2d265701"
    },
    "code-review": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/code-review/SKILL.md",
      "computedHash": "1846141c77eaada59e449d831720ac1fd3f99e5cb22c30ed42ea5e4d14bd3cda"
    },
    "codebase-design": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/codebase-design/SKILL.md",
      "computedHash": "fb1d8ab98ad151551eeade003e3ae55a46578a380fd9fc3ed4dbf9c2fbce0a9f"
    },
    "diagnosing-bugs": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/diagnosing-bugs/SKILL.md",
      "computedHash": "aec3686657177071076dc1586c22cdf95137c230bc74cbb5d069903d73804817"
    },
    "domain-modeling": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/domain-modeling/SKILL.md",
      "computedHash": "f377a1341e1b368833cfe5889ace3e61d7df48d7a9e5da9253dba75d062bbfbc"
    },
    "git-guardrails-claude-code": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/misc/git-guardrails-claude-code/SKILL.md",
      "computedHash": "fa22f1aa2708d95cc3149640f33e085381b184a0322609930f7971c1dca11835"
    },
    "grill-me": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/grill-me/SKILL.md",
      "computedHash": "5e0c683385eafd83f106ac6c9d67dfbbfe5aa4b3fe65aad114eb1055a99c818f"
    },
    "grill-with-docs": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/grill-with-docs/SKILL.md",
      "computedHash": "a610223c9796f755b603f15ec114849a4b38b9ba3006acfa9bdf3cc56dd44dad"
    },
    "grilling": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/grilling/SKILL.md",
      "computedHash": "c3b3e67f18495984385413bc6be7e2acbf2139c6cf52ef42abdda7242a791822"
    },
    "handoff": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/handoff/SKILL.md",
      "computedHash": "00e2d31992d62490083ed2fa2fc2a4418362f765875a59e7a3dc52836f826ab2"
    },
    "implement": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/implement/SKILL.md",
      "computedHash": "141e77647388ad7d716a8f992b604872df0cbf6cdfbc8fa2a02cbc9fe67160fc"
    },
    "implement-spec": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/implement-spec/SKILL.md",
      "computedHash": "4b91b5634b1a89a8b2ad44f8e7a320f778d05f6bd978d93076b6e89d7adfe9d8"
    },
    "improve-codebase-architecture": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/improve-codebase-architecture/SKILL.md",
      "computedHash": "f74b0bf1be26220dd615523fc1c0562567f9c463d9e9b255d4031345ffb37cd3"
    },
    "loop-me": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/loop-me/SKILL.md",
      "computedHash": "d7fbcf41b5af203a6f2a7937afaaaebdd9941b0aa4cc3654b52daec01d3fb564"
    },
    "migrate-to-shoehorn": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/misc/migrate-to-shoehorn/SKILL.md",
      "computedHash": "7d31e494a384d1a5b88d1dec6e1f50e673ef1a60f7b0b6e92babfbb242f79b62"
    },
    "pr": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/pr/SKILL.md",
      "computedHash": "e6e63bada1f038e0b5488f8b62f77ebbd36c97669ddc5afaffcd17f974709f9a"
    },
    "prototype": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/prototype/SKILL.md",
      "computedHash": "62979fe039ef64407b258f8824db41b9185f788638747df803032df4153c2aae"
    },
    "research": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/research/SKILL.md",
      "computedHash": "2c8b768d5f0309eaea9f92ef740101e813645b39aef88fb82733a52eae23dc0b"
    },
    "retro": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/retro/SKILL.md",
      "computedHash": "e63bb774fba4e601edfffc56bbd5c938d76c8faa2dff49456dff3b1e679cd3b6"
    },
    "scaffold-exercises": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/misc/scaffold-exercises/SKILL.md",
      "computedHash": "0f8154a7be9fc5ebe6ae0550d520259fadfdd512c166cb7f137f8e697aae4017"
    },
    "setup-matt-pocock-skills": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/setup-matt-pocock-skills/SKILL.md",
      "computedHash": "1114faf86d8658d6b3c729e7e604fbfecdee3fa112f23c4889463e87da662aec"
    },
    "setup-pre-commit": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/misc/setup-pre-commit/SKILL.md",
      "computedHash": "4ae1ad6988eb61dbc600627bc12e061215d96ced504632d00f0d9de5905eadfa"
    },
    "setup-ts-deep-modules": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/setup-ts-deep-modules/SKILL.md",
      "computedHash": "0b0e7124ad1272d59e44bcb4224275e76421351294a91480ada62234158c1023"
    },
    "tdd": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/tdd/SKILL.md",
      "computedHash": "535d1a6f3bd5bded8971e7e4ea76538907cbff6b6d32c39cf97b669869dcd383"
    },
    "teach": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/teach/SKILL.md",
      "computedHash": "6e029f9d1d5acdc2e79e745f86424c218180b7b4c6a7c660e32c4802db12d6cf"
    },
    "to-questionnaire": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/to-questionnaire/SKILL.md",
      "computedHash": "e2cb00bfeb4243f1384bf7e106185ccb69fd7d45ff6a3b04bec4102f505aba31"
    },
    "to-spec": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/to-spec/SKILL.md",
      "computedHash": "0ee8caf20fc7df94db53e76f42588fb01eee88c6f8dc97e7a3a0565be8978e74"
    },
    "to-tickets": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/to-tickets/SKILL.md",
      "computedHash": "f7d1bca83f85e4880eec5ed4fe0bff5b8ad1ba14f1e0b17dd0f6d9235a461ec4"
    },
    "triage": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/triage/SKILL.md",
      "computedHash": "453a7a098edcbec2a6ef67f8aa6720433672ebdf93023c90cefa79f160c72599"
    },
    "wait-what": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/wait-what/SKILL.md",
      "computedHash": "b4f3760a199cbd6415e4c885de230bef4eecba563791de211a92d335e16a9cb0"
    },
    "wayfinder": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/wayfinder/SKILL.md",
      "computedHash": "1160b9561238f91ba9eb6bb655eb7e3eb4cc571ffcc5477b9d45095a4cca40bf"
    },
    "wizard": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/engineering/wizard/SKILL.md",
      "computedHash": "c8fffad2f165f6c34e415ee291f9f8a9f1ef8cdea1b15b4f0034f615f49d8827"
    },
    "writing-beats": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/writing-beats/SKILL.md",
      "computedHash": "1d1c32479fa0774738c7baf264026e937f4a75ef7c20bd6c1b585681cadb523c"
    },
    "writing-for-agents": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/productivity/writing-for-agents/SKILL.md",
      "computedHash": "831e996c177c6c5233eb3bb472a33edee2b3ce1ee5a6d7e8b696c1c3fb4eda3d"
    },
    "writing-fragments": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/writing-fragments/SKILL.md",
      "computedHash": "e97c829457cb9119aa6a636b989b3c3e273e55c9bcf27b6d281d8132e04ca972"
    },
    "writing-shape": {
      "source": "mattpocock/skills",
      "sourceType": "github",
      "skillPath": "skills/in-progress/writing-shape/SKILL.md",
      "computedHash": "175889218686932bda7724425b97a0a10a7679db51447c40a1a0d3a5e6f2130e"
    }
  }
}


================================================
ðŸ“„ ARCHIVO: specs\001-incio-control-sesion\decisiones.md
================================================

# Decisiones - HU-001: Iniciar y controlar una sesión de estudio

## 1. Comportamiento al terminar la sesión

**Pregunta:** ¿Qué debería ocurrir cuando termina el tiempo de estudio?

**Respuesta:** El temporizador se detiene en `00:00`, indica que terminó la sesión y deja que el estudiante inicie la siguiente fase.

**Motivo:** La fase siguiente no debe comenzar automáticamente; el estudiante decide cuándo iniciarla, de acuerdo con la constitución del proyecto.

## 2. Aviso cuando la app no está visible

**Pregunta:** Si el temporizador llega a `00:00` en segundo plano o con la app cerrada, ¿cómo debería avisar al estudiante?

**Respuesta:** Mostrar una notificación. El sonido y/o la vibración dependen de los permisos y ajustes del sistema.

**Motivo:** El estudiante debe poder enterarse de que terminó la fase, respetando los permisos y preferencias configurados en Android.

## 3. Cerrar la app mientras el temporizador corre

**Pregunta:** Si el estudiante cierra la app mientras el temporizador corre y la abre después, ¿debe continuar con el tiempo realmente transcurrido o volver al estado anterior al cierre?

**Respuesta:** La cuenta continúa considerando el tiempo realmente transcurrido. Si ya venció, se muestra la sesión terminada.

**Motivo:** La constitución requiere que el tiempo restante refleje el tiempo realmente transcurrido aunque la app deje de ejecutarse temporalmente.

## 4. Reiniciar después de terminar

**Pregunta:** Una vez que la sesión llegó a `00:00`, ¿debería permitirse reiniciar el temporizador de estudio o la sesión debe quedarse terminada hasta iniciar la siguiente fase?

**Respuesta:** La sesión queda terminada; se pasa a la siguiente fase solo cuando el estudiante decide iniciarla.

**Motivo:** Mantiene la decisión del estudiante y evita repetir o iniciar fases sin una acción explícita.

## 5. Permiso de notificaciones denegado

**Pregunta:** Si el estudiante no concede permiso para las notificaciones, ¿la app debería seguir el temporizador o impedir iniciar la sesión?

**Respuesta:** Se permite iniciar y completar la sesión normalmente. Al volver a la app, se muestra que terminó, sin exigir el permiso para usar el temporizador.

**Motivo:** El permiso de notificaciones no debe bloquear la función principal del temporizador.

## 6. Cerrar la app mientras el temporizador está pausado

**Pregunta:** Si el estudiante pausa el temporizador y cierra la app, ¿al volver debe seguir pausado con el mismo tiempo restante?

**Respuesta:** Sí. El tiempo queda en pausa y la cuenta continúa cuando el estudiante la reanuda.

**Motivo:** Respeta la pausa elegida por el estudiante y evita que el tiempo avance mientras la sesión está pausada.


================================================
ðŸ“„ ARCHIVO: specs\001-incio-control-sesion\plan.md
================================================

# Plan de la historia 001 - Inicio y control de sesión

## 1. Archivos y responsabilidades

- src/domain/session.ts
  - Lógica pura del temporizador: estado activo/pausado/terminado, duración de estudio, tiempo restante, control de inicio, pausa, reanudación, reinicio y fin de fase.
  - Cubre RF-1 a RF-7.

- src/domain/session.test.ts
  - Pruebas unitarias del algoritmo de cuenta regresiva y del manejo de estados transitorios.
  - Cubre RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7.

- src/storage/session-storage.ts
  - Persistencia local del estado de la sesión para conservar el progreso cuando la app pasa a segundo plano o se cierra.
  - Cubre RF-6 y RF-7.

- src/storage/session-storage.test.ts
  - Pruebas de guardado y recuperación del estado; valida que el flujo de pausa y reanudación no borre el progreso.
  - Cubre RF-6 y RF-7.

- src/app/index.tsx
  - Pantalla principal para iniciar, pausar, reanudar, reiniciar y visualizar el estado actual del temporizador.
  - Cubre RF-1 a RF-9 desde la experiencia del usuario.

- src/components/session-controls.tsx (o componente equivalente)
  - Botones y mensajes de estado para la sesión: iniciar, pausar, reanudar, reiniciar y notificación final.
  - Cubre RF-1 a RF-9 en la interfaz.

## 2. Funciones puras de lógica

La lógica debe mantenerse separada del render para poder probarla sin depender de React o de AsyncStorage.

- createSession(config): crea el estado inicial de una sesión de estudio.
- startSession(session, now): activa la cuenta regresiva desde el instante actual.
- pauseSession(session, now): congela el tiempo restante y guarda el momento de pausa.
- resumeSession(session, now): reanuda la cuenta sin perder el tiempo ya acumulado.
- resetSession(session, confirm): devuelve la fase al estado inicial si confirma; si no, conserva la sesión actual.
- advanceSession(session, now): calcula el tiempo realmente transcurrido y actualiza el estado de la sesión.
- finishSession(session): marca la fase como terminada y deja preparada la siguiente fase sin iniciarla.
- getRemainingTime(session, now): calcula el tiempo restante en milisegundos y lo expresa en minutos y segundos.
- shouldShowCompleted(session): evalúa si la sesión ya venció y debe mostrarse como terminada.

Estas funciones deberán operar sobre un estado estructurado con campos como:

- durationMs
- remainingMs
- isRunning
- isPaused
- isCompleted
- startedAt
- lastUpdatedAt
- lastPausedAt
- totalPausedMs
- lastNotifiedAt

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7.

## 3. Persistencia

Se usará almacenamiento local con AsyncStorage para guardar una instantánea del estado de la sesión y del instante de última actualización.

- El estado persistido debe incluir la duración base, el tiempo restante, el estado actual y el momento del último cambio relevante.
- Cuando la app vuelve a abrirse, se recalcula el tiempo transcurrido real con la diferencia entre el tiempo actual y el último registro guardado.
- Si la sesión estaba en marcha, se reconstituyen los segundos transcurridos desde el último checkpoint.
- Si la sesión estaba pausada, se conserva exactamente el tiempo restante sin avanzar.
- Las notificaciones no deben bloquear la ejecución principal; si no hay permiso, la sesión continúa y, al volver a la app, se informa que terminó si corresponde.

RF cubierto: RF-6, RF-7, RF-8, RF-9.

## 4. Algoritmo en pseudocódigo

```text
function syncSessionState(session, now):
  if session.isCompleted:
    return session

  if session.isRunning:
    elapsed = now - session.lastUpdatedAt
    session.remainingMs = max(0, session.remainingMs - elapsed)
    session.lastUpdatedAt = now

    if session.remainingMs == 0:
      session.isRunning = false
      session.isCompleted = true
      session.completedAt = now
      persist(session)
      return session

  persist(session)
  return session

function pauseSession(session, now):
  if session.isRunning:
    session.isRunning = false
    session.isPaused = true
    session.lastPausedAt = now
    persist(session)

function resumeSession(session, now):
  if session.isPaused:
    session.isPaused = false
    session.isRunning = true
    session.lastUpdatedAt = now
    persist(session)

function resetSession(session, confirmed):
  if confirmed:
    session.remainingMs = session.durationMs
    session.isRunning = false
    session.isPaused = false
    session.isCompleted = false
    session.lastUpdatedAt = now
    persist(session)

function finishSession(session):
  session.isCompleted = true
  session.isRunning = false
  session.isPaused = false
  session.remainingMs = 0
  persist(session)
```

La clave técnica es no confiar solo en el valor visual del reloj, sino que el sistema debe calcular el tiempo real transcurrido con marcas temporales. Esto evita que el estado se vuelva incorrecto cuando la app pasa a segundo plano o se cierra.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7.

## 5. Cómo se pinta en la interfaz

- La pantalla principal muestra el tiempo restante de la fase actual como mm:ss.
- El estado visible debe indicar claramente si la sesión está en curso, en pausa o terminada.
- Los botones deben permitir iniciar, pausar, reanudar, reiniciar y confirmar el reinicio antes de aplicar el cambio.
- Cuando la cuenta llega a 00:00, la interface debe mostrar que la sesión terminó y dejar preparada la siguiente fase sin activarla automáticamente.
- Si la app vuelve a la vista después de una sesión completada en segundo plano, la pantalla debe reflejar ese estado inmediatamente.
- En la pantalla se debe gestionar la ausencia de permiso de notificaciones sin bloquear la sesión; el usuario recibe la información cuando regresa a la app.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-8, RF-9.

## 6. Decisiones técnicas justificadas

### Decisión 1: almacenamiento basado en tiempo real y no solo en valor visual

- Se persistirá el tiempo real transcurrido y el último instante conocido, no solo el valor visible del temporizador.
- Justificación: la constitución exige precisión ante segundo plano y cierre, y la spec lo exige para RF-6 y RF-7.
- Alternativa descartada: guardar únicamente `remainingMs` cada vez que se renderiza. Eso produce desfases al volver a la app y no refleja el tiempo realmente transcurrido.

### Decisión 2: notificaciones como aviso complementario, no como bloqueo funcional

- La sesión debe seguir funcionando si no se concede permiso de notificaciones.
- Justificación: RF-8 dice que la sesión continúa normalmente y solo informa al volver a la app.
- Alternativa descartada: impedir iniciar la sesión si el permiso se niega. Eso contradice la historia y la constitución.

### Decisión 3: manejar la finalización sin iniciar automáticamente la fase siguiente

- El sistema se detiene en 00:00 y deja la siguiente fase preparada, sin activarla.
- Justificación: esto respeta la decisión de la historia y la decisión 1 registrada.
- Alternativa descartada: lanzar la siguiente fase de forma automática. Eso rompe la regla de no iniciar una nueva cuenta sin decisión del estudiante.

## 7. Estrategia de pruebas con Jest

1. Pruebas unitarias puras sobre la lógica:
   - iniciar la sesión desde una duración base y verificar 00:00 al completar.
   - pausar y reanudar sin perder el tiempo restante.
   - reiniciar con confirmación y cancelar el reinicio.
   - mantener el tiempo real transcurrido al simular segundo plano mediante diferencias de timestamps.

2. Pruebas de persistencia:
   - guardar el estado completo y recuperarlo al volver a la app.
   - conservar la sesión pausada sin avanzar el reloj durante la pausa.
   - no perder el estado cuando la sesión hay finalizado en segundo plano.

3. Pruebas de integración mínima de interfaz:
   - verificar que la pantalla renderiza `mm:ss` correcto.
   - verificar los mensajes de estado y los botones según la fase activa.
   - comprobar que al terminar la sesión el botón de iniciar la siguiente fase no se dispara automáticamente.

Se priorizarán pruebas de lógica pura, porque son la base de la precisión y la continuidad del temporizador. La interfaz se validará con comprobación manual en Expo Go, siguiendo la checklist del proyecto.

## 8. Criterios de cobertura por requisito

- RF-1: lógica de inicio + vista del tiempo restante.
- RF-2: lógica de pausa/reanudación + controles de interfaz.
- RF-3: lógica de reinicio con confirmación.
- RF-4: cancelación del reinicio y conservación del estado.
- RF-5: finalización en 00:00 y preparación de la fase siguiente.
- RF-6: cálculo del tiempo real transcurrido al reabrir la app.
- RF-7: mantenimiento del estado pausado al cerrar la app.
- RF-8: comportamiento sin permiso de notificaciones.
- RF-9: notificación al volver a la app si la sesión terminó en segundo plano.


================================================
ðŸ“„ ARCHIVO: specs\001-incio-control-sesion\spec.md
================================================

# Spec 001 - Inicio y control de sesión

Estado: aprobada

HU de origen: docs/historias/HU-001.md

## Contexto y objetivo

La aplicación debe permitir a un estudiante iniciar una sesión de estudio y controlar su progreso con precisión. La sesión debe poder iniciarse, pausarse, reanudarse, reiniciarse y terminar sin perder la referencia del tiempo real transcurrido ni forzar decisiones no solicitadas por el estudiante.

## Usuarios

- Estudiante que quiere concentrarse en una sesión de estudio con un temporizador claro y controlado.

## Historias de usuario

- Como estudiante, quiero iniciar un temporizador de estudio para comenzar una sesión con el tiempo configurado.
- Como estudiante, quiero pausar y reanudar la sesión para mantener el control del tiempo sin perder el progreso.
- Como estudiante, quiero reiniciar la sesión para volver al tiempo inicial de la fase actual, con opción a cancelar.
- Como estudiante, quiero que la aplicación conserve el tiempo real transcurrido si la sesión continúa mientras la app está en segundo plano o cerrada.

## Definiciones

- Fase de estudio: periodo de tiempo asignado a la sesión de estudio actual, con un tiempo inicial configurado.
- Tiempo restante: cantidad de tiempo que falta para llegar a 00:00 en la fase activa.
- Sesión terminada: estado en el que la cuenta regresiva ha llegado a 00:00 y el sistema queda detenido hasta que el estudiante decida iniciar la siguiente fase.

## Requisitos funcionales

RF-1: CUANDO el estudiante inicia la sesión desde la pantalla principal, EL SISTEMA comienza la cuenta regresiva con el tiempo de estudio configurado y muestra el tiempo restante en minutos y segundos. Origen: Escenario: Iniciar el temporizador.

RF-2: CUANDO la sesión está en curso, EL SISTEMA permite pausarla y, si el estudiante la reanuda, continúa desde el instante en que fue pausada. Origen: Escenario: Pausar y continuar.

RF-3: CUANDO el estudiante confirma reiniciar la sesión, EL SISTEMA devuelve el temporizador al tiempo inicial de la fase actual y deja la cuenta lista para iniciar de nuevo. Origen: Escenario: Reiniciar el temporizador.

RF-4: CUANDO el estudiante cancela la acción de reinicio, EL SISTEMA conserva el tiempo restante actual y no altera el estado visible ni el progreso de la sesión. Origen: Escenario: Cambiar de opinión al reiniciar.

RF-5: CUANDO la fase de estudio llega a 00:00, EL SISTEMA se detiene, indica que terminó la sesión y deja preparada la siguiente fase sin iniciarla automáticamente. Origen: Decisión 1.

RF-6: CUANDO la aplicación pasa a segundo plano o se cierra mientras la sesión está en curso, EL SISTEMA conserva el tiempo realmente transcurrido y, si el plazo ya venció, muestra que la sesión terminó al volver a la aplicación. Origen: Decisiones 3 y 4.

RF-7: CUANDO la aplicación pasa a segundo plano o se cierra mientras la sesión está pausada, EL SISTEMA conserva el tiempo restante y mantiene la sesión pausada hasta que el estudiante la reanude. Origen: Decisión 6.

RF-8: CUANDO el estudiante no concede permiso de notificaciones, EL SISTEMA permite iniciar y completar la sesión normalmente, y al regresar a la aplicación informa que terminó si corresponde. Origen: Decisión 5.

RF-9: CUANDO la sesión termina mientras la aplicación no está visible, EL SISTEMA emite una notificación que informa que la fase terminó. Origen: Decisión 2.

## Requisitos no funcionales

- No se definen requisitos no funcionales adicionales específicos para esta historia más allá de la precisión del tiempo, la continuidad del estado y la disponibilidad del temporizador sin depender de conexión o registro.

## Casos límite

- La sesión llega exactamente a 00:00 sin que el estudiante haya realizado ninguna acción adicional.
- La aplicación se cierra mientras el temporizador está corriendo.
- La aplicación se cierra mientras el temporizador está pausado.
- El estudiante cancela el reinicio en lugar de confirmarlo.
- El estudiante niega el permiso de notificaciones y la sesión termina en segundo plano.

## Fuera de alcance

- Iniciar automáticamente la siguiente fase después de que termine la de estudio.
- Definir la lógica de configuraciones avanzadas del temporizador, fuera de la fase actual.
- Introducir nuevas reglas de negocio no contempladas por la historia ni por las decisiones registradas.

## Criterios de finalización

- La sesión puede iniciarse, pausarse, reanudarse y reiniciarse sin perder el tiempo restante actual cuando se cancela el reinicio.
- La cuenta regresiva refleja el tiempo realmente transcurrido incluso si la aplicación pasa a segundo plano o se cierra.
- La sesión se detiene en 00:00 y queda preparada para la siguiente fase sin iniciarla automáticamente.
- El estudiante recibe una notificación cuando la sesión termina y la aplicación no está visible, salvo restricciones del sistema que impidan mostrarla.
- El temporizador sigue funcionando aunque el permiso de notificaciones esté denegado.

## Dudas abiertas

- No hay dudas abiertas para esta historia; los escenarios y decisiones establecen el comportamiento esperado.


================================================
ðŸ“„ ARCHIVO: specs\001-incio-control-sesion\tasks.md
================================================

# Tareas de la historia 001 - Inicio y control de sesión

- [x] **T1. Definir el modelo de sesión y el flujo de estados base.** RF-1, RF-2, RF-5
  - Hecho cuando: el modelo de sesión contempla `durationMs`, `remainingMs`, `isRunning`, `isPaused`, `isCompleted`, `lastUpdatedAt` y el flujo de inicio/fin queda documentado y verificable con pruebas de lógica.

- [x] **T2. Implementar la lógica de inicio y cuenta regresiva exacta.** RF-1, RF-5, RF-6
  - Hecho cuando: la prueba de lógica demuestra que una sesión inicia con la duración base y llega a 00:00 sin iniciar la siguiente fase automáticamente.

- [x] **T3. Implementar pausa y reanudación sin perder progreso.** RF-2, RF-7
  - Hecho cuando: la prueba de lógica confirma que pausar y reanudar conserva el tiempo restante exacto y no avanza mientras la sesión está pausada.

- [x] **T4. Implementar reinicio con confirmación y cancelación.** RF-3, RF-4
  - Hecho cuando: las pruebas cubren ambos caminos y verifican que la cancelación conserva el estado actual y la confirmación regresa a la duración inicial.

- [x] **T5. Persistir el estado de la sesión para segundo plano y cierre.** RF-6, RF-7
  - Hecho cuando: la prueba de persistencia demuestra que el estado se guarda y recupera consistentemente, y que la cuenta se reanuda con el tiempo realmente transcurrido.

- [x] **T6. Gestionar la terminación y la información al volver a la app.** RF-5, RF-8, RF-9
  - Hecho cuando: la lógica evalúa la sesión como terminada al llegar a 00:00 y la pantalla informa al usuario sin bloquear la funcionalidad si no hay permiso de notificaciones.

- [x] **T7. Construir la vista principal de la sesión.** RF-1, RF-2, RF-3, RF-4, RF-5
  - Hecho cuando: la pantalla muestra el tiempo restante en mm:ss, los estados visibles y los botones de inicio, pausa, reanudación y reinicio, y se prueba manualmente en Expo Go.

- [x] **T8. Validar la experiencia completa con la checklist manual.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9
  - Hecho cuando: se ejecuta la verificación manual siguiendo los puntos de la lista de rn-conventions: flujo de inicio, pausa, reanudación, reinicio cancelado, reinicio confirmado, segundo plano y cierre de app, y comportamiento sin permiso de notificaciones.
  - Verificación manual reportada: pasaron los puntos 1, 2, 3, 4, 5, 6, 8 y 9. El punto 7 (notificación con permiso concedido) queda pendiente de probar en el development build Android.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6
7. T7
8. T8

## Notas de implementación

- Las tareas de lógica deben verificarse con `npx jest`.
- Las tareas de interfaz deben verificarse con la lista manual de comprobación de la convención RN del proyecto antes de considerarlas cerradas.
- Si durante la implementación aparece una decisión que cambie el comportamiento del usuario y no esté reflejada en la spec, se debe detener el trabajo y pedir aclaración antes de continuar.


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\decisiones.md
================================================

# Decisiones - HU-002: Alternar entre estudio y descanso

## 1. Cuándo se cuenta una sesión de estudio

**Pregunta:** ¿En qué momento se considera completada una sesión de estudio?

**Respuesta:** Cuando termina el tiempo de estudio y también el descanso que le corresponde. Para las primeras tres sesiones, se cuenta al terminar el descanso corto; la cuarta se cuenta al terminar el descanso largo.

**Motivo:** El avance debe reflejar sesiones completas, incluyendo su tiempo de descanso.

## 2. Fase que sigue a cada sesión de estudio

**Pregunta:** ¿Qué fase debe quedar preparada cuando termina cada tiempo de estudio?

**Respuesta:** Después de las primeras tres sesiones de estudio queda preparado un descanso corto. Después de la cuarta queda preparado directamente un descanso largo. La fase preparada no empieza automáticamente.

**Motivo:** Respeta el ciclo de tres descansos cortos y uno largo, y la constitución establece que la siguiente fase no inicia su cuenta regresiva sin acción del estudiante.

## 3. Conservar el avance al cerrar la aplicación

**Pregunta:** ¿Debe conservarse el contador de pomodoros si se cierra la aplicación a mitad del ciclo?

**Respuesta:** Sí. El avance del ciclo no se borra al cerrar la aplicación.

**Motivo:** El cierre de la aplicación no debe hacer perder el avance acumulado.

## 4. Fase que termina con la aplicación cerrada

**Pregunta:** Si una fase termina mientras la aplicación está cerrada, ¿qué debe ocurrir al volver a abrirla?

**Respuesta:** La aplicación reconoce la finalización, actualiza el avance que corresponda y deja preparada la fase siguiente, sin iniciar otra cuenta regresiva automáticamente.

**Motivo:** El temporizador debe considerar el tiempo realmente transcurrido y mantener el comportamiento de inicio explícito de la siguiente fase.

## 5. Avance del contador durante los descansos cortos

**Pregunta:** ¿Cuándo debe aumentar el contador durante los tres primeros ciclos de estudio y descanso?

**Respuesta:** Aumenta al terminar cada descanso corto: marca 1, 2 y 3 al terminar el primer, segundo y tercer descanso corto, respectivamente.

**Motivo:** Cada una de esas sesiones se considera completada después de terminar su descanso.

## 6. Contador durante y después del descanso largo

**Pregunta:** ¿Qué valor debe mostrar el contador durante el descanso largo y qué ocurre al terminarlo?

**Respuesta:** Muestra 3 durante todo el descanso largo. Al terminarlo, vuelve a 0 para comenzar un nuevo ciclo de cuatro sesiones.

**Motivo:** Las cuatro sesiones se consideran completadas al terminar el descanso largo; entonces comienza el ciclo siguiente.


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\plan.md
================================================

# Plan de la historia 002 - Estudio y descanso

## Alcance

- Se planifican RF-1, RF-3, RF-4, RF-5, RF-6 y RF-7.
- Por indicación del usuario, RF-2 no se planifica como requisito independiente. La selección del descanso largo al terminar la sesión de estudio se toma de la Decisión 2; el comportamiento del contador durante y al terminar ese descanso se rige únicamente por RF-7 y la Decisión 6.
- Se conserva la regla de inicio explícito: preparar la fase siguiente no inicia su cuenta regresiva.
- La autorización del usuario permite ampliar retrocompatiblemente el registro de AsyncStorage con la fase y el contador. Los registros existentes sin esos campos se interpretan como una sesión de estudio con cero pomodoros completados.

## 1. Archivos y responsabilidades

- `src/domain/session.ts`
  - Ampliar el modelo de sesión para distinguir estudio, descanso corto y descanso largo, el estado preparado/en curso/en pausa y los pomodoros completados.
  - Mantener las transiciones y el cálculo del tiempo transcurrido como lógica pura. La duración de la fase preparada se toma de la configuración existente; se mantienen los valores predeterminados de la constitución si no hay otro valor configurado.
  - Cubre RF-1, RF-3, RF-4, RF-5, RF-6 y RF-7; la selección del descanso largo también sigue la Decisión 2.

- `src/domain/session.test.ts`
  - Probar límites del contador, elección de fase, preparación sin inicio automático, vencimiento mediante marcas de tiempo y transiciones de descansos.
  - Cubre RF-1, RF-3, RF-5, RF-6 y RF-7.

- `src/storage/session-storage.ts`
  - Persistir y restaurar la fase y el contador junto con el estado actual de la sesión.
  - Normalizar registros existentes que no tengan los nuevos campos y recalcular una sesión en curso al recuperarla.
  - Cubre RF-5, RF-6 y RF-7.

- `src/storage/session-storage.test.ts`
  - Verificar persistencia del ciclo, recuperación tras vencimiento en segundo plano/cierre y compatibilidad con registros previos.
  - Cubre RF-5, RF-6 y RF-7.

- `src/components/session-controls.tsx`
  - Conectar los controles actuales con el estado de fase preparado, iniciado y pausado; guardar los cambios de fase/contador y presentar el texto, imagen y contador correspondientes.
  - Mantener el inicio de la siguiente fase sujeto a la acción del estudiante. Adaptar el aviso de finalización existente para que identifique la fase que terminó.
  - Cubre RF-1, RF-3, RF-4, RF-5, RF-6 y RF-7.

- `src/app/index.tsx`
  - Sin cambios previstos: continúa delegando la pantalla principal a `SessionControls`.

## 2. Funciones puras de lógica

La lógica del ciclo permanecerá en `src/domain/session.ts`, sin dependencias de React ni AsyncStorage.

- `createSession(config)`: crea una sesión de estudio preparada con contador cero.
- `startSession(session, now)`: inicia explícitamente la fase que está preparada y registra el instante de inicio.
- `advanceSession(session, now)`: descuenta el tiempo real de la fase en curso; al llegar a cero prepara la fase siguiente y se detiene sin consumir tiempo de esa siguiente fase.
- `prepareNextPhase(session)`: decide la fase siguiente según la fase que terminó y el avance del ciclo; establece su duración completa y estado preparado.
- `resetSession(session, confirmed)`: conserva el comportamiento actual de reinicio con confirmación; el reinicio de la fase no altera por sí mismo el contador del ciclo.
- `getRemainingTime(session, now)`: conserva el cálculo del tiempo visible de la fase actual.

La configuración debe proporcionar las duraciones de estudio, descanso corto y descanso largo, además de la cantidad de pomodoros por ciclo. Se utilizarán los valores predeterminados de la constitución (25, 5 y 15 minutos; 4 pomodoros) si la aplicación aún no proporciona valores configurados. Esta historia no agrega una pantalla de configuración.

## 3. Persistencia

- Extender el objeto de sesión que ya guarda `session-storage.ts`; no crear una segunda clave de almacenamiento para el ciclo.
- Guardar la fase actual, el contador de pomodoros completados, el estado preparado/en curso/en pausa, la duración/tiempo restante de la fase y las marcas temporales necesarias para recalcular el tiempo real.
- Al leer registros anteriores sin fase ni contador, aplicar los valores compatibles autorizados: estudio y cero pomodoros completados.
- Si una fase en curso venció mientras la aplicación estaba cerrada o en segundo plano, recalcularla al restaurar y dejar preparada la fase que corresponde. No descontar el tiempo transcurrido de esa fase siguiente ni iniciarla automáticamente.
- Persistir las transiciones de fase y contador para que una nueva apertura no recupere el ciclo previo al vencimiento.

RF cubiertos: RF-5, RF-6 y RF-7. Decisiones relacionadas: 3, 4, 5 y 6.

## 4. Algoritmo en pseudocódigo

```text
function advanceSession(session, now):
	if session.status != "running":
		return session

	elapsed = max(0, now - session.lastUpdatedAt)
	remaining = max(0, session.remainingMs - elapsed)

	if remaining > 0:
		return session with remainingMs = remaining, lastUpdatedAt = now

	# Solo se completa la fase que estaba corriendo; no se inicia ni consume tiempo de la siguiente.
	completedPhase = session.phase
	next = prepareNextPhase(session, completedPhase)
	persist(next)
	return next

function prepareNextPhase(session, completedPhase):
	if completedPhase == "study":
		if session.pomodorosCompleted < session.pomodorosPerCycle - 1:
			nextPhase = "shortBreak"
		else:
			nextPhase = "longBreak"  # Decisión 2

	else if completedPhase == "shortBreak":
		pomodorosCompleted = session.pomodorosCompleted + 1  # Decisión 5
		nextPhase = "study"

	else:
		pomodorosCompleted = 0  # RF-7 y Decisión 6
		nextPhase = "study"

	return session with:
		phase = nextPhase
		remainingMs = durationFor(nextPhase)
		status = "prepared"
		lastUpdatedAt = null

function startSession(session, now):
	if session.status != "prepared":
		return session
	return session with status = "running", lastUpdatedAt = now
```

Durante todo el descanso largo, el contador conserva el valor 3; solo vuelve a cero al terminar ese descanso. El descanso largo queda preparado al terminar el cuarto estudio conforme a la Decisión 2, pero no empieza hasta que el estudiante lo inicia.

RF cubiertos: RF-1, RF-3, RF-5, RF-6 y RF-7. La selección de fase larga se basa en la Decisión 2, no en RF-2.

## 5. Cómo se pinta en la interfaz

- Mostrar el tiempo restante de la fase preparada o en curso con el formato `mm:ss` que ya usa la pantalla.
- Mostrar en español si la fase es estudio, descanso corto o descanso largo, junto con el número de pomodoros completados en el ciclo.
- En estado preparado, ofrecer el inicio explícito de esa fase; en curso y en pausa, conservar los controles actuales de pausa, reanudación y reinicio.
- Usar la imagen de estudio para estudio y la imagen de descanso para ambos descansos, conforme a `rn-conventions`.
- Al terminar una fase, actualizar la pantalla y el contador correspondiente, sin iniciar la cuenta regresiva siguiente.
- Mantener etiquetas accesibles y los estados legibles sin depender solo del color. El texto del aviso existente debe identificar la fase que terminó.

RF cubiertos: RF-1, RF-3, RF-4, RF-6 y RF-7.

## 6. Decisiones técnicas justificadas

### Decisión técnica 1: ampliar el modelo puro de sesión

- Separar fase, progreso del ciclo y estado preparado/en curso/en pausa en la lógica de dominio.
- Justificación: permite probar las transiciones sin depender de React y representa que una fase preparada no está corriendo (Constitución 3 y 7; RF-1 y RF-3).
- Alternativa descartada: elegir fase y modificar el contador directamente en `SessionControls`; mezclaría reglas del ciclo con renderizado y haría más difícil probar los límites.

### Decisión técnica 2: una sola instantánea persistida con compatibilidad

- Añadir fase y contador al objeto de sesión ya persistido, y asignar valores iniciales a registros antiguos sin esos campos.
- Justificación: el estado de temporizador y ciclo se restaura de forma conjunta y el usuario autorizó esta ampliación para cubrir RF-5.
- Alternativa descartada: una clave independiente para el ciclo, porque permitiría recuperar fase y temporizador de instantes distintos.

### Decisión técnica 3: marcas temporales para recuperar vencimientos

- Reutilizar el cálculo por tiempo transcurrido y marcas temporales existente al restaurar una fase activa.
- Justificación: refleja el tiempo real tras segundo plano/cierre y respeta la Constitución 6 y las Decisiones 3 y 4.
- Alternativa descartada: descontar únicamente los intervalos observados mientras React está activo, porque se perdería tiempo durante suspensión o cierre.

### Decisión técnica 4: preparar, no encadenar, la fase siguiente

- Al vencer una fase, dejar la siguiente con duración completa y estado preparado; exigir una acción del estudiante para iniciarla.
- Justificación: respeta la definición de fase preparada, RF-1/RF-3 y la Constitución 7.
- Alternativa descartada: trasladar el exceso de tiempo vencido a la fase siguiente, porque implicaría que esta empezó automáticamente.

## 7. Estrategia de pruebas con Jest

- Lógica pura: iniciar la fase preparada; terminar estudio antes y al umbral del descanso largo; preparar descanso corto/largo; verificar que la fase siguiente no corre hasta iniciarse explícitamente.
- Contador: comprobar que aumenta solo al terminar cada descanso corto, permanece en 3 durante el descanso largo y vuelve a 0 cuando este termina.
- Tiempo real: simular con marcas temporales el vencimiento en segundo plano/cierre; comprobar que solo se prepara la fase siguiente y no se consume su duración.
- Persistencia: guardar/restaurar fase, contador y estado temporal; normalizar un registro antiguo sin los nuevos campos; cubrir sesión pausada y fase activa recuperada.
- Interfaz: las transiciones y texto/imagen/contador se comprobarán manualmente en Expo Go según la lista de `rn-conventions`; no se agrega una dependencia de pruebas de UI.

## 8. Cobertura por requisito

- RF-1: `session.ts`, `session.test.ts`, `session-controls.tsx`; prepara descanso corto sin iniciarlo.
- RF-2: excluido del plan por indicación del usuario. Para la selección del descanso largo se sigue la Decisión 2; para el contador en y después del descanso largo se sigue RF-7 y la Decisión 6.
- RF-3: `session.ts`, `session.test.ts`, `session-controls.tsx`; prepara estudio tras cualquier descanso y espera la acción del estudiante.
- RF-4: `session-controls.tsx`; muestra fase y pomodoros completados.
- RF-5: `session-storage.ts`, `session-storage.test.ts`, `session-controls.tsx`; restaura el vencimiento y conserva la siguiente fase preparada.
- RF-6: `session.ts`, pruebas de dominio/persistencia y `session-controls.tsx`; aumenta y muestra el contador tras descanso corto.
- RF-7: `session.ts`, pruebas de dominio/persistencia y `session-controls.tsx`; conserva 3 durante descanso largo y reinicia el contador al terminarlo.


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\spec.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\002-estudio-descanso\tasks.md
================================================

# Tareas de la historia 002 - Estudio y descanso

- [x] **T1. Extender el modelo de sesión y sus estados. (25 min)** RF-1, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: las pruebas de `src/domain/session.test.ts` verifican las fases, el estado preparado/en curso/en pausa, el contador inicial en cero y el inicio explícito de una fase preparada; `npx jest src/domain/session.test.ts` pasa.

- [x] **T2. Implementar las transiciones al terminar estudio. (25 min)** RF-1, RF-7
  - Hecho cuando: pruebas de dominio demuestran que antes del umbral se prepara descanso corto, al umbral se prepara descanso largo según la Decisión 2, y en ninguno de los casos comienza automáticamente la cuenta regresiva siguiente; `npx jest src/domain/session.test.ts` pasa.

- [x] **T3. Implementar el conteo al terminar los descansos. (25 min)** RF-3, RF-6, RF-7
  - Hecho cuando: pruebas de dominio confirman que un descanso corto incrementa el contador y prepara estudio, mientras el descanso largo mantiene 3 durante toda su duración y lo restablece a cero solo al terminar; `npx jest src/domain/session.test.ts` pasa.

- [x] **T4. Persistir y restaurar el ciclo retrocompatiblemente. (25 min)** RF-5, RF-6, RF-7
  - Hecho cuando: las pruebas de `src/storage/session-storage.test.ts` verifican la persistencia de fase/contador, la normalización de un registro anterior sin esos campos y la preparación correcta tras recuperar una fase vencida; `npx jest src/storage/session-storage.test.ts` pasa.

- [x] **T5. Conectar controles y guardado de transiciones. (25 min)** RF-1, RF-3, RF-5, RF-6, RF-7
  - Hecho cuando: iniciar, pausar, reanudar y restaurar actúan sobre la fase actual; las transiciones de fase/progreso quedan guardadas y el vencimiento no inicia otra cuenta regresiva; `npx jest` pasa.

- [x] **T6. Mostrar fase, contador e imágenes correspondientes. (25 min)** RF-1, RF-3, RF-4, RF-6, RF-7
  - Hecho cuando: la pantalla muestra el nombre de fase y el contador correcto, utiliza la imagen correspondiente y ofrece iniciar la fase preparada con controles accesibles; se verifica manualmente en Expo Go.

- [x] **T7. Validar ciclo y recuperación en Expo Go. (25 min)** RF-1, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: se completa la lista manual de `rn-conventions`: orientación vertical y giro, contraste/legibilidad, fuente, imágenes inicial/estudio/descanso, controles táctiles y etiquetas accesibles, cierre y recuperación del ciclo, y comprensión de estados sin depender del color; se comprueba además 3 durante descanso largo, 0 al terminar y que ninguna fase siguiente se inicia sola.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6
7. T7

Las tareas de lógica y persistencia se comprueban con Jest. Las tareas de interfaz y el flujo completo requieren verificación manual en Expo Go. RF-2 queda excluido de este plan por indicación del usuario; la selección del descanso largo se sustenta en la Decisión 2 y el contador se rige por RF-7.


================================================
ðŸ“„ ARCHIVO: specs\003-conteo-appcerrada-bloqueada\decisiones.md
================================================

# Decisiones - HU-003: Mantener el conteo con el celular bloqueado o la app cerrada

## 1. Contenido y acción del aviso de finalización

**Pregunta:** ¿Qué debe indicar el aviso cuando una fase termina con la aplicación cerrada y qué debe ocurrir al tocarlo?

**Respuesta:** El aviso identifica la fase que terminó. Al tocarlo, abre la aplicación y muestra la sesión como terminada.

**Motivo:** El estudiante puede reconocer qué finalizó y acceder directamente al estado actualizado de la sesión.

## 2. Finalización sin permiso de notificaciones

**Pregunta:** ¿Qué ocurre si Android no concede permiso para mostrar notificaciones?

**Respuesta:** El temporizador continúa funcionando. Al volver a abrir la aplicación, la fase aparece terminada, aunque no se haya podido mostrar el aviso.

**Motivo:** La recuperación de la sesión no debe depender del permiso de notificaciones.

## 3. Sonido y vibración del aviso

**Pregunta:** ¿Cómo debe comportarse el aviso respecto al sonido y la vibración?

**Respuesta:** Debe respetar las configuraciones del celular: reproducir sonido y vibrar, usar solo vibración o mostrar únicamente la notificación.

**Motivo:** El comportamiento del aviso debe ajustarse a las preferencias del estudiante en el dispositivo.

## 4. Momento de solicitar el permiso

**Pregunta:** ¿Cuándo debe solicitarse el permiso de notificaciones?

**Respuesta:** Se solicita al iniciar el temporizador por primera vez, explicando que permite recibir avisos cuando termina una fase. En los ciclos posteriores no se vuelve a solicitar el permiso del sistema si ya fue concedido.

**Motivo:** El estudiante conoce el propósito de la solicitud y no recibe solicitudes repetidas después de conceder el permiso.

## 5. Permiso aún denegado en ciclos posteriores

**Pregunta:** Si el permiso sigue denegado en ciclos posteriores, ¿debe repetirse la solicitud del sistema o mostrarse una explicación de la aplicación?

**Respuesta:** La aplicación puede volver a explicar cómo habilitar las notificaciones al comenzar un ciclo, pero no debe repetir la solicitud del sistema.

**Motivo:** Se informa al estudiante de la limitación sin insistir con una solicitud que Android ya resolvió.

## 6. Permanencia del aviso

**Pregunta:** ¿Cuánto tiempo debe permanecer el aviso en las notificaciones de Android?

**Respuesta:** Permanece hasta que el estudiante lo toque o lo descarte.

**Motivo:** El estudiante puede consultar el aviso aunque no lo haya visto cuando apareció.

## 7. Aviso al bloquear el celular o dejar la aplicación en segundo plano

**Pregunta:** ¿Debe aparecer el aviso de finalización si el celular está bloqueado o la aplicación está en segundo plano, aunque no se haya cerrado?

**Respuesta:** Sí. El aviso aparece cuando termina una fase activa, incluso si el celular está bloqueado o la aplicación permanece en segundo plano.

**Motivo:** El aviso depende de la finalización de la fase, no de que la aplicación haya sido cerrada.

## Decisiones relacionadas

La recuperación de una fase terminada con la aplicación cerrada, la preparación de la fase siguiente sin iniciarla automáticamente y la conservación del avance del ciclo siguen las decisiones 3 y 4 de [HU-002](../002-estudio-descanso/decisiones.md).

## 8. Aviso según la configuración de sonido del celular

**Pregunta:** ¿Qué combinación de sonido, vibración y notificación debe presentarse al terminar una fase mientras la aplicación está en segundo plano o el celular está bloqueado?

**Respuesta:** Si el celular tiene el sonido activado, el aviso incluye sonido, vibración y notificación. Si solo tiene la vibración activada, incluye vibración y notificación. Si el celular está en silencio, muestra únicamente la notificación.

**Motivo:** El aviso debe respetar el modo de sonido configurado en el celular y comunicar la finalización de la fase.

## 9. Significado de «ciclos posteriores» para los permisos

**Pregunta:** ¿Qué se entiende por «ciclos posteriores» en las reglas para solicitar el permiso de notificaciones?

**Respuesta:** Un ciclo completo de pomodoros comprende cuatro sesiones de estudio: las tres primeras se completan con un descanso corto cada una y la cuarta, con un descanso largo. «Ciclos posteriores» se refiere a cada ciclo completo siguiente, una vez finalizado el ciclo de cuatro sesiones.

**Motivo:** La solicitud y las explicaciones sobre el permiso siguen el ciclo de pomodoros definido en HU-002.


================================================
ðŸ“„ ARCHIVO: specs\003-conteo-appcerrada-bloqueada\plan.md
================================================

# Plan de la historia 003 - Conteo con el celular bloqueado o la app cerrada

## 1. Archivos y responsabilidades

- `src/domain/session.ts`
  - Mantener la lógica pura del temporizador en tiempo real: estados de sesión, marcas temporales, cálculo del tiempo transcurrido, finalización de fase y recuperación al volver a la app.
  - Cubre RF-1, RF-2, RF-3, RF-8, RF-10.

- `src/domain/session.test.ts`
  - Probar el cálculo exacto del tiempo restante al bloquear el celular y al reabrir la app, la finalización de la fase con la aplicación cerrada y la conservación de una sesión pausada.
  - Cubre RF-1, RF-2, RF-3, RF-8, RF-10.

- `src/storage/session-storage.ts`
  - Persistir el estado completo de la sesión, la marca temporal de última actualización y la señal de finalización para recuperarla con precisión después de segundo plano, cierre o bloqueo del celular.
  - Cubre RF-2, RF-3, RF-8, RF-10.

- `src/storage/session-storage.test.ts`
  - Verificar que al cerrar la aplicación se conserva el tiempo correcto, que una fase terminada se recupera y que una sesión pausada se mantiene pausada.
  - Cubre RF-2, RF-3, RF-8, RF-10.

- `src/app/index.tsx`
  - Renderizar el estado visible de la sesión recuperada al volver a la app, incluyendo fase terminada o tiempo restante correcto según el caso.
  - Cubre RF-1, RF-2, RF-3, RF-5, RF-8, RF-10.

- `src/components/session-controls.tsx`
  - Conectar la pantalla con el flujo de sesión, el aviso de finalización y la experiencia de usuario al tocar la notificación o volver a la app.
  - Cubre RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9, RF-10.

## 2. Funciones puras de lógica

La lógica debe vivir en `src/domain/session.ts` para poder probarse sin depender de React ni de `AsyncStorage`.

- `createSession(config)`: crea la sesión con duración base, tiempo restante, estado en curso o pausado y marca de última actualización.
- `startSession(session, now)`: activa la cuenta regresiva y marca el instante de inicio.
- `pauseSession(session, now)`: congela la sesión sin perder el tiempo acumulado.
- `resumeSession(session, now)`: reanuda la cuenta con una marca de tiempo nueva.
- `syncSessionState(session, now)`: calcula el tiempo real transcurrido desde la última actualización y descuenta el tiempo restante; si llega a cero, marca la fase como terminada y deja la siguiente preparada.
- `markPhaseCompleted(session, now)`: actualiza el estado a fase terminada y guarda la siguiente fase como preparada sin iniciar su cuenta automáticamente.
- `getRemainingTime(session, now)`: devuelve el tiempo restante visible en el formato adecuado para la UI.
- `shouldShowCompletionNotice(session, isBackgroundedOrLocked)`: evalúa si la finalización requiere un aviso visible o notificación.
- `shouldRequestNotificationPermission(permissionState, cycleState)`: aplica la regla de solicitud solo al inicio del primer ciclo y no vuelve a requerir el sistema si ya fue concedido o si el permiso sigue denegado en ciclos posteriores.

RF cubierto: RF-1, RF-2, RF-3, RF-8, RF-10. La lógica de avisos y permisos se cubre con la regla de presentación y el cálculo de estados visibles (`RF-4` a `RF-9`).

## 3. Persistencia

Se usará `AsyncStorage` para guardar una instantánea del estado de la sesión junto con la última marca temporal y la sesión finalizada o pausada.

- El estado persistido debe incluir la fase actual, el tiempo restante, el reloj de última actualización, el estado de ejecución, si está pausada o completada, y si la fase ya terminó en segundo plano.
- Cuando la app se reabre, se calcula el tiempo real transcurrido entre la última marca guardada y el `now` actual del sistema.
- Si la sesión estaba corriendo, se resta el tiempo transcurrido y se conserva la fase en curso o la fase terminada con la siguiente preparada.
- Si la sesión estaba pausada, se conserva sin avanzar ni generar un aviso de finalización por esa pausa.
- Si el permiso de notificaciones no se concedió, la sesión sigue funcionando y al volver a la app aparece la fase terminada aunque no exista aviso del sistema.

RF cubierto: RF-2, RF-3, RF-8, RF-10. La persistencia también sirve de base para `RF-4` a `RF-7` al permitir que la UI restablezca el estado correcto al reabrir la aplicación.

## 4. Algoritmo en pseudocódigo

```text
function syncSessionState(session, now):
  if session.isCompleted:
    return session

  if session.isRunning:
    elapsed = now - session.lastUpdatedAt
    session.remainingMs = max(0, session.remainingMs - elapsed)
    session.lastUpdatedAt = now

    if session.remainingMs == 0:
      session.isRunning = false
      session.isCompleted = true
      session.completedAt = now
      session.nextPhase = prepareNextPhase(session)
      persist(session)
      return session

  persist(session)
  return session

function restoreSession(session, now):
  if session.isRunning:
    return syncSessionState(session, now)

  if session.isPaused:
    return session

  return session

function markNotificationVisible(session, phaseName):
  if session.phaseFinishedAndNotified:
    return session
  return session with notificationVisible = true, phaseName = phaseName

function requestNotificationPermissionIfNeeded(permissionState, cycleState):
  if permissionState == "granted":
    return "not-needed"
  if cycleState == "firstCycle" and permissionState == "unknown":
    return "show-system-request"
  return "explain-how-to-enable"
```

La clave técnica es no depender del valor visual del reloj en memoria, sino del tiempo real medido por marcas temporales. Esto evita errores cuando la app queda en segundo plano, se bloquea el celular o se cierra la aplicación.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7, RF-8, RF-9.

## 5. Cómo se pinta en la interfaz

- La pantalla principal muestra el tiempo restante en formato `mm:ss` mientras la fase está activa.
- Si el celular fue bloqueado o la app pasó a segundo plano, al volver a la pantalla se recalcula y muestra el estado correcto sin que el estudiante tenga que ajustar nada.
- Cuando una fase termina con la app cerrada, la pantalla debe reflejar el estado como terminada y dejar preparada la siguiente fase sin iniciarla automáticamente.
- El aviso de finalización debe identificar la fase terminada y mantenerse visible hasta que el estudiante lo toque o lo descarte.
- Al tocar el aviso, la app abre la sesión terminada y presenta la fase correcta.
- Si el permiso de notificaciones está denegado, la sesión sigue funcionando y la UI informa al volver a la app sin bloquear el temporizador.
- Cuando el estudiante pausa antes de cerrar la aplicación, la sesión vuelve exactamente en el mismo punto y sin aviso de finalización.

RF cubierto: RF-1, RF-2, RF-3, RF-4, RF-5, RF-8, RF-9, RF-10.

## 6. Decisiones técnicas justificadas

### Decisión técnica 1: usar marcas temporales para sincronizar el tiempo real

- Se calculará el tiempo transcurrido en base a la diferencia entre `now` y la última marca guardada, y no solo al valor visual del reloj.
- Justificación: la constitución exige exactitud del temporizador ante segundo plano, bloqueo o cierre; esto es necesario para RF-1 y RF-2.
- Alternativa descartada: recalcular solo cuando la app vuelve a primer plano y confiar en el valor visible. Eso introduciría desfases y rompería la precisión del temporizador.

### Decisión técnica 2: el aviso es auxiliar, no un bloqueo funcional

- El temporizador debe seguir funcionando aunque Android no otorgue permiso de notificaciones.
- Justificación: RF-8 exige que la sesión siga funcionando y solo informe al volver a la app si no se muestra el aviso.
- Alternativa descartada: bloquear la sesión si el permiso se niega. Eso contradice la historia y la constitución.

### Decisión técnica 3: finalización sin iniciar la siguiente fase automáticamente

- Cuando la fase termina, el sistema marca la fase como terminada y prepara la siguiente fase sin iniciar su cuenta regresiva.
- Justificación: esto respeta la Definición de “fase preparada” y la regla de éxito de la HU-003.
- Alternativa descartada: iniciar la siguiente fase al instante para “seguir el flujo”. Eso rompe la decisión del usuario y la definición de la historia.

### Decisión técnica 4: solicitar permiso solo en el primer ciclo y explicar más adelante

- La solicitud del sistema se hace al principio del primer uso; luego, si el permiso sigue denegado, la app puede explicar cómo habilitarlo en un ciclo posterior sin repetir la solicitud del sistema.
- Justificación: RF-6 y RF-7 lo exigen y reduce la fricción del estudiante.
- Alternativa descartada: solicitar en cada ciclo completo. Eso genera molestias repetidas y contradice la decisión de la HU.

## 7. Estrategia de pruebas con Jest

1. Pruebas unitarias puras sobre la lógica:
   - bloquear el celular y comprobar que se descuentan los segundos y se recupera el tiempo restante correcto.
   - cerrar la app antes del fin de la fase y comprobar la restauración del tiempo transcurrido.
   - detectar fase terminada en segundo plano y dejar la siguiente fase preparada sin auto-inicio.
   - mantener una sesión pausada sin generar aviso de finalización.

2. Pruebas de persistencia:
   - guardar y recuperar el estado con `AsyncStorage` cuando la app se cierra.
   - asegurarse de que el tiempo restante se recalcule desde la última marca guardada.
   - verificar que, si no se concedió el permiso, la fase terminada se recupera aunque no haya aviso.

3. Pruebas de integración mínima de interfaz:
   - verificar que la pantalla muestra la fase terminada y el tiempo restante correcto al reabrir la app.
   - probar la permanencia del aviso y la apertura al tocarlo.
   - comprobar que la sesión pausada no genera un aviso al reabrir la app.

Se priorizan las pruebas de lógica por ser la base de la exactitud del temporizador. La interfaz se valida con la lista manual de `rn-conventions` en Expo Go.

## 8. Cobertura por requisito

- RF-1: `session.ts`, `session.test.ts`, `session-controls.tsx`; soluciona el cálculo correcto al bloquear el celular.
- RF-2: `session.ts`, `session-storage.ts`, `session-storage.test.ts`; restaura la sesión tras cerrar la app y volver a abrirla.
- RF-3: `session.ts`, `session-storage.ts`, `session.test.ts`; reconoce una fase terminada con la app cerrada y deja la siguiente preparada.
- RF-4: `session-controls.tsx`; muestra el aviso de finalización y lo mantiene visible hasta tocarlo o descartarlo.
- RF-5: `session-controls.tsx`; al tocar el aviso abre la app y muestra la sesión como terminada.
- RF-6: `session.ts`, `session-controls.tsx`; solicita el permiso al iniciar por primera vez y no repite la solicitud del sistema si ya fue concedido.
- RF-7: `session.ts`, `session-controls.tsx`; si el permiso sigue denegado en ciclos posteriores, explica cómo habilitarlo y no vuelve a pedirlo.
- RF-8: `session-storage.ts`, `session.test.ts`; la sesión continúa aunque no haya notificaciones.
- RF-9: `session-controls.tsx`, `session.test.ts`; notificación con sonido, vibración y/o avisos según el modo del celular.
- RF-10: `session-storage.ts`, `session.test.ts`; conserva la pausa y evita los avisos de finalización por una sesión pausada.


================================================
ðŸ“„ ARCHIVO: specs\003-conteo-appcerrada-bloqueada\spec.md
================================================

# Spec 003 - Mantener el conteo con el celular bloqueado o la app cerrada

Estado: aprobada

HU de origen: docs/historias/HU-003.md

## Contexto y objetivo

El temporizador debe reflejar el tiempo realmente transcurrido aunque el estudiante bloquee el celular o cierre la aplicación. Al volver, debe recuperar la sesión con el tiempo correcto; si una fase terminó, debe reconocerla y dejar preparada la fase siguiente sin iniciarla automáticamente. El estudiante también debe poder recibir un aviso de finalización mientras la aplicación está cerrada, bloqueada o en segundo plano, sujeto a los permisos y configuraciones del celular.

## Usuarios

- Estudiante que desea mantener el tiempo y el avance de su sesión aunque no tenga la aplicación abierta en pantalla.

## Historias de usuario

- Como estudiante, quiero que el temporizador siga contando aunque bloquee el celular o cierre la aplicación, para no perder el tiempo que llevo estudiando.

## Definiciones

- Fase terminada: fase cuyo tiempo configurado ya se cumplió.
- Fase preparada: fase siguiente identificada y lista para que el estudiante la inicie, sin comenzar su cuenta regresiva automáticamente.

## Requisitos funcionales

- RF-1: MIENTRAS el temporizador esté corriendo y el celular permanezca bloqueado, EL SISTEMA descuenta el tiempo transcurrido y, cuando el estudiante lo desbloquea, muestra el tiempo restante correcto. Origen: Escenario «Bloquear el celular».
- RF-2: CUANDO el estudiante cierra la aplicación desde las aplicaciones recientes mientras el temporizador está corriendo y vuelve a abrirla antes de que termine la fase, EL SISTEMA recupera la sesión y muestra el tiempo restante correcto, descontando el tiempo transcurrido. Origen: Escenario «Cerrar la aplicación»; Decisión 3 de HU-002.
- RF-3: CUANDO una fase termina mientras la aplicación está cerrada, EL SISTEMA reconoce la finalización, actualiza el avance correspondiente y deja preparada la fase siguiente sin iniciar otra cuenta regresiva automáticamente. Origen: Escenario «El tiempo termina con la aplicación cerrada»; Decisión 4 de HU-002.
- RF-4: CUANDO una fase termina mientras la aplicación está cerrada, en segundo plano o el celular está bloqueado, EL SISTEMA muestra un aviso que identifica la fase terminada y lo mantiene disponible hasta que el estudiante lo toque o lo descarte. Origen: Escenario «El tiempo termina con la aplicación cerrada»; Decisiones 1, 6 y 7.
- RF-5: CUANDO el estudiante toca el aviso de finalización, EL SISTEMA abre la aplicación y muestra la sesión como terminada. Origen: Decisión 1.
- RF-6: CUANDO el estudiante inicia el temporizador por primera vez, EL SISTEMA explica que el permiso permite recibir avisos al terminar una fase y solicita el permiso de notificaciones. CUANDO el permiso ya fue concedido, EL SISTEMA no vuelve a solicitarlo en cada ciclo completo posterior de pomodoros, compuesto por cuatro sesiones de estudio: las tres primeras con descanso corto y la cuarta con descanso largo. Origen: Decisiones 4 y 9.
- RF-7: SI el permiso de notificaciones sigue denegado en cada ciclo completo posterior de pomodoros, compuesto por cuatro sesiones de estudio: las tres primeras con descanso corto y la cuarta con descanso largo, EL SISTEMA no vuelve a solicitar el permiso del sistema y puede explicar cómo habilitar las notificaciones al comenzar un ciclo. Origen: Decisiones 2, 5 y 9.
- RF-8: SI no se concede el permiso de notificaciones, EL SISTEMA mantiene el temporizador en funcionamiento y, al abrir la aplicación después de que termine una fase, muestra la fase como terminada aunque no se haya mostrado un aviso. Origen: Decisión 2.
- RF-9: CUANDO una fase termina mientras la aplicación está en segundo plano o el celular está bloqueado, EL SISTEMA muestra un aviso con sonido, vibración y notificación si el celular tiene el sonido activado; con vibración y notificación si solo tiene la vibración activada; y únicamente con notificación si el celular está en silencio. Origen: Decisiones 3, 7 y 8.
- RF-10: CUANDO el estudiante pausa el temporizador y luego cierra y vuelve a abrir la aplicación, EL SISTEMA conserva la sesión pausada con el mismo tiempo restante y no muestra un aviso de finalización por esa sesión pausada. Origen: Escenario «Pausar antes de cerrar».

## Requisitos no funcionales

- El tiempo restante y el estado recuperado deben corresponder al tiempo realmente transcurrido, de acuerdo con el principio de exactitud del temporizador de la constitución.
- La función debe ser compatible con la plataforma Android definida por la constitución.

## Casos límite

- La fase termina mientras el estudiante bloquea el celular o la aplicación pasa a segundo plano.
- La fase termina después de cerrar la aplicación y antes de volver a abrirla.
- La aplicación se vuelve a abrir después de que terminó la fase y debe mostrarla como terminada, con la fase siguiente preparada sin inicio automático.
- El permiso de notificaciones no se concede; la sesión y la recuperación de la fase terminada siguen funcionando.
- El temporizador queda pausado antes de cerrar la aplicación y debe recuperarse sin reanudar ni generar un aviso.

## Fuera de alcance

- Iniciar automáticamente la fase siguiente después de una finalización.
- Cambiar las reglas de actualización del avance del ciclo establecidas en HU-002 y sus decisiones.
- Definir nuevas duraciones, fases o configuraciones del temporizador.

## Criterios de finalización

- Al bloquear el celular y desbloquearlo, la aplicación muestra el tiempo restante correcto.
- Al cerrar la aplicación desde las aplicaciones recientes y abrirla de nuevo, la sesión se recupera con el tiempo restante correcto o como fase terminada, según corresponda.
- Si una fase termina con la aplicación cerrada, se muestra el aviso previsto cuando los permisos y las configuraciones del celular lo permiten, y la aplicación recupera la fase como terminada.
- Tocar el aviso abre la aplicación y muestra la sesión terminada; el aviso permanece hasta tocarlo o descartarlo.
- La denegación del permiso no impide el conteo ni la recuperación del estado terminado.
- Una sesión pausada se conserva pausada, con el mismo tiempo restante y sin aviso de finalización.

## Dudas abiertas

No hay dudas abiertas.


================================================
ðŸ“„ ARCHIVO: specs\003-conteo-appcerrada-bloqueada\tasks.md
================================================

# Tareas de la historia 003 - Conteo con el celular bloqueado o la app cerrada

- [x] **T1. Definir el modelo de sesión y la sincronización exacta del tiempo.** RF-1, RF-2, RF-10
  - Hecho cuando: `src/domain/session.test.ts` cubre que, al bloquear el celular o al cerrar la app y volver a abrirla, la diferencia real de tiempo se descuenta sin perder ni ganar segundos; `npx jest src/domain/session.test.ts` pasa.

- [x] **T2. Recuperar la sesión al reabrir la app con el tiempo restante correcto.** RF-1, RF-2, RF-8
  - Hecho cuando: la prueba de lógica y persistencia demuestra que, al reabrir la app, el tiempo restante refleja el tiempo real transcurrido y la sesión sigue funcionando aunque la app estuviera cerrada; `npx jest src/domain/session.test.ts src/storage/session-storage.test.ts` pasa.

- [x] **T3. Reconocer finalización con la app cerrada y dejar preparada la siguiente fase.** RF-3, RF-8, RF-10
  - Hecho cuando: la prueba de lógica confirma que, al llegar a 00:00 con la aplicación cerrada, la fase queda terminada y la siguiente fase aparece preparada sin iniciarse automáticamente; `npx jest src/domain/session.test.ts` pasa.

- [x] **T4. Persistir y restaurar la sesión pausada y terminada en segundo plano.** RF-2, RF-3, RF-8, RF-10
  - Hecho cuando: la prueba de persistencia confirma que una sesión pausada conserva el mismo tiempo restante y que una fase terminada se recupera como terminada y no vuelve a iniciar; `npx jest src/storage/session-storage.test.ts` pasa.

- [x] **T5. Gestionar permiso y avisos de finalización.** RF-4, RF-5, RF-6, RF-7, RF-9
  - Hecho cuando: la lógica y la UI expresan que el aviso identifica la fase terminada, permanece hasta tocarlo o descartarlo, abre la app al tocarlo, y no solicita repetidamente el permiso del sistema si ya fue concedido o si sigue denegado; `npx jest` pasa y la comprobación manual en Expo Go confirma el flujo.

- [x] **T6. Mostrar el estado correcto en la pantalla y validar la experiencia manual.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-8, RF-9, RF-10
  - Hecho cuando: la pantalla refleja el tiempo restante correcto, la sesión terminada al volver a la app y el aviso de finalización con el texto correcto; la check-list manual de `rn-conventions` confirma flujo de bloqueo, segundo plano, cierre de app, toque del aviso y pausa conservada.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6

## Notas de implementación

- Las tareas de lógica y persistencia se verificarán con `npx jest`.
- Las tareas de interfaz y flujo completo se verifican con la lista manual de comprobación de `rn-conventions` en Expo Go.
- Si durante la implementación aparece una decisión que cambie el comportamiento del estudiante y no esté reflejada en la spec aprobada, se debe parar y pedir aclaración antes de avanzar.


================================================
ðŸ“„ ARCHIVO: specs\004-aviso-terminado\decisiones.md
================================================

# Decisiones - HU-004: Recibir aviso al terminar el tiempo

## 1. Iniciar el temporizador sin permiso de notificaciones

**Pregunta:** Si el estudiante deniega el permiso de notificaciones, ¿qué debe ocurrir al intentar iniciar el temporizador?

**Respuesta:** El temporizador inicia, pero la aplicación advierte que el aviso puede ser limitado.

**Motivo:** Denegar el permiso no debe impedir que el estudiante use el temporizador.

## 2. Aviso con permiso denegado y aplicación abierta

**Pregunta:** Si el permiso está denegado y la fase termina mientras la aplicación está abierta, ¿qué debe ver el estudiante?

**Respuesta:** Un aviso dentro de la aplicación que identifique la fase terminada, aunque no haya notificación del sistema.

**Motivo:** La aplicación debe comunicar la finalización cuando está visible, incluso si no puede mostrar una notificación del sistema.

## 3. Sonido y vibración en modo silencio

**Pregunta:** ¿HU-004 cambia la regla anterior de respetar el silencio del celular?

**Respuesta:** Sí. La aplicación debe intentar sonar como alarma y vibrar aunque el celular esté en silencio. Si Android limita ese comportamiento, la limitación debe documentarse antes de implementar.

**Motivo:** HU-004 pide explícitamente un aviso con sonido y vibración en silencio, aunque HU-003 había definido que en silencio solo se mostrara la notificación. La viabilidad de la plataforma debe confirmarse sin prometer capacidades que Android no garantice.

## 4. Descartar la notificación durante la alarma

**Pregunta:** Si el estudiante desliza la notificación para descartarla, ¿eso también debe detener el sonido de la alarma?

**Respuesta:** Sí. Descartar la notificación también silencia la alarma.

**Motivo:** La notificación ya está definida como descartable y esa acción debe permitir detener el aviso.

## 5. Sonido y vibración en modo vibración

**Pregunta:** ¿La alarma también debe sonar cuando el celular está en modo vibración?

**Respuesta:** Sí. Igual que en silencio, debe sonar como alarma y vibrar.

**Motivo:** HU-004 agrupa los modos silencio y vibración, y el estudiante confirmó que la alarma debe sonar en ambos.

## 6. Notificación como alarma en modo silencio o vibración

**Pregunta:** ¿Cómo debe mostrarse la notificación cuando el celular está en modo silencio o vibración?

**Respuesta:** La notificación debe mostrarse como alarma con sonido y vibración en ambos modos.

**Motivo:** Esta decisión confirma el comportamiento solicitado por HU-004 y sustituye, para los modos silencio y vibración, las salvedades sobre restricciones de Android de las decisiones 3 y 5.


================================================
ðŸ“„ ARCHIVO: specs\004-aviso-terminado\plan.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\004-aviso-terminado\spec.md
================================================

# Spec 004 - Recibir aviso al terminar el tiempo

Estado: aprobado

HU de origen: docs/historias/HU-004.md

## Contexto y objetivo

El estudiante necesita enterarse cuando termina una fase de estudio o descanso sin tener que mirar continuamente la pantalla. El aviso debe identificar la fase terminada y comunicar la finalización según el modo de sonido del celular y los permisos concedidos, incluyendo la solicitud de permiso al iniciar el temporizador por primera vez.

## Usuarios

- Estudiante que necesita saber cuándo termina una fase para cambiar de actividad.

## Historias de usuario

- Como estudiante, quiero que la aplicación me avise cuando termine el tiempo de estudio o de descanso, incluso con el celular en silencio, para cambiar de actividad sin estar mirando la pantalla.

## Definiciones

- Aviso de finalización: comunicación que indica que terminó una fase de estudio o descanso.
- Alarma: aviso con sonido y vibración asociado a la finalización de una fase.
- Fase siguiente preparada: fase que se muestra como siguiente, sin comenzar su cuenta regresiva automáticamente.

## Requisitos funcionales

- RF-1: CUANDO el temporizador llegue a cero mientras el celular tenga el sonido activado, EL SISTEMA mostrará un aviso con sonido y vibración que identifique la fase terminada. Origen: Escenario «Aviso con el celular en sonido».
- RF-2: CUANDO el temporizador llegue a cero mientras el celular esté en modo silencio o vibración, EL SISTEMA mostrará una notificación como alarma con sonido y vibración en la pantalla de bloqueo, identificando la fase terminada. Origen: Escenario «Aviso con el celular en silencio»; Decisión 6.
- RF-3: MIENTRAS la alarma de finalización esté activa, CUANDO el estudiante toque la notificación o el botón de detener, EL SISTEMA silenciará la alarma, abrirá la aplicación y mostrará la fase siguiente preparada, sin iniciar automáticamente su cuenta regresiva. Origen: Escenario «Detener el aviso»; Decisión 3.
- RF-4: CUANDO el estudiante descarte la notificación mientras la alarma esté activa, EL SISTEMA silenciará la alarma. Origen: Decisión 4.
- RF-5: CUANDO el estudiante inicie un temporizador por primera vez y no haya concedido el permiso de notificaciones, EL SISTEMA explicará para qué se necesita el permiso y lo solicitará. Origen: Escenario «Permiso de notificaciones»; Decisión 1.
- RF-6: SI el estudiante deniega el permiso de notificaciones, ENTONCES EL SISTEMA permitirá iniciar el temporizador y advertirá que el aviso puede ser limitado. Origen: Decisión 1.
- RF-7: SI una fase termina mientras el permiso de notificaciones está denegado y la aplicación está abierta, ENTONCES EL SISTEMA mostrará dentro de la aplicación un aviso que identifique la fase terminada. Origen: Decisión 2.

## Requisitos no funcionales

- La funcionalidad debe priorizar la plataforma Android definida en la constitución.
- El aviso debe identificar de forma comprensible si terminó una fase de estudio o de descanso.

## Casos límite

- El permiso se deniega al iniciar el temporizador por primera vez: el temporizador puede iniciar y se advierte que el aviso podría ser limitado.
- La fase termina con el permiso denegado y la aplicación visible: se muestra el aviso dentro de la aplicación.
- La notificación se descarta mientras suena la alarma: la alarma se silencia.

## Fuera de alcance

- Impedir el uso del temporizador cuando el estudiante no concede permiso de notificaciones.
- Iniciar automáticamente la cuenta regresiva de la fase siguiente.
- Cambiar las reglas de conteo, recuperación o avance entre fases definidas en otras historias y specs.

## Criterios de finalización

- Al terminar una fase con el sonido del celular activado, se presenta un aviso audible y con vibración que identifica la fase terminada.
- Al terminar una fase en modo silencio o vibración, se muestra una notificación como alarma con sonido y vibración en la pantalla de bloqueo, identificando la fase terminada.
- Al tocar la notificación o el botón de detener, la alarma se silencia y se abre la aplicación mostrando la fase siguiente preparada, sin iniciar su cuenta regresiva.
- Al descartar la notificación durante la alarma, la alarma se silencia.
- Al iniciar el temporizador por primera vez sin permiso, se explica y solicita el permiso; denegarlo no impide iniciar el temporizador.
- Si una fase termina con la aplicación abierta y el permiso denegado, se muestra un aviso dentro de la aplicación que identifica la fase terminada.

## Dudas abiertas

No hay dudas abiertas.

================================================
ðŸ“„ ARCHIVO: specs\004-aviso-terminado\tasks.md
================================================

# Tareas de la historia 004 - Recibir aviso al terminar el tiempo

- [x] **T1. Revisar las capacidades y límites de notificaciones Android.** RF-2, RF-4
  - Hecho cuando: la documentación de Expo SDK 57 y Android identifica qué garantías hay para sonido, vibración, bloqueo, acción de detener y descarte, y registra cualquier capacidad que requiera aprobación adicional.
  - Resultado: los canales permiten configurar sonido, vibración e importancia y las notificaciones admiten acciones; Android conserva el control del canal y del modo silencio, por lo que no se garantiza que suene en silencio. Expo documenta `customDismissAction` solo para iOS; el descarte Android no ofrece aquí una señal para silenciar la alarma. Evitar DND requeriría acceso especial del usuario, no aprobado.

- [ ] **T2. Probar en Android la alarma en silencio y vibración.** RF-2
  - Hecho cuando: en un Android físico se comprueba sonido, vibración y presentación en pantalla bloqueada con el modo silencio/vibración activado; si RF-2 no es viable con las APIs aprobadas, se detiene el trabajo y se solicita decisión antes de continuar. El toque, «Detener» y descarte se validan en T6 y T7 una vez implementados.

- [x] **T3. Cubrir con pruebas la política de permiso y el avance sin permiso.** RF-5, RF-6
  - Hecho cuando: las pruebas de `src/domain/session.test.ts` cubren permiso concedido, primera solicitud, denegación y explicación posterior; `npx jest src/domain/session.test.ts` pasa. La continuidad del temporizador se valida en la UI como parte de T5.
  - Nota: completada fuera de orden con autorización del usuario; T2 sigue pendiente.

- [ ] **T4. Configurar notificación local con fase, sonido y vibración.** RF-1, RF-2
  - Hecho cuando: la configuración Android aprobada por T2 programa una notificación al vencimiento que identifica estudio/descanso y aparece en bloqueo; si el canal existente impide cambiar la configuración, se usa un ID nuevo y la prueba manual confirma el resultado.
  - Implementación provisional: canal `session-completion-v3` con prioridad alta, visibilidad pública en bloqueo, sonido y vibración predeterminados. T2 y la prueba física de la notificación siguen pendientes; la tarea no está completada.

- [ ] **T5. Completar solicitud de permiso y aviso en primer plano.** RF-5, RF-6, RF-7
  - Hecho cuando: al primer inicio sin permiso se explica su propósito y se solicita; denegar no impide usar el temporizador; con la app visible y permiso denegado, el aviso identifica la fase terminada; Jest pasa y la interfaz cumple los puntos aplicables de la checklist manual de `rn-conventions`.
  - Apoyo de prueba añadido: control de desarrollo que borra solo las marcas locales de notificación; falta validar el diálogo de Android y el aviso en primer plano en un entorno compatible.

- [ ] **T6. Gestionar toque y acción «Detener» de la notificación.** RF-3
  - Hecho cuando: tocar la notificación o su acción «Detener» silencia el aviso y abre la app con la fase siguiente preparada, sin iniciar su cuenta regresiva; se confirma en Android físico.
  - Implementación provisional: categoría Android con acción «Detener»; el toque y la acción restauran la sesión, descartan la notificación y limpian la respuesta pendiente. Falta validación en un Android con build compatible; la tarea sigue abierta.

- [ ] **T7. Gestionar el descarte de la notificación durante el aviso.** RF-4
  - Hecho cuando: descartar la notificación silencia el aviso en Android físico; si la plataforma no expone la acción necesaria con las APIs aprobadas, se detiene el trabajo y se solicita decisión antes de cambiar el comportamiento.
  - Bloqueo técnico: Expo SDK 57 no expone un callback de descarte en Android; `customDismissAction` está implementado para iOS. No se añadió código nativo ni se cambió RF-4; se solicita decisión.

- [ ] **T8. Ejecutar la regresión manual del flujo de finalización.** RF-1, RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Hecho cuando: se revisan los resultados registrados en T2 y T4–T7 contra todos los RF, no queda ningún escenario sin comprobar y `npx jest` pasa.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5
6. T6
7. T7
8. T8

## Notas de implementación

- Las tareas de lógica se verifican con Jest; las tareas de interfaz, con la lista manual de `rn-conventions` en Android.
- T1 y T2 son puertas: si la plataforma no cumple RF-2 o RF-4, no se deben reinterpretar esos requisitos ni modificar el comportamiento visible sin actualizar primero la decisión/spec con aprobación del usuario.
- No se añaden dependencias ni se cambia el formato de los datos guardados.


================================================
ðŸ“„ ARCHIVO: specs\005-ajustar-tiempos\decisiones.md
================================================

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



================================================
ðŸ“„ ARCHIVO: specs\005-ajustar-tiempos\plan.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\005-ajustar-tiempos\spec.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\005-ajustar-tiempos\tasks.md
================================================

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


================================================
ðŸ“„ ARCHIVO: specs\006-uso-libre\decisiones.md
================================================

# Decisiones de la HU-006 — Uso sin registro, internet ni publicidad

## Contexto

La HU-006 busca que los estudiantes puedan utilizar el Temporizador Pomodoro de la Academia Cotopaxi desde la primera apertura, sin crear una cuenta, sin depender de una conexión a internet y sin interrupciones publicitarias.

Las siguientes decisiones concretan el comportamiento esperado antes de redactar la especificación.

## D-001: Acceso directo a la aplicación

**Decisión:** La aplicación abrirá directamente la pantalla principal del temporizador, incluso en el primer inicio.

**Justificación:** El estudiante debe poder comenzar a utilizar la aplicación sin pasos previos innecesarios.

**Consecuencias:**
- No se solicitará crear una cuenta ni iniciar sesión.
- No se mostrará una pantalla de bienvenida obligatoria antes del temporizador.

## D-002: Funcionamiento sin conexión

**Decisión:** Las funciones principales del temporizador, los ajustes y los avisos de finalización deberán funcionar sin conexión a internet.

**Justificación:** El estudiante debe poder estudiar aunque no tenga datos móviles ni acceso a una red wifi.

**Consecuencias:**
- El funcionamiento principal no dependerá de un servidor.
- Los avisos de finalización deberán apoyarse en mecanismos locales del dispositivo, coordinados con la HU-004.
- La aplicación no deberá necesitar conexión para consultar o utilizar los ajustes guardados.

## D-003: Persistencia local de los ajustes

**Decisión:** Los ajustes del usuario se guardarán en el dispositivo y estarán disponibles al volver a abrir la aplicación, sin requerir conexión a internet.

**Justificación:** El estudiante no debería tener que configurar nuevamente sus tiempos cada vez que abre la aplicación.

**Consecuencias:**
- La configuración se conservará entre aperturas de la aplicación.
- Esta decisión se coordinará con la HU-003, que define la recuperación de la sesión del temporizador.

## D-004: Ausencia de publicidad

**Decisión:** La aplicación no mostrará publicidad en ninguna de sus pantallas.

**Justificación:** El objetivo es ofrecer una experiencia de estudio sin interrupciones.

**Consecuencias:**
- No aparecerán anuncios, banners ni ventanas emergentes publicitarias.
- No se incorporarán servicios o SDK destinados a mostrar anuncios.

## D-005: Independencia de servicios externos para las funciones principales

**Decisión:** Las funciones principales de la aplicación no dependerán de servicios externos ni de una conexión a internet para funcionar.

**Justificación:** El temporizador debe seguir siendo útil en entornos sin conectividad.

**Consecuencias:**
- El funcionamiento básico deberá resolverse en el dispositivo.
- Esta decisión no prohíbe por sí sola posibles funciones futuras que utilicen internet, siempre que sean aprobadas y no impidan el funcionamiento principal sin conexión.

## Relación con otras historias

- **HU-003:** Coordinar la persistencia y recuperación de la sesión cuando se cierra y vuelve a abrir la aplicación.
- **HU-004:** Coordinar los avisos locales de finalización y su funcionamiento sin conexión.
- **HU-005:** Mantener la configuración de los tiempos disponible sin conexión.

## Estado

Decisiones aceptadas por la usuaria. Pendiente redactar y revisar `spec.md` antes de generar el plan y las tareas.

================================================
ðŸ“„ ARCHIVO: specs\006-uso-libre\plan.md
================================================

# Plan de la historia 006 - Uso libre

## Alcance

- Se planifican RF-1 a RF-7 de la spec aprobada.
- Se reutilizan las pantallas, la lógica del temporizador, los avisos y el almacenamiento local existentes.
- No se incorporan cuentas, registro, autenticación, servicios externos ni publicidad.
- La implementación debe mantener el comportamiento de las historias anteriores, especialmente la recuperación de sesión, los ajustes y los avisos de finalización.
- Las decisiones de producto se toman de `decisiones.md`: D-001, D-002, D-003, D-004 y D-005.
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

No se prevén archivos nuevos ni dependencias adicionales. Si la revisión detecta que un requisito ya está implementado, se conservará ese comportamiento y se añadirá o ajustará la verificación que falte, en lugar de reescribirlo.

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


================================================
ðŸ“„ ARCHIVO: specs\006-uso-libre\spec.md
================================================

# Spec 006 - Uso libre

Estado: aprobada

HU de origen: docs/historias/HU-006.md

## Contexto y objetivo

La aplicación Temporizador Pomodoro de la Academia Cotopaxi está dirigida a estudiantes que necesitan organizar sus sesiones de estudio y descanso.

Esta historia busca que el estudiante pueda utilizar la aplicación desde la primera apertura, sin crear una cuenta, sin depender de una conexión a internet y sin interrupciones publicitarias.

El objetivo es facilitar el acceso al temporizador y permitir su uso en entornos donde no hay conexión disponible.

## Usuarios

- **Estudiante:** persona que utiliza el temporizador para organizar sus sesiones de estudio y descanso.

## Historias de usuario

Como estudiante, quiero usar la aplicación apenas la instalo, sin crear una cuenta, sin datos móviles y sin anuncios, para empezar a estudiar sin trabas.

## Definiciones

- **Sin conexión:** uso de las funciones principales de la aplicación sin acceso a datos móviles ni wifi.
- **Publicidad:** anuncios, banners o ventanas emergentes cuyo propósito sea promocionar productos o servicios.
- **Ajustes:** configuración de las duraciones de estudio y descanso, y de la cantidad de pomodoros por ciclo.

## Requisitos funcionales

### RF-001: Acceso directo al temporizador

CUANDO el estudiante abra la aplicación por primera vez después de instalarla, EL SISTEMA DEBERÁ mostrar directamente la pantalla principal del temporizador, sin exigir que cree una cuenta, inicie sesión o complete una pantalla de bienvenida obligatoria.

**Origen:** Escenario «Abrir la aplicación por primera vez» de HU-006; decisión D-001 de `decisiones.md`.

### RF-002: Uso del temporizador sin conexión

MIENTRAS el dispositivo no tenga conexión a datos móviles ni wifi, EL SISTEMA DEBERÁ permitir al estudiante utilizar las funciones principales del temporizador.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisiones D-002 y D-005 de `decisiones.md`.

### RF-003: Avisos de finalización sin conexión

CUANDO el temporizador termine una fase mientras el dispositivo no tenga conexión a internet, EL SISTEMA DEBERÁ mantener disponible el mecanismo de aviso de finalización definido para la aplicación, de acuerdo con los requisitos de la HU-004 y los permisos del dispositivo.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisión D-002 de `decisiones.md`; HU-004, «Recibir aviso al terminar el tiempo».

### RF-004: Uso de los ajustes sin conexión

MIENTRAS el dispositivo no tenga conexión a internet, EL SISTEMA DEBERÁ permitir al estudiante consultar y modificar los ajustes del temporizador.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisión D-002 de `decisiones.md`.

### RF-005: Conservación de los ajustes

CUANDO el estudiante guarde sus ajustes y cierre la aplicación, EL SISTEMA DEBERÁ conservar la configuración en el dispositivo para que esté disponible al volver a abrir la aplicación, sin requerir conexión a internet.

**Origen:** Escenario «Usarla sin conexión» de HU-006; decisión D-003 de `decisiones.md`; HU-005, «Ajustar los tiempos del pomodoro».

### RF-006: Ausencia de publicidad

EL SISTEMA NO DEBERÁ mostrar anuncios, banners ni ventanas emergentes publicitarias en ninguna de las pantallas de la aplicación.

**Origen:** Escenario «Usarla sin publicidad» de HU-006; decisión D-004 de `decisiones.md`.

### RF-007: Independencia de servicios externos

EL SISTEMA DEBERÁ permitir el funcionamiento de las funciones principales sin depender de servidores o servicios externos que requieran conexión a internet.

**Origen:** Decisión D-005 de `decisiones.md`.

## Requisitos no funcionales

### RNF-001: Disponibilidad sin conexión

La disponibilidad de las funciones principales no deberá depender de que el dispositivo tenga acceso a internet.

**Origen:** Decisiones D-002 y D-005 de `decisiones.md`.

### RNF-002: Persistencia local

Los ajustes deberán mantenerse disponibles en el dispositivo después de cerrar y volver a abrir la aplicación, de acuerdo con la decisión D-003.

**Origen:** Decisión D-003 de `decisiones.md`.

### RNF-003: Experiencia sin publicidad

La experiencia de uso deberá mantenerse libre de elementos publicitarios en todas las pantallas de la aplicación.

**Origen:** Decisión D-004 de `decisiones.md`.

## Casos límite

- **Primera apertura sin conexión:** la aplicación deberá mostrar directamente el temporizador sin exigir conectividad ni registro.
- **Cierre y reapertura sin conexión:** los ajustes guardados deberán seguir disponibles.
- **Finalización de una fase sin conexión:** el mecanismo de aviso deberá respetar los requisitos de la HU-004 y los permisos del dispositivo.
- **Pantallas sin publicidad:** ninguna pantalla deberá mostrar anuncios, incluidos banners o ventanas emergentes publicitarias.

## Fuera de alcance

- Crear cuentas, iniciar sesión o administrar perfiles de usuario.
- Incorporar publicidad o servicios destinados a mostrar anuncios.
- Incorporar nuevas funciones que dependan de internet y que no estén contempladas en las historias aprobadas.

La posibilidad de incorporar funciones futuras que utilicen internet no queda prohibida por esta historia, siempre que sean aprobadas y no impidan el funcionamiento principal sin conexión.

## Criterios de finalización

- Al abrir la aplicación por primera vez, se muestra directamente el temporizador sin solicitar registro ni inicio de sesión.
- El temporizador puede utilizarse sin datos móviles ni wifi.
- Los avisos de finalización mantienen el comportamiento establecido en la HU-004 cuando no hay conexión.
- Los ajustes pueden consultarse y modificarse sin conexión.
- Los ajustes guardados se conservan al cerrar y volver a abrir la aplicación.
-  Ninguna pantalla muestra anuncios, banners o ventanas emergentes publicitarias.
- Las funciones principales no dependen de servicios externos que requieran conexión a internet.

## Dudas abiertas

No hay dudas abiertas.

================================================
ðŸ“„ ARCHIVO: specs\006-uso-libre\tasks.md
================================================

# Tareas de la historia 006 - Uso libre

- [ ] **T1. Revisar el acceso inicial y las dependencias de las funciones principales. (25 min)** RF-1, RF-2, RF-3, RF-7
  - Revisar la pantalla principal, la navegación, la lógica de sesión y los avisos existentes. Identificar si alguna función esencial depende de autenticación, servicios externos o conexión de red.
  - Hecho cuando: queda identificado qué comportamiento ya cumple la spec y qué cambios son realmente necesarios; no se duplican pantallas ni lógica de las HU anteriores.

- [ ] **T2. Verificar la persistencia local de los ajustes. (25 min)** RF-4, RF-5, RF-7
  - Revisar `src/domain/settings.ts`, `src/storage/settings-storage.ts` y `src/context/settings-context.tsx`. Añadir o ajustar únicamente las pruebas necesarias para cubrir guardado, recuperación y errores de almacenamiento.
  - Hecho cuando: las pruebas de `src/storage/settings-storage.test.ts` comprueban que los ajustes se guardan y recuperan correctamente, y que un fallo de escritura no se presenta como un guardado exitoso; `npx jest src/storage/settings-storage.test.ts` pasa.

- [ ] **T3. Verificar el funcionamiento local del temporizador y los avisos. (25 min)** RF-2, RF-3, RF-7
  - Revisar la lógica existente de sesión y el flujo de avisos locales. Añadir o ajustar pruebas de dominio solo si falta cobertura.
  - Hecho cuando: las pruebas verifican que la lógica esencial de sesión no requiere una respuesta de red y que se mantienen las reglas de finalización y recuperación de las HU anteriores; `npx jest src/domain/session.test.ts` pasa.

- [ ] **T4. Validar el acceso directo y los ajustes en la interfaz. (25 min)** RF-1, RF-4, RF-5
  - Revisar la primera apertura de la aplicación y la pantalla existente de ajustes. Realizar cambios solo si se detecta una desviación de la spec.
  - Hecho cuando: en la comprobación manual la aplicación abre directamente el temporizador, no exige registro ni inicio de sesión y permite consultar y guardar los ajustes desde la interfaz existente; se verifican los puntos aplicables de `rn-conventions`.

- [ ] **T5. Validar la aplicación sin conexión y sin publicidad. (25 min)** RF-2, RF-3, RF-4, RF-5, RF-6, RF-7
  - Realizar la prueba manual con el dispositivo sin conexión, comprobar los ajustes después de reabrir la aplicación y recorrer las pantallas disponibles.
  - Hecho cuando: el temporizador, los avisos locales y los ajustes funcionan sin datos móviles ni wifi; los ajustes se conservan después de cerrar y reabrir la aplicación; no aparece publicidad en las pantallas; y se registra el resultado de la lista manual aplicable de `rn-conventions`.

## Orden de dependencia

1. T1
2. T2
3. T3
4. T4
5. T5

## Notas de implementación

- Las tareas de lógica y persistencia se verifican con `npx jest`.
- Las tareas de interfaz y funcionamiento sin conexión requieren verificación manual en el entorno móvil del proyecto.
- No se deben añadir dependencias ni servicios externos para resolver requisitos que ya pueden cubrirse con la lógica y el almacenamiento local existentes.
- Si se detecta que una función esencial depende de internet o que un cambio altera el comportamiento visible definido en la spec aprobada, se debe detener la implementación y solicitar aclaración antes de cambiar el alcance.
- Una tarea solo se marcará como completada cuando se cumpla su criterio de «Hecho cuando».


================================================
ðŸ“„ ARCHIVO: src\app\explore.tsx
================================================

import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Explore</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            This starter app includes example{'\n'}code to help you get started.
          </ThemedText>

          <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
                <SymbolView
                  tintColor={theme.text}
                  name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }}
                  size={12}
                />
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="File-based routing">
            <ThemedText type="small">
              This app has two screens: <ThemedText type="code">src/app/index.tsx</ThemedText> and{' '}
              <ThemedText type="code">src/app/explore.tsx</ThemedText>
            </ThemedText>
            <ThemedText type="small">
              The layout file in <ThemedText type="code">src/app/_layout.tsx</ThemedText> sets up
              the tab navigator.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/router/introduction">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Android, iOS, and web support">
            <ThemedView type="backgroundElement" style={styles.collapsibleContent}>
              <ThemedText type="small">
                You can open this project on Android, iOS, and the web. To open the web version,
                press <ThemedText type="smallBold">w</ThemedText> in the terminal running this
                project.
              </ThemedText>
              <Image
                source={require('@/assets/images/tutorial-web.png')}
                style={styles.imageTutorial}
              />
            </ThemedView>
          </Collapsible>

          <Collapsible title="Images">
            <ThemedText type="small">
              For static images, you can use the <ThemedText type="code">@2x</ThemedText> and{' '}
              <ThemedText type="code">@3x</ThemedText> suffixes to provide files for different
              screen densities.
            </ThemedText>
            <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} />
            <ExternalLink href="https://reactnative.dev/docs/images">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Light and dark mode components">
            <ThemedText type="small">
              This template has light and dark mode support. The{' '}
              <ThemedText type="code">useColorScheme()</ThemedText> hook lets you inspect what the
              user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
            </ThemedText>
            <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
              <ThemedText type="linkPrimary">Learn more</ThemedText>
            </ExternalLink>
          </Collapsible>

          <Collapsible title="Animations">
            <ThemedText type="small">
              This template includes an example of an animated component. The{' '}
              <ThemedText type="code">src/components/ui/collapsible.tsx</ThemedText> component uses
              the powerful <ThemedText type="code">react-native-reanimated</ThemedText> library to
              animate opening this hint.
            </ThemedText>
          </Collapsible>
        </ThemedView>
        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: 'center',
    gap: Spacing.one,
    alignItems: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: 'center',
  },
  imageTutorial: {
    width: '100%',
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\index.tsx
================================================

import { SessionControls } from "@/components/session-controls";

export default function HomeScreen() {
  return <SessionControls />;
}


================================================
ðŸ“„ ARCHIVO: src\app\settings.tsx
================================================

import { CraftyGirls_400Regular } from "@expo-google-fonts/crafty-girls";
import { useFonts } from "expo-font";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSettings } from "@/context/settings-context";
import {
  DEFAULT_SETTINGS,
  validateSettings,
  type Settings,
  type SettingsDraft,
  type SettingsField,
} from "@/domain/settings";

const FIELDS: { key: SettingsField; label: string }[] = [
  { key: "studyDurationMinutes", label: "Estudio (minutos)" },
  { key: "shortBreakDurationMinutes", label: "Descanso corto (minutos)" },
  { key: "longBreakDurationMinutes", label: "Descanso largo (minutos)" },
  { key: "pomodorosPerCycle", label: "Pomodoros por ciclo" },
];

type Feedback = { kind: "success" | "error"; text: string };

function toDraft(settings: Settings): SettingsDraft {
  return {
    studyDurationMinutes: String(settings.studyDurationMinutes),
    shortBreakDurationMinutes: String(settings.shortBreakDurationMinutes),
    longBreakDurationMinutes: String(settings.longBreakDurationMinutes),
    pomodorosPerCycle: String(settings.pomodorosPerCycle),
  };
}

export default function SettingsScreen() {
  const { status } = useSettings();
  const [fontsLoaded] = useFonts({ CraftyGirls_400Regular });
  const fontFamily = fontsLoaded ? "CraftyGirls_400Regular" : "sans-serif";

  if (status === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text style={[styles.message, { fontFamily }]}>
            Cargando ajustes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return <SettingsForm fontFamily={fontFamily} />;
}

function SettingsForm({ fontFamily }: { fontFamily: string }) {
  const { settings, status, updateSettings } = useSettings();
  const [draft, setDraft] = useState<SettingsDraft>(() => toDraft(settings));
  const [errors, setErrors] = useState<
    Partial<Record<SettingsField, string>>
  >({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(field: SettingsField, text: string) {
    setDraft((current) => ({ ...current, [field]: text }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFeedback(null);
  }

  async function persist(next: Settings, successText: string) {
    setIsSaving(true);
    try {
      // Se persiste primero; solo tras una escritura exitosa se presentan
      // los valores como aplicados (RF-9).
      await updateSettings(next);
      setDraft(toDraft(next));
      setErrors({});
      setFeedback({ kind: "success", text: successText });
    } catch {
      // Los valores editados se conservan en pantalla para reintentar.
      setFeedback({
        kind: "error",
        text: "No se pudieron guardar los cambios. Tus valores siguen en pantalla; inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave() {
    if (isSaving) {
      return;
    }

    const result = validateSettings(draft);
    if (result.settings === null) {
      // Pantalla abierta, borrador intacto y nada se escribe (RF-2).
      setErrors(result.errors);
      setFeedback(null);
      return;
    }

    await persist(
      result.settings,
      "Ajustes guardados. Una fase en curso termina con el tiempo con el que empezó.",
    );
  }

  function handleResetPress() {
    if (isSaving) {
      return;
    }

    // «Cancelar» va primero y no hace nada: no cambia ningún valor (RF-6, RF-7).
    Alert.alert(
      "Restablecer ajustes",
      "Se reemplazarán los cuatro ajustes por los valores predeterminados: 25 minutos de estudio, 5 de descanso corto, 15 de descanso largo y 4 pomodoros por ciclo.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restablecer",
          style: "destructive",
          onPress: () => {
            void persist(
              DEFAULT_SETTINGS,
              "Valores predeterminados restablecidos y guardados.",
            );
          },
        },
      ],
      { cancelable: true },
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.brand, { fontFamily }]}>Academia Cotopaxi</Text>
        <Text accessibilityRole="header" style={[styles.heading, { fontFamily }]}>
          Ajustes
        </Text>

        {status === "error" && (
          <Text style={[styles.message, { fontFamily }]}>
            No se pudieron leer los ajustes guardados. Se muestran los valores
            predeterminados.
          </Text>
        )}

        {FIELDS.map(({ key, label }) => {
          const error = errors[key];
          return (
            <View key={key} style={styles.field}>
              <Text style={[styles.label, { fontFamily }]}>{label}</Text>
              <TextInput
                accessibilityLabel={label}
                inputMode="numeric"
                keyboardType="number-pad"
                onChangeText={(text) => handleChange(key, text)}
                style={[
                  styles.input,
                  error !== undefined && styles.inputInvalid,
                  { fontFamily },
                ]}
                value={draft[key]}
              />
              {error !== undefined && (
                <Text
                  accessibilityLiveRegion="polite"
                  style={[styles.error, { fontFamily }]}
                >
                  {error}
                </Text>
              )}
            </View>
          );
        })}

        {feedback !== null && (
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.message,
              feedback.kind === "error" && styles.messageError,
              { fontFamily },
            ]}
          >
            {feedback.text}
          </Text>
        )}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Guardar ajustes"
            accessibilityState={{ disabled: isSaving }}
            disabled={isSaving}
            onPress={() => void handleSave()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.primaryButtonText, { fontFamily }]}>
              Guardar
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restablecer ajustes a los valores predeterminados"
            accessibilityState={{ disabled: isSaving }}
            disabled={isSaving}
            onPress={handleResetPress}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.secondaryButtonText, { fontFamily }]}>
              Restablecer
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141759",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  brand: {
    color: "#F2D194",
    fontSize: 22,
    textAlign: "center",
  },
  heading: {
    color: "#F2F2F2",
    fontSize: 30,
    textAlign: "center",
  },
  field: {
    gap: 6,
  },
  label: {
    color: "#F2D194",
    fontSize: 18,
  },
  input: {
    minHeight: 48,
    backgroundColor: "#F2F2F2",
    color: "#141759",
    fontSize: 20,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#F2F2F2",
  },
  inputInvalid: {
    borderColor: "#D9A91A",
  },
  error: {
    color: "#F2D194",
    fontSize: 16,
  },
  message: {
    color: "#F2F2F2",
    fontSize: 17,
    textAlign: "center",
  },
  messageError: {
    color: "#F2D194",
  },
  actions: {
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    minWidth: 180,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9A91A",
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: "#141759",
    fontSize: 21,
  },
  secondaryButton: {
    minWidth: 180,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F2D194",
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: "#F2D194",
    fontSize: 21,
  },
  pressed: {
    opacity: 0.75,
  },
});


================================================
ðŸ“„ ARCHIVO: src\app\_layout.tsx
================================================

import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { SettingsProvider } from '@/context/settings-context';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <AnimatedSplashOverlay />
        <AppTabs />
      </SettingsProvider>
    </ThemeProvider>
  );
}


================================================
ðŸ“„ ARCHIVO: src\components\animated-icon.tsx
================================================

import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;
const DURATION = 600;

export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const image = <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />;

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={styles.splashOverlay}>
      {image}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={styles.splashOverlay}>
      {image}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: Easing.elastic(0.7),
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: Easing.elastic(0.7),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} />
      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`,
    width: 128,
    height: 128,
    position: 'absolute',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\animated-icon.web.tsx
================================================

import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { Keyframe, Easing } from 'react-native-reanimated';

import classes from './animated-icon.module.css';
const DURATION = 300;

export function AnimatedSplashOverlay() {
  return null;
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={classes.expoLogoBackground} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 128 / 2 + 138,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    width: 128,
    height: 128,
    position: 'absolute',
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\app-tabs.tsx
================================================

import { Tabs } from "expo-router";
import { Image, useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/tabIcons/home.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/tabIcons/explore.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require("@/assets/images/tabIcons/explore.png")}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}


================================================
ðŸ“„ ARCHIVO: src\components\app-tabs.web.tsx
================================================

import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

import { ExternalLink } from './external-link';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Explore</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Ajustes</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Expo Starter
        </ThemedText>

        {props.children}

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={styles.externalPressable}>
            <ThemedText type="link">Docs</ThemedText>
            <SymbolView
              tintColor={colors.text}
              name={{ ios: 'arrow.up.right.square', web: 'link' }}
              size={12}
            />
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  externalPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    marginLeft: Spacing.three,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\external-link.tsx
================================================

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}


================================================
ðŸ“„ ARCHIVO: src\components\hint-row.tsx
================================================

import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\session-controls.tsx
================================================

import { CraftyGirls_400Regular } from "@expo-google-fonts/crafty-girls";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    AppState,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    advanceSession,
    applySettingsToSession,
    createSession,
    getNotificationPermissionAction,
    pauseSession,
    resetSession,
    resumeSession,
    shouldShowCompleted,
    startSession,
    syncSessionState,
    type Session,
} from "@/domain/session";
import { useSettings } from "@/context/settings-context";
import {
    hasCompletedNotificationCycle,
    hasRequestedNotificationPermission,
    loadSession,
    markNotificationCycleCompleted,
    markNotificationPermissionRequested,
    resetNotificationStateForTesting,
    saveSession,
} from "@/storage/session-storage";

const STUDY_DURATION_MS = 25 * 60 * 1000;
const NOTIFICATION_CHANNEL_ID = "session-completion-v3";
const NOTIFICATION_CATEGORY_ID = "sessionCompletion";
const NOTIFICATION_STOP_ACTION_ID = "stop";

type NotificationsModule = typeof import("expo-notifications");

async function loadNotifications(): Promise<NotificationsModule | null> {
  try {
    return await import("expo-notifications");
  } catch {
    return null;
  }
}

async function configureNotifications(
  notifications: NotificationsModule,
): Promise<void> {
  notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  await notifications.setNotificationCategoryAsync(NOTIFICATION_CATEGORY_ID, [
    {
      identifier: NOTIFICATION_STOP_ACTION_ID,
      buttonTitle: "Detener",
      options: { opensAppToForeground: true },
    },
  ]);

  await notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    name: "Sesión de estudio",
    importance: notifications.AndroidImportance.HIGH,
    lockscreenVisibility: notifications.AndroidNotificationVisibility.PUBLIC,
    sound: "default",
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
  });
}

async function scheduleCompletionNotification(
  session: Session,
  notifications: NotificationsModule,
): Promise<boolean> {
  try {
    await notifications.cancelAllScheduledNotificationsAsync();
    const deadline =
      (session.lastUpdatedAt ?? Date.now()) + session.remainingMs;
    await notifications.scheduleNotificationAsync({
      content: {
        title: "Sesión terminada",
        body: `Finalizó ${getPhaseLabel(session.phase).toLowerCase()}.`,
        data: { type: "session-completion" },
        categoryIdentifier: NOTIFICATION_CATEGORY_ID,
        sound: "default",
        priority: notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger: {
        type: notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(deadline),
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });

    return true;
  } catch {
    return false;
  }
}

async function scheduleIfPermissionGranted(session: Session): Promise<boolean> {
  try {
    const notifications = await loadNotifications();
    if (!notifications) {
      return false;
    }

    await configureNotifications(notifications);
    const permission = await notifications.getPermissionsAsync();
    return permission.granted
      ? scheduleCompletionNotification(session, notifications)
      : false;
  } catch {
    return false;
  }
}

function confirmNotificationPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "Avisos de fin de sesión",
      "Permite las notificaciones para recibir un aviso cuando termine cada fase, incluso si la aplicación está cerrada.",
      [
        {
          text: "Ahora no",
          style: "cancel",
          onPress: () => resolve(false),
        },
        { text: "Continuar", onPress: () => resolve(true) },
      ],
      { cancelable: false },
    );
  });
}

async function cancelCompletionNotification(): Promise<void> {
  try {
    const notifications = await loadNotifications();
    await notifications?.cancelAllScheduledNotificationsAsync();
  } catch {
    // Cancellation must not block timer controls.
  }
}

function formatRemainingTime(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getPhaseLabel(phase: Session["phase"]): string {
  switch (phase) {
    case "shortBreak":
      return "Descanso corto";
    case "longBreak":
      return "Descanso largo";
    default:
      return "Estudio";
  }
}

function getCompletedPhaseLabel(session: Session): string {
  if (session.phase !== "study") {
    return "estudio";
  }

  return session.pomodorosCompleted === 0 ? "descanso largo" : "descanso corto";
}

export function SessionControls() {
  const [fontsLoaded] = useFonts({ CraftyGirls_400Regular });
  const { settings, status: settingsStatus } = useSettings();
  const [session, setSession] = useState<Session>(() =>
    createSession({ durationMs: STUDY_DURATION_MS }),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const sessionRef = useRef(session);
  const fontFamily = fontsLoaded ? "CraftyGirls_400Regular" : "sans-serif";
  const isCompleted = shouldShowCompleted(session);
  const phaseLabel = getPhaseLabel(session.phase);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    // Los ajustes se aplican solo cuando la sesión y los ajustes ya cargaron.
    // Primero se sincroniza con el tiempo real transcurrido; después se
    // actualizan las duraciones futuras sin tocar la fase ni el ciclo en curso.
    if (!isLoaded || settingsStatus !== "ready") {
      return;
    }

    const current = sessionRef.current;
    const updated = applySettingsToSession(
      syncSessionState(current, Date.now()),
      settings,
    );

    if (JSON.stringify(updated) === JSON.stringify(current)) {
      return;
    }

    sessionRef.current = updated;
    setSession(updated);
    void saveSession(updated);
  }, [isLoaded, settingsStatus, settings]);

  useEffect(() => {
    let isMounted = true;

    void loadSession(Date.now())
      .then((restoredSession) => {
        if (!isMounted) {
          return;
        }
        if (restoredSession) {
          setSession(restoredSession);
        }
        setIsLoaded(true);
      })
      .catch(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    let isMounted = true;
    let responseSubscription: { remove: () => void } | undefined;
    let handledResponseIdentifier: string | null = null;

    function handleCompletionResponse(
      notifications: NotificationsModule,
      response: import("expo-notifications").NotificationResponse,
    ) {
      const isCompletionNotification =
        response.notification.request.content.data?.type ===
        "session-completion";
      const isOpenAction =
        response.actionIdentifier === notifications.DEFAULT_ACTION_IDENTIFIER ||
        response.actionIdentifier === NOTIFICATION_STOP_ACTION_ID;

      if (!isCompletionNotification || !isOpenAction) {
        return;
      }

      const responseIdentifier = response.notification.request.identifier;
      if (responseIdentifier === handledResponseIdentifier) {
        return;
      }
      handledResponseIdentifier = responseIdentifier;

      void loadSession(Date.now()).then((restoredSession) => {
        if (isMounted && restoredSession) {
          setSession(restoredSession);
        }
      });

      void notifications
        .dismissNotificationAsync(response.notification.request.identifier)
        .catch(() => undefined);
      void notifications
        .clearLastNotificationResponseAsync()
        .catch(() => undefined);
    }

    void loadNotifications().then(async (notifications) => {
      if (!notifications || !isMounted) {
        return;
      }

      responseSubscription =
        notifications.addNotificationResponseReceivedListener((response) =>
          handleCompletionResponse(notifications, response),
        );

      const lastResponse =
        await notifications.getLastNotificationResponseAsync();
      if (isMounted && lastResponse) {
        handleCompletionResponse(notifications, lastResponse);
      }
    });

    return () => {
      isMounted = false;
      responseSubscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!session.isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setSession((currentSession) =>
        currentSession.isRunning
          ? advanceSession(currentSession, Date.now())
          : currentSession,
      );
    }, 250);

    return () => clearInterval(timer);
  }, [session.isRunning]);

  useEffect(() => {
    if (session.isCompleted) {
      void saveSession(session);
    }
  }, [session]);

  useEffect(() => {
    if (
      session.phase === "longBreak" &&
      session.pomodorosCompleted >= session.pomodorosPerCycle - 1
    ) {
      void markNotificationCycleCompleted();
    }
  }, [session.phase, session.pomodorosCompleted, session.pomodorosPerCycle]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void loadSession(Date.now()).then((restoredSession) => {
          if (restoredSession) {
            setSession(restoredSession);
          }
        });
      } else if (nextState === "background") {
        void saveSession(sessionRef.current);
      }
    });

    return () => subscription.remove();
  }, []);

  async function prepareNotificationsForFirstStart(
    startedSession: Session,
  ): Promise<void> {
    try {
      const notifications = await loadNotifications();
      if (!notifications) {
        setNotificationMessage(
          "Las notificaciones no están disponibles. La sesión continuará y verás la fase terminada al volver.",
        );
        return;
      }

      await configureNotifications(notifications);
      let permission = await notifications.getPermissionsAsync();
      const hasRequestedPermission = await hasRequestedNotificationPermission();
      const hasCompletedCycle = await hasCompletedNotificationCycle();
      const isLaterCycle =
        hasCompletedCycle &&
        startedSession.phase === "study" &&
        startedSession.pomodorosCompleted === 0;
      const permissionState = permission.granted
        ? "granted"
        : permission.status === "denied"
          ? "denied"
          : "undetermined";
      const permissionAction = getNotificationPermissionAction(
        permissionState,
        hasRequestedPermission,
        isLaterCycle,
      );

      if (permissionAction === "request") {
        const shouldContinue = await confirmNotificationPermission();
        if (!shouldContinue) {
          setNotificationMessage(
            "La sesión continuará. Sin permiso, no recibirás avisos con la aplicación cerrada.",
          );
          return;
        }

        await markNotificationPermissionRequested();
        if (permission.canAskAgain) {
          permission = await notifications.requestPermissionsAsync();
        }
      } else if (permissionAction === "explain") {
        setNotificationMessage(
          "Para recibir avisos, activa las notificaciones de la aplicación en Ajustes. El temporizador seguirá funcionando.",
        );
        return;
      }

      if (!permission.granted) {
        setNotificationMessage(
          "Las notificaciones están desactivadas. La sesión continuará y verás la fase terminada al volver.",
        );
        return;
      }

      setNotificationMessage("");
      const scheduled = await scheduleCompletionNotification(
        startedSession,
        notifications,
      );
      if (!scheduled) {
        setNotificationMessage(
          "No se pudo programar el aviso. La sesión continuará y verás la fase terminada al volver.",
        );
      }
    } catch {
      setNotificationMessage(
        "No se pudo configurar el aviso. La sesión continuará y verás la fase terminada al volver.",
      );
    }
  }

  function handlePause() {
    const pausedSession = pauseSession(session, Date.now());
    setSession(pausedSession);
    void saveSession(pausedSession);
    void cancelCompletionNotification();
  }

  function handleResume() {
    const resumedSession = resumeSession(session, Date.now());
    setSession(resumedSession);
    setNotificationMessage("");
    void saveSession(resumedSession);
    void scheduleIfPermissionGranted(resumedSession).then((scheduled) => {
      if (!scheduled) {
        setNotificationMessage(
          "Las notificaciones están desactivadas. La sesión continuará y verás el aviso al volver.",
        );
      }
    });
  }

  function handleReset() {
    Alert.alert(
      "Reiniciar sesión",
      `¿Quieres volver al tiempo inicial de ${phaseLabel.toLowerCase()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: () => {
            const reset = resetSession(session, true);
            setSession(reset);
            setNotificationMessage("");
            void saveSession(reset);
            void cancelCompletionNotification();
          },
        },
      ],
      { cancelable: true },
    );
  }

  function handleResetNotificationStateForTesting() {
    Alert.alert(
      "Restablecer prueba de notificaciones",
      "Se borrarán solo las marcas locales de notificaciones. La sesión y su configuración no cambiarán. El permiso de Android debe restablecerse por separado en Ajustes.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restablecer",
          style: "destructive",
          onPress: () => {
            void resetNotificationStateForTesting()
              .then(() => {
                setNotificationMessage(
                  "Estado local restablecido. Revisa el permiso de notificaciones de Expo Go en Ajustes de Android antes de probar de nuevo.",
                );
              })
              .catch(() => {
                setNotificationMessage(
                  "No se pudo restablecer el estado local de notificaciones.",
                );
              });
          },
        },
      ],
      { cancelable: true },
    );
  }

  const imageSource =
    session.phase === "study"
      ? require("@/assets/images/puma_estudiando.png")
      : require("@/assets/images/puma_descansando.png");
  const statusText = session.isRunning
    ? session.phase === "study"
      ? "Estudiando"
      : `${phaseLabel} en curso`
    : session.isPaused
      ? `${phaseLabel} en pausa`
      : `${phaseLabel} lista para comenzar`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.brand, { fontFamily }]}>Academia Cotopaxi</Text>
        <Text style={[styles.heading, { fontFamily }]}>{phaseLabel}</Text>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
        <Text
          accessibilityLabel={`Tiempo restante ${formatRemainingTime(session.remainingMs)}`}
          style={[styles.timer, { fontFamily }]}
        >
          {formatRemainingTime(session.remainingMs)}
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.status, { fontFamily }]}
        >
          {isCompleted
            ? `Terminó ${getCompletedPhaseLabel(session)}. ${phaseLabel} queda lista para iniciar cuando tú decidas.`
            : statusText}
        </Text>
        <Text
          accessibilityLabel={`Pomodoros completados: ${session.pomodorosCompleted} de ${session.pomodorosPerCycle}`}
          style={[styles.progress, { fontFamily }]}
        >
          Pomodoros: {session.pomodorosCompleted}/{session.pomodorosPerCycle}
        </Text>
        {notificationMessage.length > 0 && (
          <Text style={[styles.permissionNotice, { fontFamily }]}>
            {notificationMessage}
          </Text>
        )}
        <View style={styles.actions}>
          {session.isRunning ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Pausar ${phaseLabel.toLowerCase()}`}
              onPress={handlePause}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.buttonText, { fontFamily }]}>Pausar</Text>
            </Pressable>
          ) : session.isPaused ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Reanudar ${phaseLabel.toLowerCase()}`}
              onPress={handleResume}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.buttonText, { fontFamily }]}>Reanudar</Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Iniciar ${phaseLabel.toLowerCase()}`}
              disabled={!isLoaded || settingsStatus === "loading"}
              onPress={() => {
                const startedSession = startSession(session, Date.now());
                setSession(startedSession);
                setNotificationMessage("");
                void saveSession(startedSession);
                void prepareNotificationsForFirstStart(startedSession);
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.buttonText, { fontFamily }]}>Iniciar</Text>
            </Pressable>
          )}
          {(session.isRunning || session.isPaused) && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Reiniciar ${phaseLabel.toLowerCase()}`}
              onPress={handleReset}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.secondaryButtonText, { fontFamily }]}>
                Reiniciar
              </Text>
            </Pressable>
          )}
        </View>
        {__DEV__ && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restablecer marcas de prueba de notificaciones"
            onPress={handleResetNotificationStateForTesting}
            style={styles.testResetButton}
          >
            <Text style={[styles.testResetButtonText, { fontFamily }]}>
              Restablecer notificaciones (prueba)
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#141759",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  brand: {
    color: "#F2D194",
    fontSize: 22,
  },
  heading: {
    color: "#F2F2F2",
    fontSize: 30,
    marginTop: 4,
  },
  image: {
    width: 220,
    height: 220,
    marginVertical: 12,
  },
  timer: {
    color: "#F2D194",
    fontSize: 52,
    fontVariant: ["tabular-nums"],
  },
  status: {
    color: "#F2F2F2",
    fontSize: 21,
    textAlign: "center",
    marginTop: 8,
    minHeight: 34,
  },
  progress: {
    color: "#F2F2F2",
    fontSize: 18,
    marginTop: 6,
  },
  permissionNotice: {
    color: "#F2D194",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  primaryButton: {
    minWidth: 180,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9A91A",
    paddingHorizontal: 24,
    marginTop: 20,
  },
  actions: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  secondaryButton: {
    minWidth: 180,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F2D194",
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: "#F2D194",
    fontSize: 21,
  },
  testResetButton: {
    minHeight: 44,
    justifyContent: "center",
    marginTop: 12,
  },
  testResetButtonText: {
    color: "#F2D194",
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#141759",
    fontSize: 21,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\themed-text.tsx
================================================

import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\themed-view.tsx
================================================

import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}


================================================
ðŸ“„ ARCHIVO: src\components\ui\collapsible.tsx
================================================

import { SymbolView } from 'expo-symbols';
import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <ThemedView>
      <Pressable
        style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]}
        onPress={() => setIsOpen((value) => !value)}>
        <ThemedView type="backgroundElement" style={styles.button}>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="bold"
            tintColor={theme.text}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </ThemedView>

        <ThemedText type="small">{title}</ThemedText>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressedHeading: {
    opacity: 0.7,
  },
  button: {
    width: Spacing.four,
    height: Spacing.four,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: Spacing.three,
    borderRadius: Spacing.three,
    marginLeft: Spacing.four,
    padding: Spacing.four,
  },
});


================================================
ðŸ“„ ARCHIVO: src\components\web-badge.tsx
================================================

import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}>
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.badgeImage}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  versionText: {
    textAlign: 'center',
  },
  badgeImage: {
    width: 123,
    aspectRatio: 123 / 24,
  },
});


================================================
ðŸ“„ ARCHIVO: src\constants\theme.ts
================================================

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;


================================================
ðŸ“„ ARCHIVO: src\context\settings-context.tsx
================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_SETTINGS, type Settings } from "@/domain/settings";
import { loadSettings, saveSettings } from "@/storage/settings-storage";

// "loading": leyendo el almacenamiento. "ready": ajustes cargados (guardados o
// predeterminados). "error": falló la lectura; se usan los predeterminados pero
// NO se afirma que la configuración guardada se haya cargado.
export type SettingsStatus = "loading" | "ready" | "error";

interface SettingsContextValue {
  settings: Settings;
  status: SettingsStatus;
  // Persiste primero; solo si la escritura tiene éxito publica los nuevos
  // valores. Si falla, propaga el error y deja intactos los ajustes aplicados.
  updateSettings: (next: Settings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [status, setStatus] = useState<SettingsStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    loadSettings()
      .then((loaded) => {
        if (isMounted) {
          setSettings(loaded);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = useCallback(async (next: Settings) => {
    await saveSettings(next);
    setSettings(next);
    setStatus("ready");
  }, []);

  const value = useMemo(
    () => ({ settings, status, updateSettings }),
    [settings, status, updateSettings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (context === null) {
    throw new Error("useSettings debe usarse dentro de SettingsProvider.");
  }

  return context;
}


================================================
ðŸ“„ ARCHIVO: src\domain\session.test.ts
================================================

import {
    applySettingsToSession,
    advanceSession,
    createSession,
    getNotificationPermissionAction,
    pauseSession,
    resetSession,
    resumeSession,
    shouldShowCompleted,
    startSession,
    syncSessionState,
} from "./session";
import { DEFAULT_SETTINGS } from "./settings";

describe("createSession", () => {
  it("creates a prepared study session with the cycle configuration", () => {
    expect(createSession({ durationMs: 25 * 60 * 1000 })).toEqual({
      durationMs: 25 * 60 * 1000,
      studyDurationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      phase: "study",
      pomodorosCompleted: 0,
      shortBreakDurationMs: 5 * 60 * 1000,
      longBreakDurationMs: 15 * 60 * 1000,
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 4,
      cycleStarted: false,
      status: "prepared",
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      lastUpdatedAt: null,
    });
  });

  it("uses configured break durations and cycle length", () => {
    expect(
      createSession({
        durationMs: 2_500,
        shortBreakDurationMs: 500,
        longBreakDurationMs: 1_500,
        pomodorosPerCycle: 3,
      }),
    ).toMatchObject({
      phase: "study",
      shortBreakDurationMs: 500,
      longBreakDurationMs: 1_500,
      pomodorosPerCycle: 3,
      pomodorosCompleted: 0,
      status: "prepared",
    });
  });
});

describe("startSession and advanceSession", () => {
  it("starts at the configured duration and records the start time", () => {
    const session = createSession({ durationMs: 2_500 });

    expect(startSession(session, 1_000)).toEqual({
      ...session,
      status: "running",
      isRunning: true,
      cycleStarted: true,
      lastUpdatedAt: 1_000,
    });
  });

  it("synchronizes elapsed time exactly across repeated updates", () => {
    const started = startSession(createSession({ durationMs: 10_000 }), 1_000);
    const once = syncSessionState(started, 4_333);
    const repeatedly = syncSessionState(
      syncSessionState(started, 2_222),
      4_333,
    );

    expect(repeatedly).toEqual(once);
    expect(repeatedly.remainingMs).toBe(6_667);
  });

  it("does not start a session that is already running or paused", () => {
    const prepared = createSession({ durationMs: 2_500 });
    const started = startSession(prepared, 1_000);
    const paused = pauseSession(started, 1_500);

    expect(startSession(started, 2_000)).toEqual(started);
    expect(startSession(paused, 2_000)).toEqual(paused);
  });

  it("subtracts elapsed time and finishes at zero without starting another phase", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const updated = advanceSession(started, 1_800);

    expect(updated.remainingMs).toBe(1_700);
    expect(updated.isRunning).toBe(true);

    const finished = advanceSession(updated, 3_500);

    expect(finished).toEqual({
      ...updated,
      durationMs: 5 * 60 * 1000,
      remainingMs: 5 * 60 * 1000,
      phase: "shortBreak",
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
    expect(finished.isRunning).toBe(false);
  });

  it("prepares the next phase when synchronization happens after the deadline", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const recoveredLate = syncSessionState(started, 6_000);

    expect(recoveredLate).toMatchObject({
      phase: "shortBreak",
      remainingMs: 5 * 60 * 1000,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("reports completion only after the countdown reaches zero", () => {
    const started = startSession(createSession({ durationMs: 500 }), 1_000);

    expect(shouldShowCompleted(advanceSession(started, 1_499))).toBe(false);
    expect(shouldShowCompleted(advanceSession(started, 1_500))).toBe(true);
  });

  it("allows explicitly starting the prepared phase after a study phase ends", () => {
    const study = startSession(createSession({ durationMs: 500 }), 1_000);
    const preparedBreak = advanceSession(study, 1_500);

    expect(startSession(preparedBreak, 2_000)).toMatchObject({
      phase: "shortBreak",
      status: "running",
      isRunning: true,
      isCompleted: false,
      lastUpdatedAt: 2_000,
    });
  });

  it("restarts a completed legacy study snapshot when the user starts it", () => {
    const completedLegacySession = {
      ...createSession({ durationMs: 2_500 }),
      remainingMs: 0,
      status: "completed" as const,
      isCompleted: true,
      lastUpdatedAt: 2_500,
    };

    expect(startSession(completedLegacySession, 3_000)).toMatchObject({
      durationMs: 2_500,
      remainingMs: 2_500,
      status: "running",
      isRunning: true,
      isCompleted: false,
      lastUpdatedAt: 3_000,
    });
  });
});

describe("study phase transitions", () => {
  const config = {
    durationMs: 1_000,
    shortBreakDurationMs: 300,
    longBreakDurationMs: 900,
    pomodorosPerCycle: 4,
  };

  it("prepares a short break before reaching the long-break threshold", () => {
    const started = startSession(createSession(config), 0);

    expect(advanceSession(started, 1_000)).toMatchObject({
      phase: "shortBreak",
      durationMs: 300,
      remainingMs: 300,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("prepares a long break at the configured threshold without starting it", () => {
    const session = {
      ...createSession(config),
      pomodorosCompleted: 3,
    };
    const started = startSession(session, 0);

    expect(advanceSession(started, 1_000)).toMatchObject({
      phase: "longBreak",
      durationMs: 900,
      remainingMs: 900,
      pomodorosCompleted: 3,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("increments the counter when a short break ends and prepares study", () => {
    const session = {
      ...createSession(config),
      phase: "shortBreak" as const,
      durationMs: config.shortBreakDurationMs,
      remainingMs: config.shortBreakDurationMs,
    };
    const started = startSession(session, 0);

    expect(advanceSession(started, 300)).toMatchObject({
      phase: "study",
      durationMs: config.durationMs,
      remainingMs: config.durationMs,
      pomodorosCompleted: 1,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("keeps three completed pomodoros during long break and resets after it ends", () => {
    const session = {
      ...createSession(config),
      phase: "longBreak" as const,
      durationMs: config.longBreakDurationMs,
      remainingMs: config.longBreakDurationMs,
      pomodorosCompleted: 3,
    };
    const started = startSession(session, 0);
    const duringBreak = advanceSession(started, 300);

    expect(duringBreak).toMatchObject({
      phase: "longBreak",
      pomodorosCompleted: 3,
      remainingMs: 600,
      status: "running",
    });
    expect(advanceSession(duringBreak, 1_200)).toMatchObject({
      phase: "study",
      durationMs: config.durationMs,
      remainingMs: config.durationMs,
      pomodorosCompleted: 0,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });
});

describe("applySettingsToSession", () => {
  it("applies settings to a prepared phase before the first cycle starts", () => {
    const session = createSession({ durationMs: 25 * 60 * 1000 });

    expect(
      applySettingsToSession(session, {
        studyDurationMinutes: 30,
        shortBreakDurationMinutes: 8,
        longBreakDurationMinutes: 20,
        pomodorosPerCycle: 6,
      }),
    ).toMatchObject({
      studyDurationMs: 30 * 60 * 1000,
      durationMs: 30 * 60 * 1000,
      remainingMs: 30 * 60 * 1000,
      shortBreakDurationMs: 8 * 60 * 1000,
      longBreakDurationMs: 20 * 60 * 1000,
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 6,
      cycleStarted: false,
    });
  });

  it("keeps the running phase snapshot and uses new durations for future phases", () => {
    const started = startSession(
      createSession({ durationMs: 25 * 60 * 1000 }),
      0,
    );
    const updated = applySettingsToSession(started, {
      studyDurationMinutes: 40,
      shortBreakDurationMinutes: 8,
      longBreakDurationMinutes: 20,
      pomodorosPerCycle: 6,
    });

    expect(updated).toMatchObject({
      durationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      studyDurationMs: 40 * 60 * 1000,
      shortBreakDurationMs: 8 * 60 * 1000,
      longBreakDurationMs: 20 * 60 * 1000,
      cycleStarted: true,
    });
    expect(advanceSession(updated, 25 * 60 * 1000)).toMatchObject({
      phase: "shortBreak",
      durationMs: 8 * 60 * 1000,
      remainingMs: 8 * 60 * 1000,
    });
  });

  it("keeps the active cycle threshold and adopts the pending value after long break", () => {
    const started = startSession(
      {
        ...createSession({
          durationMs: 60_000,
          longBreakDurationMs: 900_000,
          pomodorosPerCycle: 6,
        }),
        pomodorosCompleted: 5,
      },
      0,
    );
    const updated = applySettingsToSession(started, {
      ...DEFAULT_SETTINGS,
      pomodorosPerCycle: 2,
    });

    expect(updated).toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
    });

    const preparedLongBreak = advanceSession(updated, 60_000);
    expect(preparedLongBreak).toMatchObject({
      phase: "longBreak",
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
    });

    expect(advanceSession(startSession(preparedLongBreak, 60_000), 960_000))
      .toMatchObject({
        phase: "study",
        pomodorosCompleted: 0,
        pomodorosPerCycle: 2,
        pendingPomodorosPerCycle: 2,
        cycleStarted: false,
      });
  });

  it("preserves the active phase and cycle when restoring default settings", () => {
    const session = startSession(
      {
        ...createSession({
          durationMs: 30 * 60 * 1000,
          pomodorosPerCycle: 6,
        }),
        remainingMs: 20 * 60 * 1000,
        pomodorosCompleted: 2,
      },
      1_000,
    );

    expect(applySettingsToSession(session, DEFAULT_SETTINGS)).toMatchObject({
      durationMs: 30 * 60 * 1000,
      remainingMs: 20 * 60 * 1000,
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 4,
      studyDurationMs: 25 * 60 * 1000,
      shortBreakDurationMs: 5 * 60 * 1000,
      longBreakDurationMs: 15 * 60 * 1000,
    });
  });
});

describe("applying saved settings to an active session", () => {
  const newSettings = {
    studyDurationMinutes: 40,
    shortBreakDurationMinutes: 10,
    longBreakDurationMinutes: 30,
    pomodorosPerCycle: 6,
  };

  it("keeps the snapshot and remaining time of a paused phase", () => {
    const paused = pauseSession(
      startSession(createSession({ durationMs: 25 * 60 * 1000 }), 0),
      5 * 60 * 1000,
    );

    const updated = applySettingsToSession(paused, newSettings);

    expect(updated).toMatchObject({
      status: "paused",
      isPaused: true,
      durationMs: 25 * 60 * 1000,
      remainingMs: 20 * 60 * 1000,
      studyDurationMs: 40 * 60 * 1000,
      shortBreakDurationMs: 10 * 60 * 1000,
      longBreakDurationMs: 30 * 60 * 1000,
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
    });
  });

  it("uses the new break duration when the study phase ended before the change", () => {
    const started = startSession(createSession({ durationMs: 60_000 }), 0);
    const synced = syncSessionState(started, 60_000);

    expect(synced).toMatchObject({
      phase: "shortBreak",
      durationMs: 5 * 60 * 1000,
      status: "prepared",
    });
    expect(applySettingsToSession(synced, newSettings)).toMatchObject({
      phase: "shortBreak",
      durationMs: 10 * 60 * 1000,
      remainingMs: 10 * 60 * 1000,
      status: "prepared",
      isRunning: false,
    });
  });

  it("does not start a prepared phase when settings are applied", () => {
    const prepared = createSession({ durationMs: 25 * 60 * 1000 });

    expect(applySettingsToSession(prepared, newSettings)).toMatchObject({
      status: "prepared",
      isRunning: false,
      lastUpdatedAt: null,
    });
  });

  it("returns the same session when the same settings are applied again", () => {
    const once = applySettingsToSession(
      startSession(createSession({ durationMs: 60_000 }), 0),
      newSettings,
    );

    expect(applySettingsToSession(once, newSettings)).toEqual(once);
  });
});

describe("cycle size while the cycle has not started", () => {
  const sixPomodoros = { ...DEFAULT_SETTINGS, pomodorosPerCycle: 6 };

  it("applies a new cycle size after the first study timer was started and reset", () => {
    const started = startSession(createSession({ durationMs: 25 * 60_000 }), 0);
    const reset = resetSession(started, true);

    expect(applySettingsToSession(reset, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 6,
      cycleStarted: false,
    });
  });

  it("keeps the cycle size while the study timer is running", () => {
    const started = startSession(createSession({ durationMs: 25 * 60_000 }), 0);

    expect(applySettingsToSession(started, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
    });
  });

  it("keeps the cycle size while the study timer is paused", () => {
    const paused = pauseSession(
      startSession(createSession({ durationMs: 25 * 60_000 }), 0),
      1_000,
    );

    expect(applySettingsToSession(paused, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
    });
  });

  it("keeps the cycle size once a pomodoro is completed, even with a stale flag", () => {
    const session = {
      ...createSession({ durationMs: 25 * 60_000 }),
      pomodorosCompleted: 1,
      cycleStarted: false,
    };

    expect(applySettingsToSession(session, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
      cycleStarted: true,
    });
  });

  it("adopts the pending cycle size when an untouched cycle is reset", () => {
    const running = applySettingsToSession(
      startSession(createSession({ durationMs: 25 * 60_000 }), 0),
      sixPomodoros,
    );

    expect(resetSession(running, true)).toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 6,
      cycleStarted: false,
    });
  });

  it("keeps the active cycle size when resetting in the middle of a cycle", () => {
    const running = applySettingsToSession(
      startSession(
        { ...createSession({ durationMs: 25 * 60_000 }), pomodorosCompleted: 2 },
        0,
      ),
      sixPomodoros,
    );

    expect(resetSession(running, true)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
      cycleStarted: true,
    });
  });
});

describe("pauseSession and resumeSession", () => {
  it("preserves remaining time during pause and resumes from that amount", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const paused = pauseSession(started, 1_600);

    expect(paused).toMatchObject({
      remainingMs: 1_900,
      status: "paused",
      isRunning: false,
      isPaused: true,
      isCompleted: false,
      lastUpdatedAt: 1_600,
    });
    expect(advanceSession(paused, 5_000)).toEqual(paused);

    const resumed = resumeSession(paused, 8_000);

    expect(resumed).toMatchObject({
      remainingMs: 1_900,
      status: "running",
      isRunning: true,
      isPaused: false,
      lastUpdatedAt: 8_000,
    });
    expect(advanceSession(resumed, 8_500).remainingMs).toBe(1_400);
  });
});

describe("resetSession", () => {
  it("keeps the running session unchanged when reset is canceled", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const updated = advanceSession(started, 1_600);

    expect(resetSession(updated, false)).toEqual(updated);
  });

  it("restores the configured duration and idle state when confirmed", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const paused = pauseSession(started, 1_600);

    expect(resetSession(paused, true)).toEqual({
      ...paused,
      remainingMs: 2_500,
      cycleStarted: false,
      status: "prepared",
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      lastUpdatedAt: null,
    });
  });

  it("does not restart a completed session", () => {
    const started = startSession(createSession({ durationMs: 500 }), 1_000);
    const finished = advanceSession(started, 1_500);

    expect(resetSession(finished, true)).toEqual(finished);
  });
});

describe("notification permission policy", () => {
  it("requests permission only before its first request", () => {
    expect(getNotificationPermissionAction("undetermined", false, false)).toBe(
      "request",
    );
    expect(getNotificationPermissionAction("denied", true, false)).toBe("none");
  });

  it("does not request an already granted permission", () => {
    expect(getNotificationPermissionAction("granted", false, false)).toBe(
      "none",
    );
  });

  it("explains how to enable denied notifications at a later cycle", () => {
    expect(getNotificationPermissionAction("denied", true, true)).toBe(
      "explain",
    );
  });

  it("keeps the session start available when notification permission is denied", () => {
    const session = createSession({ durationMs: 2_500 });

    expect(getNotificationPermissionAction("denied", true, false)).toBe("none");
    expect(startSession(session, 1_000)).toMatchObject({
      status: "running",
      isRunning: true,
      lastUpdatedAt: 1_000,
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\domain\session.ts
================================================

import type { Settings } from "./settings";

export type SessionPhase = "study" | "shortBreak" | "longBreak";

export type SessionStatus = "prepared" | "running" | "paused" | "completed";

export interface Session {
  studyDurationMs: number;
  durationMs: number;
  remainingMs: number;
  phase: SessionPhase;
  pomodorosCompleted: number;
  shortBreakDurationMs: number;
  longBreakDurationMs: number;
  pomodorosPerCycle: number;
  pendingPomodorosPerCycle?: number;
  cycleStarted?: boolean;
  status: SessionStatus;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  lastUpdatedAt: number | null;
}

export interface SessionConfig {
  durationMs: number;
  shortBreakDurationMs?: number;
  longBreakDurationMs?: number;
  pomodorosPerCycle?: number;
}

export type NotificationPermissionState = "granted" | "denied" | "undetermined";

export type NotificationPermissionAction = "request" | "explain" | "none";

export function getNotificationPermissionAction(
  permissionState: NotificationPermissionState,
  hasRequestedPermission: boolean,
  isLaterCycle: boolean,
): NotificationPermissionAction {
  if (permissionState === "granted") {
    return "none";
  }

  if (!hasRequestedPermission) {
    return "request";
  }

  return isLaterCycle ? "explain" : "none";
}

export function createSession(config: SessionConfig): Session {
  return {
    studyDurationMs: config.durationMs,
    durationMs: config.durationMs,
    remainingMs: config.durationMs,
    phase: "study",
    pomodorosCompleted: 0,
    shortBreakDurationMs: config.shortBreakDurationMs ?? 5 * 60 * 1000,
    longBreakDurationMs: config.longBreakDurationMs ?? 15 * 60 * 1000,
    pomodorosPerCycle: config.pomodorosPerCycle ?? 4,
    pendingPomodorosPerCycle: config.pomodorosPerCycle ?? 4,
    cycleStarted: false,
    status: "prepared",
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    lastUpdatedAt: null,
  };
}

export function startSession(session: Session, now: number): Session {
  if (session.status !== "prepared" && session.status !== "completed") {
    return session;
  }

  return {
    ...session,
    remainingMs:
      session.status === "completed" ? session.durationMs : session.remainingMs,
    status: "running",
    isRunning: true,
    isPaused: false,
    isCompleted: false,
    cycleStarted: true,
    lastUpdatedAt: now,
  };
}

function prepareNextPhase(session: Session): Session {
  let phase: SessionPhase;
  let pomodorosCompleted = session.pomodorosCompleted;
  let durationMs: number;
  let pomodorosPerCycle = session.pomodorosPerCycle;
  let pendingPomodorosPerCycle =
    session.pendingPomodorosPerCycle ?? session.pomodorosPerCycle;
  let cycleStarted = session.cycleStarted ?? false;

  if (session.phase === "study") {
    phase =
      pomodorosCompleted >= session.pomodorosPerCycle - 1
        ? "longBreak"
        : "shortBreak";
    durationMs =
      phase === "longBreak"
        ? session.longBreakDurationMs
        : session.shortBreakDurationMs;
  } else {
    phase = "study";
    durationMs = session.studyDurationMs;
    pomodorosCompleted =
      session.phase === "shortBreak" ? pomodorosCompleted + 1 : 0;

    if (session.phase === "longBreak") {
      pomodorosPerCycle = pendingPomodorosPerCycle;
      pendingPomodorosPerCycle = pomodorosPerCycle;
      cycleStarted = false;
    }
  }

  return {
    ...session,
    phase,
    pomodorosCompleted,
    pomodorosPerCycle,
    pendingPomodorosPerCycle,
    cycleStarted,
    durationMs,
    remainingMs: durationMs,
    status: "prepared",
    isRunning: false,
    isPaused: false,
    isCompleted: true,
    lastUpdatedAt: null,
  };
}

export function applySettingsToSession(
  session: Session,
  settings: Settings,
): Session {
  // El ciclo no ha comenzado si es estudio con 0 pomodoros y sin temporizador
  // corriendo ni en pausa (también tras iniciar y reiniciar). Se deduce del
  // estado y no de la bandera guardada (decisión 10, RF-10).
  const cycleStarted =
    session.phase !== "study" ||
    session.pomodorosCompleted > 0 ||
    session.isRunning ||
    session.isPaused;
  const studyDurationMs = settings.studyDurationMinutes * 60_000;
  const shortBreakDurationMs = settings.shortBreakDurationMinutes * 60_000;
  const longBreakDurationMs = settings.longBreakDurationMinutes * 60_000;
  const isPhasePrepared =
    session.status === "prepared" || session.status === "completed";

  const durationMs = isPhasePrepared
    ? session.phase === "study"
      ? studyDurationMs
      : session.phase === "shortBreak"
        ? shortBreakDurationMs
        : longBreakDurationMs
    : session.durationMs;

  return {
    ...session,
    studyDurationMs,
    shortBreakDurationMs,
    longBreakDurationMs,
    durationMs,
    remainingMs: isPhasePrepared ? durationMs : session.remainingMs,
    pomodorosPerCycle: cycleStarted
      ? session.pomodorosPerCycle
      : settings.pomodorosPerCycle,
    pendingPomodorosPerCycle: settings.pomodorosPerCycle,
    cycleStarted,
  };
}

export function syncSessionState(session: Session, now: number): Session {
  if (!session.isRunning || session.lastUpdatedAt === null) {
    return session;
  }

  const elapsedMs = Math.max(0, now - session.lastUpdatedAt);
  const remainingMs = Math.max(0, session.remainingMs - elapsedMs);

  if (remainingMs === 0) {
    return prepareNextPhase(session);
  }

  return {
    ...session,
    remainingMs,
    status: "running",
    isRunning: true,
    isCompleted: false,
    lastUpdatedAt: now,
  };
}

export function advanceSession(session: Session, now: number): Session {
  return syncSessionState(session, now);
}

export function pauseSession(session: Session, now: number): Session {
  const updatedSession = advanceSession(session, now);

  if (!updatedSession.isRunning) {
    return updatedSession;
  }

  return {
    ...updatedSession,
    status: "paused",
    isRunning: false,
    isPaused: true,
  };
}

export function resumeSession(session: Session, now: number): Session {
  if (!session.isPaused || session.isCompleted) {
    return session;
  }

  return {
    ...session,
    status: "running",
    isRunning: true,
    isPaused: false,
    lastUpdatedAt: now,
  };
}

export function resetSession(session: Session, confirmed: boolean): Session {
  if (!confirmed || session.isCompleted) {
    return session;
  }

  const isCycleUntouched =
    session.phase === "study" && session.pomodorosCompleted === 0;

  return {
    ...session,
    // Un reinicio que devuelve el ciclo a 0 adopta el valor pendiente.
    ...(isCycleUntouched
      ? {
          pomodorosPerCycle:
            session.pendingPomodorosPerCycle ?? session.pomodorosPerCycle,
          cycleStarted: false,
        }
      : {}),
    remainingMs: session.durationMs,
    status: "prepared",
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    lastUpdatedAt: null,
  };
}

export function shouldShowCompleted(session: Session): boolean {
  return session.isCompleted;
}


================================================
ðŸ“„ ARCHIVO: src\domain\settings.test.ts
================================================

import {
  DEFAULT_SETTINGS,
  SettingsDraft,
  validateSettings,
} from "./settings";

describe("settings defaults", () => {
  it("uses the approved default values", () => {
    expect(DEFAULT_SETTINGS).toEqual({
      studyDurationMinutes: 25,
      shortBreakDurationMinutes: 5,
      longBreakDurationMinutes: 15,
      pomodorosPerCycle: 4,
    });
  });
});

describe("validateSettings", () => {
  it("accepts the inclusive boundaries of every setting", () => {
    expect(
      validateSettings({
        studyDurationMinutes: "1",
        shortBreakDurationMinutes: "1",
        longBreakDurationMinutes: "120",
        pomodorosPerCycle: "12",
      }),
    ).toEqual({
      settings: {
        studyDurationMinutes: 1,
        shortBreakDurationMinutes: 1,
        longBreakDurationMinutes: 120,
        pomodorosPerCycle: 12,
      },
      errors: {},
    });
  });

  it.each([
    ["studyDurationMinutes", 1, 120],
    ["shortBreakDurationMinutes", 1, 60],
    ["longBreakDurationMinutes", 1, 120],
    ["pomodorosPerCycle", 1, 12],
  ] as const)(
    "rejects invalid input for %s and reports its integer range",
    (field, minimum, maximum) => {
      const invalidValues = ["", "   ", "abc", "1.5", "0", `${minimum - 1}`, `${maximum + 1}`];

      for (const value of invalidValues) {
        const draft: SettingsDraft = {
          studyDurationMinutes: "25",
          shortBreakDurationMinutes: "5",
          longBreakDurationMinutes: "15",
          pomodorosPerCycle: "4",
          [field]: value,
        };

        const result = validateSettings(draft);

        expect(result.settings).toBeNull();
        expect(result.errors).toEqual({
          [field]: expect.stringContaining(`${minimum}-${maximum}`),
        });
      }
    },
  );

  it("reports errors for every invalid field and returns no settings", () => {
    const result = validateSettings({
      studyDurationMinutes: "",
      shortBreakDurationMinutes: "61",
      longBreakDurationMinutes: "1.5",
      pomodorosPerCycle: "0",
    });

    expect(result.settings).toBeNull();
    expect(result.errors).toEqual({
      studyDurationMinutes: expect.stringContaining("1-120"),
      shortBreakDurationMinutes: expect.stringContaining("1-60"),
      longBreakDurationMinutes: expect.stringContaining("1-120"),
      pomodorosPerCycle: expect.stringContaining("1-12"),
    });
  });
});


================================================
ðŸ“„ ARCHIVO: src\domain\settings.ts
================================================

export interface Settings {
  studyDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  pomodorosPerCycle: number;
}

export interface SettingsDraft {
  studyDurationMinutes: string;
  shortBreakDurationMinutes: string;
  longBreakDurationMinutes: string;
  pomodorosPerCycle: string;
}

export type SettingsField = keyof SettingsDraft;

export interface SettingsValidationResult {
  settings: Settings | null;
  errors: Partial<Record<SettingsField, string>>;
}

export const DEFAULT_SETTINGS: Settings = {
  studyDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  pomodorosPerCycle: 4,
};

const SETTINGS_RANGES: Record<SettingsField, { minimum: number; maximum: number }> = {
  studyDurationMinutes: { minimum: 1, maximum: 120 },
  shortBreakDurationMinutes: { minimum: 1, maximum: 60 },
  longBreakDurationMinutes: { minimum: 1, maximum: 120 },
  pomodorosPerCycle: { minimum: 1, maximum: 12 },
};

export function validateSettings(draft: SettingsDraft): SettingsValidationResult {
  const errors: SettingsValidationResult["errors"] = {};
  const settings = {} as Settings;

  for (const field of Object.keys(SETTINGS_RANGES) as SettingsField[]) {
    const { minimum, maximum } = SETTINGS_RANGES[field];
    const value = draft[field].trim();

    if (!/^\d+$/.test(value)) {
      errors[field] = `Ingresa un número entero entre ${minimum}-${maximum}.`;
      continue;
    }

    const parsedValue = Number(value);
    if (parsedValue < minimum || parsedValue > maximum) {
      errors[field] = `Ingresa un número entero entre ${minimum}-${maximum}.`;
      continue;
    }

    settings[field] = parsedValue;
  }

  return Object.keys(errors).length > 0 ? { settings: null, errors } : { settings, errors };
}


================================================
ðŸ“„ ARCHIVO: src\hooks\use-color-scheme.ts
================================================

export { useColorScheme } from 'react-native';


================================================
ðŸ“„ ARCHIVO: src\hooks\use-color-scheme.web.ts
================================================

import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}


================================================
ðŸ“„ ARCHIVO: src\hooks\use-theme.ts
================================================

/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}


================================================
ðŸ“„ ARCHIVO: src\storage\session-storage.test.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSession, startSession, type Session } from "../domain/session";
import {
    hasCompletedNotificationCycle,
    hasRequestedNotificationPermission,
    loadSession,
    markNotificationCycleCompleted,
    markNotificationPermissionRequested,
    resetNotificationStateForTesting,
    saveSession,
} from "./session-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedStorage = jest.mocked(AsyncStorage);

describe("session storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves the complete session as JSON", async () => {
    const session = createSession({ durationMs: 10_000 });

    await saveSession(session);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(session),
    );
  });

  it("persists the current phase and completed-pomodoro count", async () => {
    const session: Session = {
      ...createSession({ durationMs: 10_000 }),
      phase: "longBreak",
      durationMs: 900_000,
      remainingMs: 600_000,
      pomodorosCompleted: 3,
    };

    await saveSession(session);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(session),
    );
  });

  it("subtracts elapsed time when recovering a running session", async () => {
    const running = startSession(createSession({ durationMs: 10_000 }), 1_000);
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(running));

    await expect(loadSession(4_000)).resolves.toEqual({
      ...running,
      remainingMs: 7_000,
      lastUpdatedAt: 4_000,
    });
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify({
        ...running,
        remainingMs: 7_000,
        lastUpdatedAt: 4_000,
      }),
    );
  });

  it("keeps a paused session unchanged when recovering it", async () => {
    const paused: Session = {
      ...createSession({ durationMs: 10_000 }),
      remainingMs: 6_000,
      isPaused: true,
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(paused));

    await expect(loadSession(9_000)).resolves.toEqual(paused);
  });

  it("normalizes a saved session without cycle fields as prepared study with zero progress", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        durationMs: 10_000,
        remainingMs: 6_000,
        isRunning: false,
        isPaused: false,
        isCompleted: false,
        lastUpdatedAt: null,
      }),
    );

    await expect(loadSession(9_000)).resolves.toMatchObject({
      studyDurationMs: 10_000,
      phase: "study",
      pomodorosCompleted: 0,
      shortBreakDurationMs: 5 * 60 * 1000,
      longBreakDurationMs: 15 * 60 * 1000,
      pomodorosPerCycle: 4,
      status: "prepared",
    });
  });

  it("allows starting a completed legacy study snapshot after restoring it", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        durationMs: 25 * 60 * 1000,
        remainingMs: 0,
        isRunning: false,
        isPaused: false,
        isCompleted: true,
        lastUpdatedAt: 25 * 60 * 1000,
      }),
    );

    const restored = await loadSession(30 * 60 * 1000);

    expect(startSession(restored as Session, 30 * 60 * 1000)).toMatchObject({
      phase: "study",
      durationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      pomodorosCompleted: 0,
      status: "running",
      isRunning: true,
      isCompleted: false,
      lastUpdatedAt: 30 * 60 * 1000,
    });
  });

  it("persists the next prepared phase when a break expired while closed", async () => {
    const expiredShortBreak: Session = {
      ...createSession({ durationMs: 10_000, shortBreakDurationMs: 300 }),
      phase: "shortBreak",
      durationMs: 300,
      remainingMs: 300,
      isRunning: true,
      status: "running",
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(expiredShortBreak));

    const restored = await loadSession(1_300);

    expect(restored).toMatchObject({
      phase: "study",
      durationMs: 10_000,
      remainingMs: 10_000,
      pomodorosCompleted: 1,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(restored),
    );

    mockedStorage.getItem.mockResolvedValueOnce(JSON.stringify(restored));
    await expect(loadSession(9_000)).resolves.toEqual(restored);
  });

  it("keeps the pending cycle threshold and cycle-started flag of a paused session", async () => {
    const paused: Session = {
      ...createSession({ durationMs: 10_000, pomodorosPerCycle: 6 }),
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
      cycleStarted: true,
      remainingMs: 6_000,
      status: "paused",
      isPaused: true,
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(paused));

    await expect(loadSession(9_000)).resolves.toEqual(paused);
    expect(mockedStorage.setItem).not.toHaveBeenCalled();
  });

  it("keeps the active cycle threshold when recovering a running session after time away", async () => {
    const running = startSession(
      {
        ...createSession({ durationMs: 60_000, pomodorosPerCycle: 6 }),
        pendingPomodorosPerCycle: 2,
      },
      0,
    );
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(running));

    await expect(loadSession(10_000)).resolves.toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
      cycleStarted: true,
      remainingMs: 50_000,
    });
  });

  it("derives the pending threshold and cycle-started flag for sessions saved before they existed", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        studyDurationMs: 60_000,
        durationMs: 900_000,
        remainingMs: 900_000,
        phase: "longBreak",
        pomodorosCompleted: 3,
        shortBreakDurationMs: 300_000,
        longBreakDurationMs: 900_000,
        pomodorosPerCycle: 4,
        status: "prepared",
        isRunning: false,
        isPaused: false,
        isCompleted: true,
        lastUpdatedAt: null,
      }),
    );

    await expect(loadSession(9_000)).resolves.toMatchObject({
      phase: "longBreak",
      pomodorosCompleted: 3,
      remainingMs: 900_000,
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 4,
      cycleStarted: true,
    });
  });

  it("treats a legacy untouched study snapshot as a cycle that has not started", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        durationMs: 10_000,
        remainingMs: 10_000,
        isRunning: false,
        isPaused: false,
        isCompleted: false,
        lastUpdatedAt: null,
      }),
    );

    await expect(loadSession(9_000)).resolves.toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 4,
      cycleStarted: false,
    });
  });

  it("returns null when no session has been saved", async () => {
    mockedStorage.getItem.mockResolvedValue(null);

    await expect(loadSession(9_000)).resolves.toBeNull();
  });

  it("persists notification permission and first-cycle state separately", async () => {
    mockedStorage.getItem.mockResolvedValue(null);
    await expect(hasRequestedNotificationPermission()).resolves.toBe(false);
    await expect(hasCompletedNotificationCycle()).resolves.toBe(false);

    await markNotificationPermissionRequested();
    await markNotificationCycleCompleted();

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/notification-permission-requested",
      "true",
    );
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/notification-cycle-completed",
      "true",
    );
  });

  it("resets only notification test flags without deleting the saved session", async () => {
    await resetNotificationStateForTesting();

    expect(mockedStorage.removeItem).toHaveBeenNthCalledWith(
      1,
      "@app_pomodoro/notification-permission-requested",
    );
    expect(mockedStorage.removeItem).toHaveBeenNthCalledWith(
      2,
      "@app_pomodoro/notification-cycle-completed",
    );
    expect(mockedStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(mockedStorage.removeItem).not.toHaveBeenCalledWith(
      "@app_pomodoro/session",
    );
  });
});


================================================
ðŸ“„ ARCHIVO: src\storage\session-storage.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    advanceSession,
    type Session,
    type SessionStatus,
} from "../domain/session";

const SESSION_STORAGE_KEY = "@app_pomodoro/session";
const NOTIFICATION_PERMISSION_REQUESTED_KEY =
  "@app_pomodoro/notification-permission-requested";
const NOTIFICATION_CYCLE_COMPLETED_KEY =
  "@app_pomodoro/notification-cycle-completed";

async function readFlag(key: string): Promise<boolean> {
  return (await AsyncStorage.getItem(key)) === "true";
}

export async function hasRequestedNotificationPermission(): Promise<boolean> {
  return readFlag(NOTIFICATION_PERMISSION_REQUESTED_KEY);
}

export async function markNotificationPermissionRequested(): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_PERMISSION_REQUESTED_KEY, "true");
}

export async function hasCompletedNotificationCycle(): Promise<boolean> {
  return readFlag(NOTIFICATION_CYCLE_COMPLETED_KEY);
}

export async function markNotificationCycleCompleted(): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_CYCLE_COMPLETED_KEY, "true");
}

export async function resetNotificationStateForTesting(): Promise<void> {
  await AsyncStorage.removeItem(NOTIFICATION_PERMISSION_REQUESTED_KEY);
  await AsyncStorage.removeItem(NOTIFICATION_CYCLE_COMPLETED_KEY);
}

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function normalizeSession(stored: Partial<Session>): Session {
  const status: SessionStatus =
    stored.status ??
    (stored.isCompleted
      ? "completed"
      : stored.isPaused
        ? "paused"
        : stored.isRunning
          ? "running"
          : "prepared");

  const phase = stored.phase ?? "study";
  const pomodorosCompleted = stored.pomodorosCompleted ?? 0;
  const pomodorosPerCycle = stored.pomodorosPerCycle ?? 4;

  return {
    studyDurationMs: stored.studyDurationMs ?? stored.durationMs!,
    durationMs: stored.durationMs!,
    remainingMs: stored.remainingMs!,
    phase,
    pomodorosCompleted,
    shortBreakDurationMs: stored.shortBreakDurationMs ?? 5 * 60 * 1000,
    longBreakDurationMs: stored.longBreakDurationMs ?? 15 * 60 * 1000,
    pomodorosPerCycle,
    // Instantáneas de ciclo (HU-005): se conservan si existen; en sesiones
    // guardadas antes de HU-005 se derivan sin alterar la fase ni el ciclo.
    pendingPomodorosPerCycle:
      stored.pendingPomodorosPerCycle ?? pomodorosPerCycle,
    cycleStarted:
      stored.cycleStarted ??
      (phase !== "study" ||
        pomodorosCompleted > 0 ||
        status === "running" ||
        status === "paused"),
    status,
    isRunning: stored.isRunning ?? status === "running",
    isPaused: stored.isPaused ?? status === "paused",
    isCompleted: stored.isCompleted ?? status === "completed",
    lastUpdatedAt: stored.lastUpdatedAt ?? null,
  };
}

export async function loadSession(now: number): Promise<Session | null> {
  const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

  if (storedSession === null) {
    return null;
  }

  const session = normalizeSession(
    JSON.parse(storedSession) as Partial<Session>,
  );
  const restoredSession = session.isRunning
    ? advanceSession(session, now)
    : session;

  if (JSON.stringify(restoredSession) !== storedSession) {
    await saveSession(restoredSession);
  }

  return restoredSession;
}


================================================
ðŸ“„ ARCHIVO: src\storage\settings-storage.test.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_SETTINGS, type Settings } from "../domain/settings";
import { loadSettings, saveSettings } from "./settings-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedStorage = jest.mocked(AsyncStorage);

describe("settings storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the defaults when no settings have been saved", async () => {
    mockedStorage.getItem.mockResolvedValue(null);

    await expect(loadSettings()).resolves.toEqual(DEFAULT_SETTINGS);
    expect(mockedStorage.setItem).not.toHaveBeenCalled();
  });

  it("saves and reloads all four settings", async () => {
    const settings: Settings = {
      studyDurationMinutes: 50,
      shortBreakDurationMinutes: 10,
      longBreakDurationMinutes: 30,
      pomodorosPerCycle: 6,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(settings));

    await saveSettings(settings);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/settings",
      JSON.stringify(settings),
    );
    await expect(loadSettings()).resolves.toEqual(settings);
  });

  it("persists the default settings when resetting", async () => {
    await saveSettings(DEFAULT_SETTINGS);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/settings",
      JSON.stringify(DEFAULT_SETTINGS),
    );
  });

  it("propagates a storage write failure", async () => {
    const error = new Error("storage unavailable");
    mockedStorage.setItem.mockRejectedValue(error);

    await expect(saveSettings(DEFAULT_SETTINGS)).rejects.toBe(error);
  });

  it("propagates a storage read failure", async () => {
    const error = new Error("storage unavailable");
    mockedStorage.getItem.mockRejectedValue(error);

    await expect(loadSettings()).rejects.toBe(error);
  });
});


================================================
ðŸ“„ ARCHIVO: src\storage\settings-storage.ts
================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_SETTINGS, type Settings } from "../domain/settings";

const SETTINGS_STORAGE_KEY = "@app_pomodoro/settings";

export async function loadSettings(): Promise<Settings> {
  const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

  if (storedSettings === null) {
    return DEFAULT_SETTINGS;
  }

  return JSON.parse(storedSettings) as Settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}


================================================
ðŸ“„ ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "types": ["jest"],
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
