import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

type AuthGateProps = {
  children: ReactNode;
};

const DEFAULT_REDIRECT_URL =
  import.meta.env.VITE_SUPABASE_REDIRECT_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');

const parseAllowedEmails = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading } = useSupabaseAuth();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);
  const allowedEmails = useMemo(
    () => parseAllowedEmails(import.meta.env.VITE_ALLOWED_EMAILS),
    [],
  );

  const isAllowed =
    allowedEmails.length === 0 ||
    (!!user?.email && allowedEmails.includes(user.email.toLowerCase()));

  useEffect(() => {
    if (loading || !user) return;
    if (!isAllowed) {
      setDeniedEmail(user.email ?? '');
      void supabase.auth.signOut();
    }
  }, [loading, user, isAllowed]);

  const handleSignIn = async () => {
    setSignInError(null);
    const options = DEFAULT_REDIRECT_URL
      ? { redirectTo: DEFAULT_REDIRECT_URL }
      : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options,
    });

    if (error) {
      setSignInError(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <div className="text-center text-gray-600">
          <div className="text-2xl font-serif mb-2">กำลังตรวจสอบสิทธิ์...</div>
          <div className="text-sm text-gray-500">โปรดรอสักครู่</div>
        </div>
      </div>
    );
  }

  if (!user || !isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-serif text-rose-600 mb-3">เข้าสู่ระบบก่อนนะครับ</h1>
          <p className="text-gray-600 mb-6">
            เว็บนี้เป็นพื้นที่ส่วนตัว ต้องใช้บัญชีที่ได้รับอนุญาตเท่านั้น
          </p>

          {deniedEmail && (
            <div className="text-sm text-red-500 mb-4">
              อีเมลนี้ไม่ได้รับอนุญาต: {deniedEmail}
            </div>
          )}

          {signInError && (
            <div className="text-sm text-red-500 mb-4">{signInError}</div>
          )}

          <button
            onClick={handleSignIn}
            className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            Sign in with Google
          </button>

          {allowedEmails.length === 0 && (
            <p className="text-xs text-amber-600 mt-4">
              ยังไม่ได้ตั้งค่า VITE_ALLOWED_EMAILS
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-white/90 backdrop-blur-md border border-rose-100 rounded-full px-3 py-2 shadow-lg">
        <span className="text-xs text-gray-600 max-w-[180px] truncate">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
}
