import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { emailQueueService } from './emailQueueService';
// UTM type removed because it's not referenced directly in this module

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

export type WaitlistPayload = z.infer<typeof payloadSchema>;

async function sendWaitlistConfirmationEmail(toEmail: string, selectedIdeas?: string[]) {
  try {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? (process as any).env?.VITE_SUPABASE_URL : undefined);
    if (!supabaseUrl) return;

    const fromName = 'StorySpark';
    const fromDomain = (import.meta as any).env?.VITE_RESEND_FROM_DOMAIN;
    const defaultFrom = (import.meta as any).env?.VITE_DEFAULT_FROM_EMAIL || (fromDomain ? `suporte@${fromDomain}` : undefined);

    const body = {
      ...(defaultFrom ? { from: { email: defaultFrom, name: fromName } } : {}),
      to: [{ email: toEmail }],
      subject: 'Você entrou na lista de espera! 🚀',
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height:1.6; color:#0A0A0A">
          <h2>Bem-vindo(a) à StorySpark!</h2>
          <p>Seu e‑mail <strong>${toEmail}</strong> foi confirmado na nossa lista de espera.</p>
          ${selectedIdeas && selectedIdeas.length ? `<p>Preferências marcadas:</p><ul>${selectedIdeas.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
          <p>Em breve enviaremos novidades e acesso antecipado. Obrigado por se juntar! 💛</p>
          <p style="margin-top:24px; font-size:12px; color:#6B7280">Se você não se inscreveu, ignore este e‑mail.</p>
        </div>
      `,
    };

    await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.warn('Falha ao enviar e-mail de confirmação da waitlist:', e);
  }
}

export async function addToWaitlist(payload: WaitlistPayload) {
  const parsed = payloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const { email, consent, utm, variant, ideas } = parsed.data;
  const referralCode = (parsed.data as any).referralCode;

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

    // Processar fila de emails após adicionar à waitlist (desativado por ora no cliente)
    // Fazer isso de forma assíncrona para não bloquear a resposta
    try {
      setTimeout(() => {
        emailQueueService.processQueue().catch(() => {});
      }, 1000);
    } catch {}

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
          } catch {}
          try {
            window.dispatchEvent(
              new CustomEvent("waitlist:added", { detail: { email } })
            );
          } catch {}
        }
      } catch {}

      // Se houver referral, tentar creditar atomicamente após o signup
      try {
        if (referralCode) {
          await supabase.rpc("claim_referral_for_signup", {
            p_code: referralCode,
            p_referred_email: email,
          });
        }
      } catch {}

      // Disparar e-mail de confirmação (best-effort, não bloqueante)
      try {
        sendWaitlistConfirmationEmail(email, ideas).catch(() => {});
      } catch {}

      return { ok: true };
    }

    // Já existia: ainda podemos retornar ok com info
    return { ok: true, info: "already_exists" };
  } catch (err: any) {
    return { ok: false, error: err.message ?? String(err) };
  }
}
