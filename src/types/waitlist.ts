export interface WaitlistStats {
  count: number;
  last_created_at: string | null;
}

export interface WaitlistResponse {
  ok: boolean;
  error?: string;
  info?: 'already_exists' | string;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
}

export interface WaitlistPayload {
  email: string;
  consent: boolean;
  referralCode?: string;
  ideas?: string[];
  utm?: UTMParams;
  variant?: string;
}

export interface ReferralStatus {
  referrer_email: string;
  uses_count: number;
  rewarded: boolean;
  created_at: string;
}

export interface ReferralResponse {
  credited: boolean;
  reward_granted: boolean;
  uses_count: number;
}