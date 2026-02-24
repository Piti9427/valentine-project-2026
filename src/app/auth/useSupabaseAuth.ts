import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export function useSupabaseAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
