// Hook para feature flags com realtime
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

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
            setFeatureFlags((prev) => ({
              ...prev,
              [key]: flag.enabled,
            }));
          } else if (payload.eventType === "DELETE") {
            const flag = payload.old as any;
            const key = `${flag.group_name}-${flag.page_path}`;
            setFeatureFlags((prev) => {
              const newFlags = { ...prev };
              delete newFlags[key];
              return newFlags;
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
    const key = `${groupId}-${path}`;
    return featureFlags[key] !== false; // Default to true se não carregado
  };

  return {
    featureFlags,
    loading,
    isFlagEnabled,
  };
};
