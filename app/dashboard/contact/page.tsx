"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
// @ts-ignore
import Galaxy from "@/components/Galaxy";

export default function ContactPage() {
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

            <div className="relative z-10 container mx-auto max-w-4xl animate-in fade-in duration-500 p-1">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Phone size={32} className="text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Need assistance? Reach out to our support team or visit our office.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Phone Support</h3>
                                <p className="text-muted-foreground text-sm mb-2">Mon-Fri from 9am to 6pm</p>
                                <a href="tel:+919876543210" className="text-primary font-medium hover:underline">+91 98765 43210</a>
                            </div>
                        </div>

                        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border flex items-start gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg text-amber-600 dark:text-amber-300">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email Us</h3>
                                <p className="text-muted-foreground text-sm mb-2">For general inquiries</p>
                                <a href="mailto:support@citypulse.com" className="text-primary font-medium hover:underline">support@citypulse.com</a>
                            </div>
                        </div>

                        <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-300">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Main Office</h3>
                                <p className="text-muted-foreground text-sm">
                                    123 Civic Center Drive,<br />
                                    Tech City, TC 560001
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Simple Message Form */}
                    <div className="bg-card/80 backdrop-blur-sm p-8 rounded-xl border border-border shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input type="text" className="w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input type="email" className="w-full px-3 py-2 rounded-md border border-input bg-background" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <textarea className="w-full px-3 py-2 rounded-md border border-input bg-background min-h-[120px]" placeholder="How can we help you?" />
                            </div>
                            <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
