import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import type { AuthSessionState } from "./authTypes";

export function useAuthSession(): AuthSessionState {
  const [sessionState, setSessionState] = useState<AuthSessionState>({
    session: null,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        setSessionState({
          session: null,
          user: null,
          isLoading: false,
        });
        return;
      }

      setSessionState({
        session: data.session,
        user: data.session?.user ?? null,
        isLoading: false,
      });
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setSessionState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return sessionState;
}