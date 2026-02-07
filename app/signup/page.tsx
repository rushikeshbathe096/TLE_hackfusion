"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("citizen");
    const [department, setDepartment] = useState("Road");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("role", role);

            if (role === 'authority' || role === 'staff') {
                formData.append("department", department);
                if (file) {
                    formData.append("govtId", file);
                } else {
                    setError("Government ID is required for this role");
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Sign up failed');
                setLoading(false);
                return;
            }
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => router.push('/login'), 1500);
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#001219] text-white">
            <div className="w-full max-w-md bg-white/6 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Create an account</h2>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="text-sm text-white/80 text-center">
                        Already have an account?{' '}
                        <button type="button" onClick={() => router.push('/login')} className="underline ml-1">
                            Sign in
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Full name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            required
                            className="w-full rounded-md px-3 py-2 bg-white/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            className="w-full rounded-md px-3 py-2 bg-white/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                            className="w-full rounded-md px-3 py-2 bg-white/5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-md px-3 py-2 bg-white/5 text-white"
                        >
                            <option value="citizen" className="bg-[#0f172a]">Citizen</option>
                            <option value="authority" className="bg-[#0f172a]">Authority</option>
                            <option value="staff" className="bg-[#0f172a]">Field Staff</option>
                        </select>
                    </div>

                    {(role === 'authority' || role === 'staff') && (
                        <>
                            <div>
                                <label className="block text-sm text-white/80 mb-1">Department</label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full rounded-md px-3 py-2 bg-white/5 text-white"
                                >
                                    <option value="Road" className="bg-[#0f172a]">Road</option>
                                    <option value="Water" className="bg-[#0f172a]">Water</option>
                                    <option value="Electrical" className="bg-[#0f172a]">Electrical</option>
                                    <option value="Sanitation" className="bg-[#0f172a]">Sanitation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-white/80 mb-1">Government ID (Upload)</label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    required
                                    className="w-full rounded-md px-3 py-2 bg-white/5 text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-400 file:text-amber-900 hover:file:bg-amber-500"
                                />
                            </div>
                        </>
                    )}

                    {error && <div className="text-rose-400 text-sm">{error}</div>}
                    {success && <div className="text-green-400 text-sm">{success}</div>}

                    <div className="flex items-center justify-between">
                        <button type="submit" className="btn bg-amber-400 text-amber-900 px-6 py-2" disabled={loading}>
                            {loading ? 'Please wait...' : 'Create account'}
                        </button>
                        <button type="button" onClick={() => router.push('/')} className="text-sm text-white/80">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;