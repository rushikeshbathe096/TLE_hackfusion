"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
// @ts-ignore
import Galaxy from "@/components/Galaxy";
import {
    ClipboardList,
    Wrench,
    Camera,
    ShieldCheck,
    AlertTriangle,
    HelpCircle,
    FileImage,
    ChevronDown,
    CheckCircle,
    XCircle,
    BookOpen,
    Phone
} from "lucide-react";

export default function StaffHelpPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = mounted && resolvedTheme === 'light';

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className={`fixed inset-0 z-0 pointer-events-none ${isLight ? 'opacity-30' : 'opacity-100'}`}>
                <Galaxy
                    starSpeed={0.5}
                    density={1}
                    hueShift={isLight ? 200 : 140}
                    speed={1}
                    glowIntensity={isLight ? 0.1 : 0.3}
                    saturation={0}
                    mouseRepulsion
                    repulsionStrength={2}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    transparent
                />
            </div>

            <div className="relative z-10 space-y-12 animate-in fade-in duration-700 pb-10 p-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-blue-500/5 p-8 md:p-12 border border-border shadow-sm">
                    <div className="relative z-10 max-w-3xl space-y-6">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                            <BookOpen size={12} className="mr-2" /> Field Operations Manual
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Support Center</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            Your comprehensive guide to complaint resolution, safety protocols, and mandatory proof submission standards.
                        </p>
                    </div>

                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                </section>

                {/* Quick Actions / Critical Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Instructions Card */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <ClipboardList className="text-primary" />
                            General Instructions
                        </h2>
                        <ul className="space-y-3">
                            {[
                                "Only work on complaints officially assigned to you.",
                                "Do not modify complaint category or location.",
                                "Follow instructions provided by the Authority strictly.",
                                "Maintain professional behavior with citizens.",
                                "Do not mark work as completed without valid proof."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Safety Card (High Importance) */}
                    <div className="bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 p-6 shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-red-700 dark:text-red-400">
                            <ShieldCheck />
                            Safety Non-Negotiables
                        </h2>
                        <ul className="space-y-3">
                            {[
                                "Always wear required safety gear (Helmet, Jacket).",
                                "Do not work in unsafe weather/conditions.",
                                "Follow department safety protocols strictly.",
                                "Stop work immediately if conditions become unsafe.",
                                "Your safety is more important than task speed."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Workflow Timeline */}
                <section className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm space-y-8 relative overflow-hidden">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Wrench className="text-primary" />
                            Standard Workflow
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">Follow these 4 steps for every assigned complaint.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        <div className="hidden md:block absolute top-[2rem] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -z-10" />

                        <StepCard
                            num="1"
                            title="Assignment"
                            desc="Receive complaint details via dashboard."
                        />
                        <StepCard
                            num="2"
                            title="Site Visit"
                            desc="Verify location & assess the issue."
                        />
                        <StepCard
                            num="3"
                            title="Resolution"
                            desc="Perform repairs/cleanup as required."
                        />
                        <StepCard
                            num="4"
                            title="Proof Upload"
                            desc="Upload 'After' photo & close ticket."
                        />
                    </div>
                </section>

                {/* Proof Rules & Field Guide */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Proof Rules (Span 2) */}
                    <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8 shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-600">
                            <FileImage />
                            Mandatory Proof Rules
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Acceptable Proof</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Clear 'After' photos of work</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> Location landmarks visible</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> One image per task minimum</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Rejected Proof</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><XCircle size={14} className="text-red-500" /> Blurry or dark images</li>
                                    <li className="flex items-center gap-2"><XCircle size={14} className="text-red-500" /> Old gallery photos</li>
                                    <li className="flex items-center gap-2"><XCircle size={14} className="text-red-500" /> Unrelated internet images</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl flex items-start gap-3 text-sm text-amber-800 dark:text-amber-300">
                            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                            <p><strong>Warning:</strong> Uploading false or misleading proof is a serious violation and may result in immediate suspension.</p>
                        </div>
                    </div>

                    {/* Quick Field Guide (Span 1) */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col h-full">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <Camera className="text-primary" />
                            Field Guidelines
                        </h2>
                        <div className="space-y-4 flex-grow text-sm text-muted-foreground">
                            <p>• Confirm location before starting work.</p>
                            <p>• Take 'Before' photos for your own record.</p>
                            <p>• Do not work outside assigned scope.</p>
                            <p>• Report blocked/unsafe cases to Authority.</p>
                            <p>• Be polite to curious residents.</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                            <h3 className="font-semibold text-sm mb-2">Emergency Contact</h3>
                            <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 p-3 rounded-lg justify-center">
                                <Phone size={18} />
                                <span>+91-1800-CITY-HELP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accordion FAQs */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <HelpCircle />
                        Common Questions
                    </h2>
                    <div className="grid gap-4">
                        <AccordionItem
                            q="What if the issue cannot be resolved on site?"
                            a="Update the complaint status to 'ON_HOLD' via the dashboard and add a detailed note explaining the reason (e.g., 'Special equipment needed' or 'Private property issue'). Inform your supervisor immediately."
                        />
                        <AccordionItem
                            q="Can I resolve a complaint without uploading proof?"
                            a="No. The system will strictly block any attempt to mark a complaint as 'RESOLVED' without an image attachment. This is hardcoded to ensure transparency."
                        />
                        <AccordionItem
                            q="Can I change the complaint status myself?"
                            a="Field staff can only request status updates or mark tasks as completed. Final 'Closure' is often subject to verification by the Authority based on your proof."
                        />
                        <AccordionItem
                            q="What if citizens interfere or argue?"
                            a="Do not engage in arguments. If the situation escalates, stop work, move to a safe location, and report the incident to the Authority with the 'Report Issue' button."
                        />
                    </div>
                </section>

                {/* Footer Notice */}
                <div className="bg-muted/50 rounded-xl p-6 text-center text-sm text-muted-foreground border border-border">
                    <p>CityPulse Staff Portal • v1.0 • Authorized Personnel Only</p>
                </div>

            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                            Sub-Components                                  */
/* -------------------------------------------------------------------------- */

function StepCard({ num, title, desc }: { num: string; title: string, desc: string }) {
    return (
        <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center font-bold text-primary shadow-sm mb-3">
                {num}
            </div>
            <h3 className="font-bold text-foreground mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
    )
}

function AccordionItem({ q, a }: { q: string, a: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 px-6 text-left hover:bg-muted/30 transition-colors"
            >
                <span className="font-medium text-foreground">{q}</span>
                <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 px-6 pt-0 text-sm text-muted-foreground border-t border-border/30 bg-muted/5">
                    <div className="pt-3">{a}</div>
                </div>
            </div>
        </div>
    )
}
