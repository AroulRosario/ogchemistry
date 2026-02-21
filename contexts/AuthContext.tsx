import { supabase } from '@/constants/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Profile = {
    id: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    role: 'student' | 'admin';
};

type AuthContextType = {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    refreshProfile: async () => { },
    signOut: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            if (error) {
                console.warn('[AuthContext] Profile fetch error:', error.message);
                setProfile(null);
            } else {
                console.log('[AuthContext] Profile fetched:', data.email, 'Status:', data.status);
                setProfile(data);
            }
        } catch (e) {
            console.error('[AuthContext] fetchProfile exception:', e);
        }
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    useEffect(() => {
        const initialize = async () => {
            console.log('[AuthContext] Initializing...');
            const { data: { session: initialSession } } = await supabase.auth.getSession();

            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            if (initialSession?.user) {
                await fetchProfile(initialSession.user.id);
            }
            setLoading(false);
        };

        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            console.log('[AuthContext] Auth event:', event);
            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                await fetchProfile(currentSession.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = { session, user, profile, loading, refreshProfile, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
