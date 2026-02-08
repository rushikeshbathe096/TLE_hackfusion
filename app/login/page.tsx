"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
// @ts-ignore
import DarkVeil from "@/components/DarkVeil";

import { ThemeLogo } from "@/components/theme-logo";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
// @ts-ignore
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Theme effects
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  // User context
  const { user, refreshUser, loading: userLoading } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect if user is already logged in (and we have fetched user data)
    if (!userLoading && user) {
      if (user.role === 'authority') {
        router.push("/dashboard/authority");
      } else if (user.role === 'staff') {
        router.push("/dashboard/staff");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, userLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      if (data.token) localStorage.setItem("token", data.token);

      // Refresh user context to ensure we have the latest user data before redirecting
      await refreshUser();

      // The useEffect will handle the redirect once user is set
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }
      setSuccess("OTP sent to your email!");
      setOtpSent(true);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        setLoading(false);
        return;
      }
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        setIsForgotPassword(false);
        setOtpSent(false);
        setOtp("");
        setNewPassword("");
        setEmail("");
        setError(null);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  // Handle Google Auth Callback logic (if redirected with token/error)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token) {
      localStorage.setItem("token", token);
      refreshUser().then(() => {
        // Redirect logic handles the rest based on user role in the *other* useEffect
      });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refreshUser]);

  return (
    <div className="min-h-screen relative flex items-center justify-center text-foreground overflow-hidden bg-background transition-colors duration-300">

      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Dark Mode Background */}
      {mounted && resolvedTheme === "dark" && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DarkVeil
            hueShift={35}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>
      )}

      {/* Light Mode Background */}
      {mounted && resolvedTheme === "light" && (
        <div className="absolute inset-0 z-0 pointer-events-none filter invert opacity-60">
          <DarkVeil
            hueShift={35}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        </div>
      )}

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-2xl p-8 shadow-xl ring-1 ring-border">
        {!isForgotPassword ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <ThemeLogo className="w-16 h-16 mb-2" />
              <h2 className="text-2xl font-bold text-center">{t('auth.signin')}</h2>
            </div>

            {/* Google Sign In */}
            <div className="mb-6">
              {/* @ts-ignore */}
              <GoogleSignInButton />
              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">{t('auth.email')}</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">{t('auth.password')}</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                />
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="btn bg-primary text-primary-foreground px-6 py-2 hover:opacity-90 transition"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : t('auth.signin')}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('auth.cancel')}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <button onClick={() => router.push('/signup')} className="underline ml-1 font-semibold text-foreground">
                {t('auth.createAccount')}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">{t('auth.resetPassword')}</h2>
            <form onSubmit={otpSent ? handleResetPassword : handleRequestOTP} className="space-y-4">
              {!otpSent ? (
                <>
                  <p className="text-sm text-muted-foreground">Enter your email to receive an OTP</p>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">{t('auth.email')}</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                    />
                  </div>
                  {error && <div className="text-destructive text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button
                    type="submit"
                    className="w-full btn bg-primary text-primary-foreground py-2 hover:opacity-90 transition"
                    disabled={loading}
                  >
                    {loading ? t('auth.sending') : t('auth.sendOtp')}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Enter OTP and new password</p>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">OTP (6 digits)</label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      type="text"
                      maxLength={6}
                      required
                      className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">New Password</label>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      required
                      className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                    />
                  </div>
                  {error && <div className="text-destructive text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button
                    type="submit"
                    className="w-full btn bg-primary text-primary-foreground py-2 hover:opacity-90 transition"
                    disabled={loading}
                  >
                    {loading ? t('auth.resetting') : t('auth.resetPassword')}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setOtpSent(false); setOtp(""); setNewPassword(""); }}
                className="text-sm text-muted-foreground text-center w-full hover:text-foreground"
              >
                {t('auth.backToLogin')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
