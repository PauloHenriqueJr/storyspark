import { supabase } from '@/lib/supabase';

const USER_KEY_STORAGE = 'storyspark-user-key';

function getUserKey(): string {
  try {
    const existing = localStorage.getItem(USER_KEY_STORAGE);
    if (existing) return existing;
    const key = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    localStorage.setItem(USER_KEY_STORAGE, key);
    return key;
  } catch {
    return 'anon';
  }
}

export type SuggestionItem = {
  id: string;
  text: string;
  likes: number;
  isLiked: boolean;
  category: string;
};

export async function fetchSuggestions(): Promise<SuggestionItem[]> {
  const userKey = getUserKey();
  const { data: suggestions, error: e1 } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false });
  if (e1) throw e1;

  const { data: votes, error: e2 } = await supabase
    .from('suggestion_votes')
    .select('suggestion_id, user_key');
  if (e2) throw e2;

  const counts = new Map<string, number>();
  const liked = new Set<string>();
  for (const v of votes || []) {
    counts.set(v.suggestion_id, (counts.get(v.suggestion_id) || 0) + 1);
    if (v.user_key === userKey) liked.add(v.suggestion_id);
  }

  return (suggestions || []).map(s => ({
    id: s.id,
    text: s.text,
    likes: counts.get(s.id) || 0,
    isLiked: liked.has(s.id),
    // no column for category in schema; default label
    category: 'Ideia',
  }));
}

export async function addSuggestion(text: string) {
  const userKey = getUserKey();
  const author_meta = { user_key: userKey, ua: navigator.userAgent };
  const { error } = await supabase.from('suggestions').insert({ text, author_meta });
  if (error) throw error;
}

export async function toggleVote(suggestionId: string): Promise<'liked' | 'unliked'> {
  const userKey = getUserKey();
  // Try insert first
  const insertRes = await supabase.from('suggestion_votes').insert({ suggestion_id: suggestionId, user_key: userKey });
  if (!insertRes.error) return 'liked';
  // If unique violation, try delete (unlike)
  const del = await supabase
    .from('suggestion_votes')
    .delete()
    .eq('suggestion_id', suggestionId)
    .eq('user_key', userKey);
  if (del.error) throw del.error;
  return 'unliked';
}

