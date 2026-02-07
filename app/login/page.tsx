"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import PixelBlast from "@/components/PixelBlast";

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

      if (data.role === 'authority') {
        router.push("/dashboard/authority");
      } else if (data.role === 'staff') {
        router.push("/dashboard/staff");
      } else {
        router.push("/dashboard");
      }
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

  return (
    <div className="min-h-screen relative flex items-center justify-center text-foreground overflow-hidden bg-background transition-colors duration-300">

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-2xl p-8 shadow-xl ring-1 ring-border">
        {!isForgotPassword ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Sign in</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Password</label>
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
                  {loading ? "Please wait..." : "Sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button onClick={() => router.push('/signup')} className="underline ml-1 font-semibold text-foreground">
                Create account
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <form onSubmit={otpSent ? handleResetPassword : handleRequestOTP} className="space-y-4">
              {!otpSent ? (
                <>
                  <p className="text-sm text-muted-foreground">Enter your email to receive an OTP</p>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Email</label>
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
                    {loading ? "Sending..." : "Send OTP"}
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
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setOtpSent(false); setOtp(""); setNewPassword(""); }}
                className="text-sm text-muted-foreground text-center w-full hover:text-foreground"
              >
                Back to login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
