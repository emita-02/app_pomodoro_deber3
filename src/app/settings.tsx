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
