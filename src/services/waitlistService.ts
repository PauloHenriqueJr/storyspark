import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export const waitlistService = {
  async join(email: string) {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({ email } satisfies Database['public']['Tables']['waitlist']['Insert'])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar à waitlist:', error);
      throw error;
    }

    return data;
  },
};
