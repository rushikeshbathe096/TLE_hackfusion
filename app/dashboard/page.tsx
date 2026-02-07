"use client";

import { useUser } from "@/contexts/UserContext";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) return null; // Should be handled by layout, but safe check

  return (
    <>
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-4xl font-bold">Welcome back, {user?.name || "User"}! </h1>
        <p className="text-white/60 mt-2">{user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/6 rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 transition">
          <div className="text-white/70 text-sm font-medium">Account Status</div>
          <div className="text-2xl font-bold mt-2">Active</div>
          <div className="text-xs text-white/50 mt-1">All systems operational</div>
        </div>
        <div className="bg-white/6 rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 transition">
          <div className="text-white/70 text-sm font-medium">Member Since</div>
          <div className="text-2xl font-bold mt-2">{new Date(user?.createdAt).toLocaleDateString()}</div>
          <div className="text-xs text-white/50 mt-1">Welcome aboard!</div>
        </div>
      </div>

      {/* User Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/70">Full Name</span>
                <span className="font-medium">{user?.name || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/70">Email Address</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/70">Account Type</span>
                <span className="font-medium text-amber-400">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Joined</span>
                <span className="font-medium">{new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-gradient-to-br from-white/8 to-white/3 rounded-2xl p-6 border border-white/10">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-3 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 font-medium transition">Edit Profile</button>
              <button className="w-full py-3 rounded-lg bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 font-medium transition">Change Password</button>
              <button className="w-full py-3 rounded-lg bg-purple-400/20 text-purple-300 hover:bg-purple-400/30 font-medium transition">Settings</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
