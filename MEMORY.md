# MEMORY.md - Temporizador Pomodoro

Estado del trabajo entre sesiones. Máximo ~50 líneas.

## Estado actual

- T1–T8 de la spec 001 están marcadas; en la comprobación manual de T8 pasaron los puntos 1, 2, 3, 4, 5, 6, 8 y 9. El punto 7 (notificación con permiso concedido) sigue pendiente de probar en development build Android.
- Proyecto alineado con Expo SDK 57 / Expo Go de Play Store; Native Tabs usa el import `unstable-native-tabs` de Router 57.
- Jest 29 con `jest-expo` 57, AsyncStorage y notificaciones locales están instalados; Jest pasa 12 pruebas.

## Próximos pasos

- Cuando esté disponible el development build Android, verificar el punto 7 de T8 y registrar su resultado.
