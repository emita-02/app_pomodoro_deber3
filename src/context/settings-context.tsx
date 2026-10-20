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
