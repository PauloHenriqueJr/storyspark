// Hook para feature flags com realtime
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  // Mapa por path para lidar com mudanças de grupo e entradas antigas no banco
  const [disabledByPath, setDisabledByPath] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const recomputeByPath = (flags: Record<string, boolean>) => {
    const byPath: Record<string, boolean> = {};
    for (const key of Object.keys(flags)) {
      // key format: `${group_name}-${page_path}`
      // page_path itself may contain hyphens, so we must NOT split blindly.
      const sepIndex = key.indexOf("-");
      if (sepIndex === -1) continue;
      const path = key.slice(sepIndex + 1);
      if (!path) continue;
      if (flags[key] === false) byPath[path] = true;
    }
    return byPath;
  };

  useEffect(() => {
    // Buscar flags iniciais
    const fetchFlags = async () => {
      try {
        const { data, error } = await supabase
          .from("feature_flags")
          .select("*");

        if (error) throw error;

        const flagsMap = data.reduce((acc, flag) => {
          acc[`${flag.group_name}-${flag.page_path}`] = flag.enabled;
          return acc;
        }, {} as Record<string, boolean>);

        setFeatureFlags(flagsMap);
        setDisabledByPath(recomputeByPath(flagsMap));
      } catch (error) {
        console.error("Erro ao buscar feature flags:", error);
        setFeatureFlags({});
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();

    // Subscription para mudanças em tempo real
    const channel = supabase
      .channel("feature_flags_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feature_flags",
        },
        (payload) => {
          console.log("Feature flag changed:", payload);

          if (
            payload.eventType === "UPDATE" ||
            payload.eventType === "INSERT"
          ) {
            const flag = payload.new as any;
            const key = `${flag.group_name}-${flag.page_path}`;
            setFeatureFlags((prev) => {
              const updated = { ...prev, [key]: flag.enabled };
              setDisabledByPath(recomputeByPath(updated));
              return updated;
            });
          } else if (payload.eventType === "DELETE") {
            const flag = payload.old as any;
            const key = `${flag.group_name}-${flag.page_path}`;
            setFeatureFlags((prev) => {
              const updated = { ...prev };
              delete updated[key];
              setDisabledByPath(recomputeByPath(updated));
              return updated;
            });
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isFlagEnabled = (groupId: string, path: string) => {
    // Se qualquer entrada no banco marcou esse path como desabilitado, respeitar
    if (disabledByPath[path] === true) return false;
    const key = `${groupId}-${path}`;
    return featureFlags[key] !== false; // Default para true
  };

  return {
    featureFlags,
    disabledByPath,
    loading,
    isFlagEnabled,
  };
};
