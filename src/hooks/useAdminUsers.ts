import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  plan: string | null;
  subscription_status: string | null;
  credits: number | null;
  monthly_tokens_used: number | null;
  monthly_tokens_limit: number | null;
  created_at: string | null;
  last_login_at: string | null;
}

export interface AddCreditsData {
  userId: string;
  amount: number;
  reason?: string;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os usuários
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          email,
          full_name,
          avatar_url,
          role,
          plan,
          subscription_status,
          credits,
          monthly_tokens_used,
          monthly_tokens_limit,
          created_at,
          last_login_at
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar créditos a um usuário
  const addCredits = async (data: AddCreditsData) => {
    try {
      setError(null);

      // Buscar créditos atuais do usuário
      const { data: currentUser, error: fetchError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", data.userId)
        .single();

      if (fetchError) throw fetchError;

      const currentCredits = currentUser.credits || 0;
      const newCredits = currentCredits + data.amount;

      // Atualizar créditos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          credits: newCredits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.userId);

      if (updateError) throw updateError;

      // Registrar a transação de créditos (opcional - para auditoria)
      const { error: logError } = await supabase
        .from("credit_transactions")
        .insert({
          user_id: data.userId,
          amount: data.amount,
          type: "admin_add",
          reason: data.reason || "Créditos adicionados pelo admin",
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          created_at: new Date().toISOString(),
        });

      // Se der erro no log, não quebra a operação principal
      if (logError) {
        console.warn("Erro ao registrar transação de créditos:", logError);
      }

      // Recarregar lista de usuários
      await fetchUsers();

      return { success: true };
    } catch (err) {
      console.error("Erro ao adicionar créditos:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  // Atualizar role do usuário
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from("profiles")
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Recarregar lista de usuários
      await fetchUsers();

      return { success: true };
    } catch (err) {
      console.error("Erro ao atualizar role:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  // Resetar créditos mensais de um usuário
  const resetMonthlyCredits = async (userId: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from("profiles")
        .update({
          monthly_tokens_used: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Recarregar lista de usuários
      await fetchUsers();

      return { success: true };
    } catch (err) {
      console.error("Erro ao resetar créditos mensais:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addCredits,
    updateUserRole,
    resetMonthlyCredits,
  };
};
