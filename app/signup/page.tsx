"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
// @ts-ignore
import DarkVeil from "@/components/DarkVeil";
// @ts-ignore
import Particles from "@/components/Particles";
import { ThemeLogo } from "@/components/theme-logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
// @ts-ignore
import GoogleSignInButton from "@/components/GoogleSignInButton";

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
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/dashboard");
        }
    }, [router]);

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
                    setError(t('auth.govtIdRequired'));
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
                setError(data.error || t('auth.signupFailed'));
                setLoading(false);
                return;
            }
            setSuccess(t('auth.accountCreated'));
            setTimeout(() => router.push('/login'), 1500);
        } catch (err) {
            setError(t('auth.networkError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-background text-foreground transition-colors duration-300 overflow-hidden">

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

            <div className="relative z-10 w-full max-w-md bg-card rounded-2xl p-8 shadow-xl ring-1 ring-border">
                <div className="flex flex-col items-center mb-6">
                    <ThemeLogo className="w-16 h-16 mb-2" />
                    <h2 className="text-2xl font-bold text-center">{t('auth.createAccount')}</h2>
                </div>
                <div className="mb-6">
                    {/* @ts-ignore */}
                    <GoogleSignInButton />
                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="text-sm text-muted-foreground text-center">
                        {t('auth.alreadyAccount')}{' '}
                        <button type="button" onClick={() => router.push('/login')} className="underline ml-1 font-semibold text-foreground">
                            {t('auth.signin')}
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">{t('auth.name')}</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            required
                            className="w-full rounded-md px-3 py-2 bg-background border border-input focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
                        />
                    </div>

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

                    <div>
                        <label className="block text-sm text-muted-foreground mb-1">{t('auth.role')}</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-md px-3 py-2 bg-background border border-input text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="citizen">Citizen</option>
                            <option value="authority">Authority</option>
                            <option value="staff">Field Staff</option>
                        </select>
                    </div>

                    {(role === 'authority' || role === 'staff') && (
                        <>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">{t('auth.department')}</label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full rounded-md px-3 py-2 bg-background border border-input text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                                >
                                    <option value="Road">Road</option>
                                    <option value="Water">Water</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Sanitation">Sanitation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">{t('auth.govtId')} (Upload)</label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    required
                                    className="w-full rounded-md px-3 py-2 bg-background border border-input text-muted-foreground cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90"
                                />
                            </div>
                        </>
                    )}

                    {error && <div className="text-destructive text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}

                    <div className="flex items-center justify-between">
                        <button type="submit" className="btn bg-primary text-primary-foreground px-6 py-2 hover:opacity-90 transition" disabled={loading}>
                            {loading ? 'Please wait...' : t('auth.createAccount')}
                        </button>
                        <button type="button" onClick={() => router.push('/')} className="text-sm text-muted-foreground hover:text-foreground">
                            {t('auth.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;