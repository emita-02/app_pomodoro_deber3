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