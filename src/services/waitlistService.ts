import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { emailQueueService } from './emailQueueService';
import type { WaitlistPayload, WaitlistResponse } from '@/types/waitlist';

const payloadSchema = z.object({
  email: z.string().email(),
  consent: z.boolean().refine((v) => v === true, "Consentimento é obrigatório"),
  referralCode: z.string().optional(),
  ideas: z.array(z.string()).optional(),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      ref: z.string().optional(),
    })
    .optional(),
  variant: z.string().optional(),
});

export type { WaitlistPayload };

export async function addToWaitlist(payload: WaitlistPayload): Promise<WaitlistResponse> {
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { email, consent, utm, variant, ideas } = parsed.data;
  const referralCode = parsed.data.referralCode;

  try {
    const { data, error } = await supabase.rpc("add_waitlist_entry", {
      p_email: email,
      p_consent: consent,
      p_utm_source: utm?.utm_source ?? null,
      p_utm_medium: utm?.utm_medium ?? null,
      p_utm_campaign: utm?.utm_campaign ?? null,
      p_utm_term: utm?.utm_term ?? null,
      p_utm_content: utm?.utm_content ?? null,
      p_referrer:
        (utm?.ref ??
          (typeof document !== "undefined" ? document.referrer : null)) ||
        null,
      p_variant: variant ?? null,
      p_ideas: ideas ?? null,
    });

    if (error) return { ok: false, error: error.message };

    // Processar fila de emails após adicionar à waitlist
    // Fazer isso de forma assíncrona para não bloquear a resposta
    setTimeout(() => {
      emailQueueService.processQueue().catch(console.error);
    }, 1000);

    // A função retorna boolean: true se inseriu, false se já existia
    const inserted = Array.isArray(data) ? data[0] : data;
    if (inserted === true) {
      // Atualizar contador local e notificar frontend para atualizar UI imediatamente
      try {
        if (typeof window !== "undefined") {
          const key = "storyspark-waitlist-count";
          const prev = Number(localStorage.getItem(key) || "0");
          const seed = prev || 2847;
          const next = seed + 1;
          localStorage.setItem(key, String(next));
          localStorage.setItem(
            "storyspark-waitlist-last",
            new Date().toISOString()
          );
          try {
            localStorage.setItem("storyspark-waitlist-last-email", email);
          } catch {
            // Ignore localStorage errors
          }
          try {
            window.dispatchEvent(
              new CustomEvent("waitlist:added", { detail: { email } })
            );
          } catch {
            // Ignore event dispatch errors
          }
        }
      } catch {
        // Ignore localStorage/window access errors in server environments
      }
      // If there is a referral code, attempt to claim it atomically after successful signup
      try {
        if (referralCode) {
          // call claim RPC - SECURITY DEFINER function on the DB will validate
          await supabase.rpc("claim_referral_for_signup", {
            p_code: referralCode,
            p_referred_email: email,
          });
        }
      } catch {
        // Ignore referral claim errors - not critical to signup success
      }
      return { ok: true };
    }
    return { ok: true, info: "already_exists" };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
