import { CraftyGirls_400Regular } from "@expo-google-fonts/crafty-girls";
import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    AppState,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    advanceSession,
    createSession,
    pauseSession,
    resetSession,
    resumeSession,
    shouldShowCompleted,
    startSession,
    type Session,
} from "@/domain/session";
import { loadSession, saveSession } from "@/storage/session-storage";

const STUDY_DURATION_MS = 25 * 60 * 1000;
const NOTIFICATION_CHANNEL_ID = "session-completion";

type NotificationsModule = typeof import("expo-notifications");

async function loadNotifications(): Promise<NotificationsModule | null> {
  try {
    return await import("expo-notifications");
  } catch {
    return null;
  }
}

async function scheduleCompletionNotification(
  session: Session,
): Promise<boolean> {
  try {
    const notifications = await loadNotifications();
    if (!notifications) {
      return false;
    }

    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    await notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: "Sesión de estudio",
      importance: notifications.AndroidImportance.DEFAULT,
    });

    let permission = await notifications.getPermissionsAsync();
    if (!permission.granted && permission.canAskAgain) {
      permission = await notifications.requestPermissionsAsync();
    }

    if (!permission.granted) {
      return false;
    }

    const deadline =
      (session.lastUpdatedAt ?? Date.now()) + session.remainingMs;
    await notifications.scheduleNotificationAsync({
      content: {
        title: "Sesión terminada",
        body: "Finalizó tu sesión de estudio.",
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

export function SessionControls() {
  const [fontsLoaded] = useFonts({ CraftyGirls_400Regular });
  const [session, setSession] = useState<Session>(() =>
    createSession({ durationMs: STUDY_DURATION_MS }),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const sessionRef = useRef(session);
  const fontFamily = fontsLoaded ? "CraftyGirls_400Regular" : "sans-serif";
  const isCompleted = shouldShowCompleted(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

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

  function handleStart() {
    const startedSession = startSession(session, Date.now());
    setSession(startedSession);
    setNotificationMessage("");
    void saveSession(startedSession);
    void scheduleCompletionNotification(startedSession).then((scheduled) => {
      if (!scheduled) {
        setNotificationMessage(
          "Las notificaciones están desactivadas. La sesión continuará y verás el aviso al volver.",
        );
      }
    });
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
    void scheduleCompletionNotification(resumedSession).then((scheduled) => {
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
      "¿Quieres volver al tiempo inicial de estudio?",
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

  const imageSource = isCompleted
    ? require("@/assets/images/puma_saludo.png")
    : require("@/assets/images/puma_estudiando.png");
  const statusText = isCompleted
    ? "Sesión terminada"
    : session.isRunning
      ? "Estudiando"
      : session.isPaused
        ? "En pausa"
        : "Lista para comenzar";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.brand, { fontFamily }]}>Academia Cotopaxi</Text>
        <Text style={[styles.heading, { fontFamily }]}>Sesión de estudio</Text>
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
            ? "Tu sesión terminó. La siguiente fase queda lista para iniciar cuando tú decidas."
            : statusText}
        </Text>
        {notificationMessage.length > 0 && (
          <Text style={[styles.permissionNotice, { fontFamily }]}>
            {notificationMessage}
          </Text>
        )}
        {!isCompleted && (
          <View style={styles.actions}>
            {session.isRunning ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Pausar sesión de estudio"
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
                accessibilityLabel="Reanudar sesión de estudio"
                onPress={handleResume}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.buttonText, { fontFamily }]}>
                  Reanudar
                </Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Iniciar sesión de estudio"
                disabled={!isLoaded}
                onPress={handleStart}
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
                accessibilityLabel="Reiniciar sesión de estudio"
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
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#141759",
    fontSize: 21,
  },
});
