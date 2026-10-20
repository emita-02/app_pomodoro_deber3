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
