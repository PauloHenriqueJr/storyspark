export interface UGCPayload {
  copy: string;
  dialogue: string;
  productImageUrl?: string;
}

class UGCService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
  }

  async generateVideos(payload: UGCPayload): Promise<string[]> {
    const body = payload.productImageUrl
      ? payload
      : { copy: payload.copy, dialogue: payload.dialogue };

    const response = await fetch(`${this.baseUrl}/ugc-generator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar vídeos: ${response.status} ${response.statusText}`);
    }

    const data = await response.json().catch(() => ({}));
    if (Array.isArray(data.videoUrls)) {
      return data.videoUrls as string[];
    }

    return [];
  }
}

export const ugcService = new UGCService();
export type { UGCPayload };
