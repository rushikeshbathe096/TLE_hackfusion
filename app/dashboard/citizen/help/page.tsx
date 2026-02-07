"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
// @ts-ignore
import Galaxy from "@/components/Galaxy";
import {
    Construction,
    Droplet,
    Trash2,
    Shield,
    HelpCircle,
    CheckCircle,
    XCircle,
    ChevronDown,
    FileText,
    UserCheck,
    Wrench,
    CheckCheck,
    AlertCircle
} from "lucide-react";

export default function CitizenHelpPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isLight = mounted && resolvedTheme === 'light';

    return (
        <div className="relative min-h-[calc(100vh-4rem)]">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Galaxy
                    starSpeed={0.5}
                    density={1}
                    hueShift={140}
                    speed={1}
                    glowIntensity={0.3}
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
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-8 md:p-12 border border-border ps-8 shadow-sm">
                    <div className="relative z-10 max-w-3xl space-y-6">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                            <HelpCircle size={12} className="mr-2" /> Support Center
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">help you?</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            CityPulse ensures your voice is heard. Follow this guide to route your complaints correctly, track their progress, and get issues resolved faster.
                        </p>
                    </div>

                    {/* Decorative Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                </section>

                {/* Departments Grid */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Select the Right Department</h2>
                            <p className="text-muted-foreground mt-1">Choosing the correct category speeds up assignment.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <DepartmentCard
                            icon={<Construction className="h-8 w-8 text-amber-600" />}
                            title="Road & Transport"
                            description="Issues related to public roads, traffic, and pedestrian paths."
                            theme="amber"
                            allowed={[
                                "Deep potholes & craters",
                                "Damaged footpaths / curbs",
                                "Broken traffic signals",
                                "Unpainted speed breakers"
                            ]}
                            notAllowed={[
                                "Traffic violation reporting",
                                "Vehicle accidents (Call Police)",
                                "Private driveway disputes"
                            ]}
                        />

                        <DepartmentCard
                            icon={<Droplet className="h-8 w-8 text-blue-600" />}
                            title="Water & Utilities"
                            description="Water supply, leakage, and drainage system concerns."
                            theme="blue"
                            allowed={[
                                "No water supply in area",
                                "Pipeline leaks on road",
                                "Contaminated water supply",
                                "Overflowing public manholes"
                            ]}
                            notAllowed={[
                                "Electricity cuts (Contact Power Co.)",
                                "Home plumbing issues",
                                "Internet/Broadband cables"
                            ]}
                        />

                        <DepartmentCard
                            icon={<Trash2 className="h-8 w-8 text-emerald-600" />}
                            title="Sanitation & Health"
                            description="Garbage collection, cleanliness, and public hygiene."
                            theme="emerald"
                            allowed={[
                                "Garbage truck didn't arrive",
                                "Overflowing public dustbins",
                                "Dead animal removal",
                                "Stagnant water (Mosquito risk)"
                            ]}
                            notAllowed={[
                                "Household cleaning requests",
                                "Private property dumping",
                                "Noise pollution complaints"
                            ]}
                        />

                        <DepartmentCard
                            icon={<Shield className="h-8 w-8 text-red-600" />}
                            title="Public Safety"
                            description="Street lighting and safety of public infrastructure."
                            theme="red"
                            allowed={[
                                "Non-functional street lights",
                                "Open electrical wires/boxes",
                                "Damaged park equipment",
                                "Fallen trees blocking roads"
                            ]}
                            notAllowed={[
                                "Immediate crime (Call 100)",
                                "Fire emergencies (Call 101)",
                                "Personal disputes"
                            ]}
                        />
                    </div>
                </section>

                {/* Workflow Steps */}
                <section className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                        <CheckCheck size={400} />
                    </div>

                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold">Complaint Lifecycle</h2>
                        <p className="text-muted-foreground mt-2">From submission to resolution, here is how we handle your report.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -z-10" />

                        <Step
                            number={1}
                            icon={<FileText size={22} />}
                            title="Submit Report"
                            desc="Fill details, locate on map, and attach photos."
                        />
                        <Step
                            number={2}
                            icon={<UserCheck size={22} />}
                            title="Verification"
                            desc="Authority reviews and approves valid complaints."
                        />
                        <Step
                            number={3}
                            icon={<Wrench size={22} />}
                            title="Resolution"
                            desc="Assigned staff works on the ground to fix it."
                        />
                        <Step
                            number={4}
                            icon={<CheckCheck size={22} />}
                            title="Closed"
                            desc="You verify the fix and the ticket is closed."
                        />
                    </div>
                </section>

                {/* Status Legend & FAQ Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Status Legend (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold">Status Guide</h2>
                            <p className="text-muted-foreground text-sm mt-1">Understand what each status label means.</p>
                        </div>

                        <div className="grid gap-3">
                            <StatusCard
                                status="OPEN"
                                desc="Complaint received, waiting for review."
                                colorClass="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50"
                            />
                            <StatusCard
                                status="IN_PROGRESS"
                                desc="A staff member is currently working on it."
                                colorClass="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
                            />
                            <StatusCard
                                status="ON_HOLD"
                                desc="Paused due to approvals or spare parts."
                                colorClass="bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50"
                            />
                            <StatusCard
                                status="RESOLVED"
                                desc="Work completed and verified."
                                colorClass="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50"
                            />
                        </div>

                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6 relative overflow-hidden group hover:bg-primary/10 transition-colors">
                            <div className="relative z-10">
                                <h3 className="font-semibold flex items-center gap-2 text-primary mb-2">
                                    <HelpCircle size={18} />
                                    Still stuck?
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    If your issue isn't listed or you're facing technical trouble.
                                </p>
                                <div className="text-sm font-medium bg-background/50 p-2 rounded-lg border border-border/50 text-center">
                                    support@citypulse.in
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 bg-primary/10 w-24 h-24 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                        </div>
                    </div>

                    {/* FAQ Accordion (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <FAQItem
                                q="How long does it take to resolve an issue?"
                                a="Resolution time depends on priority. High priority issues (danger to life/property) are addressed within 24 hours. Standard issues typically take 3-5 business days."
                            />
                            <FAQItem
                                q="Why was my complaint rejected?"
                                a="Complaints are usually rejected if they are duplicates of an existing active issue, fall outside our jurisdiction (e.g., private property), or lack sufficient information/evidence."
                            />
                            <FAQItem
                                q="Can I edit my complaint after submission?"
                                a="To ensure transparency and prevent tampering, complaints cannot be edited once submitted. However, you can add additional comments or raise a new ticket if significant details changed."
                            />
                            <FAQItem
                                q="What happens if I submit a fake report?"
                                a="Misuse of the platform wastes public resources. Repeated false reporting may lead to account suspension and potential legal action as per municipal bylaws."
                            />
                            <FAQItem
                                q="How do I track the progress?"
                                a="You can track the real-time status of your complaint on your dashboard. We also notify you via SMS/Email at every major step (Assigned, In Progress, Resolved)."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */

interface DepartmentProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    theme: 'amber' | 'blue' | 'emerald' | 'red';
    allowed: string[];
    notAllowed: string[];
}

function DepartmentCard({ icon, title, description, theme, allowed, notAllowed }: DepartmentProps) {

    const themeStyles = {
        amber: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-200/50 dark:border-amber-900/30",
        blue: "bg-blue-500/5 hover:bg-blue-500/10 border-blue-200/50 dark:border-blue-900/30",
        emerald: "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-900/30",
        red: "bg-red-500/5 hover:bg-red-500/10 border-red-200/50 dark:border-red-900/30",
    };

    const accentColor = {
        amber: "bg-amber-500",
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        red: "bg-red-500",
    };

    return (
        <div className={`group relative rounded-3xl border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${themeStyles[theme]}`}>
            {/* Decorative Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${accentColor[theme]} opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.1] transition-opacity`} />

            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-background rounded-2xl border shadow-sm group-hover:shadow-md transition-all">
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed relative z-10 min-h-[40px]">{description}</p>

            <div className="space-y-4 relative z-10">
                <div className="bg-background/40 p-4 rounded-xl border border-black/5 dark:border-white/5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2">
                        <CheckCircle size={14} className="text-green-500" /> What to report
                    </p>
                    <ul className="text-sm space-y-2">
                        {allowed.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="px-4 py-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-2">
                        <XCircle size={14} className="text-red-500" /> Not covered
                    </p>
                    <ul className="text-sm space-y-1.5">
                        {notAllowed.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground text-xs">
                                <span className="w-1 h-1 rounded-full bg-red-400/50 mt-1.5 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function Step({ number, icon, title, desc }: { number: number; icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="relative flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-background border-4 border-muted flex items-center justify-center text-muted-foreground shadow-sm mb-5 group-hover:scale-110 group-hover:border-primary group-hover:text-primary transition-all duration-500 z-10 relative">
                {icon}
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold shadow-sm">
                    {number}
                </span>
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed px-2">{desc}</p>
        </div>
    );
}

function StatusCard({ status, desc, colorClass }: { status: string; desc: string; colorClass: string }) {
    return (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border ${colorClass} transition-all hover:translate-x-1`}>
            <div className="mt-1 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full bg-current animate-pulse`} />
            </div>
            <div>
                <p className="font-bold text-sm uppercase tracking-wider mb-0.5">{status.replace('_', ' ')}</p>
                <p className="text-xs font-medium opacity-80">{desc}</p>
            </div>
        </div>
    )
}

function FAQItem({ q, a }: { q: string; a: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border/60 rounded-2xl bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-foreground pr-4">{q}</span>
                <ChevronDown size={20} className={`text-muted-foreground transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-5 pt-0 text-sm text-muted-foreground leading-relaxed">
                    <div className="pt-2 border-t border-border/40">{a}</div>
                </div>
            </div>
        </div>
    );
}
