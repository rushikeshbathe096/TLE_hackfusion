"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeLogo } from "@/components/theme-logo";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <ThemeLogo className="w-10 h-10" />
          <span className="font-bold text-lg">City Pulse</span>
        </div>
        <nav className="space-y-2">
          <a href="/dashboard" className="block px-4 py-3 rounded-lg bg-accent text-accent-foreground font-medium">Dashboard</a>
          <a href="#" className="block px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition">Profile</a>
          <a href="#" className="block px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition">Settings</a>
          <a href="#" className="block px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition">Help</a>
        </nav>
        <button onClick={handleLogout} className="w-full mt-8 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium transition">Logout</button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Welcome back, {user?.name || "User"}! 👋</h1>
          <p className="text-muted-foreground mt-2">{user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-primary/50 transition">
            <div className="text-muted-foreground text-sm font-medium">Account Status</div>
            <div className="text-2xl font-bold mt-2">Active</div>
            <div className="text-xs text-muted-foreground mt-1">All systems operational</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-primary/50 transition">
            <div className="text-muted-foreground text-sm font-medium">Member Since</div>
            <div className="text-2xl font-bold mt-2">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
            <div className="text-xs text-muted-foreground mt-1">Welcome aboard!</div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-primary/50 transition">
            <div className="text-muted-foreground text-sm font-medium">Profile Completion</div>
            <div className="text-2xl font-bold mt-2">50%</div>
            <div className="text-xs text-muted-foreground mt-1">Add profile picture to complete</div>
          </div>
        </div>

        {/* User Card & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-medium">{user?.name || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Email Address</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium text-primary">Premium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-3 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-400 hover:bg-amber-400/30 font-medium transition">Edit Profile</button>
                <button className="w-full py-3 rounded-lg bg-blue-400/20 text-blue-600 dark:text-blue-400 hover:bg-blue-400/30 font-medium transition">Change Password</button>
                <button className="w-full py-3 rounded-lg bg-purple-400/20 text-purple-600 dark:text-purple-400 hover:bg-purple-400/30 font-medium transition">Settings</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
