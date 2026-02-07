"use client";

import { useUser } from "@/contexts/UserContext";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {user?.name || "User"}! 👋</h1>
        <p className="text-muted-foreground mt-2">{user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-muted-foreground text-sm font-medium">Account Status</div>
          <div className="text-2xl font-bold mt-2">Active</div>
          <div className="text-xs text-muted-foreground mt-1">All systems operational</div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-muted-foreground text-sm font-medium">Member Since</div>
          <div className="text-2xl font-bold mt-2">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
          <div className="text-xs text-muted-foreground mt-1">Welcome aboard!</div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="text-muted-foreground text-sm font-medium">Profile Completion</div>
          <div className="text-2xl font-bold mt-2">50%</div>
          <div className="text-xs text-muted-foreground mt-1">Add profile picture to complete</div>
        </div>
      </div>

      {/* User Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card text-card-foreground rounded-xl p-8 border border-border shadow-sm">
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
          <div className="bg-card text-card-foreground rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium transition-colors">Edit Profile</button>
              <button className="w-full py-3 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-medium transition-colors">Change Password</button>
              <button className="w-full py-3 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 font-medium transition-colors">Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
