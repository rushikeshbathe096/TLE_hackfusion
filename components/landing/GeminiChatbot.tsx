"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Send, X, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function GeminiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm CityPulse Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // STT Setup
    const handleMicClick = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice input is not supported in this browser. Please try Chrome.");
            return;
        }

        if (isListening) {
            window.speechSynthesis.cancel();
            // Stop logic handled by native end event usually, but we can force stop
            // Actually we just toggle listening state as UI indicator mostly
            setIsListening(false);
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Auto-send after voice? Or let user confirm? Let's auto-send for smoother voice interaction
            setTimeout(() => handleSend(transcript), 500);
        };

        recognition.start();
    };

    // TTS Function
    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async (messageText: string = input) => {
        if (!messageText.trim()) return;

        // Add User Message
        const userMsg: Message = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText, history })
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            const aiMsg: Message = { role: 'model', content: data.text || "I'm not sure how to respond to that." };
            setMessages(prev => [...prev, aiMsg]);
            speak(aiMsg.content);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">

            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto bg-card border border-border rounded-2xl shadow-2xl w-[350px] max-w-[90vw] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-background/20 rounded-full">
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">CityPulse Assistant</h3>
                                <p className="text-xs opacity-80">Powered by Gemini AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-primary-foreground/20 p-1 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm
                    ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-card border border-border text-foreground rounded-bl-none'
                                        }
                  `}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-card border border-border px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-card border-t border-border shrink-0 flex items-center gap-2">
                        <button
                            onClick={handleMicClick}
                            className={`
                p-2 rounded-full transition-all duration-300
                ${isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                                }
              `}
                            title="Speak"
                        >
                            <Mic size={18} />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-muted/50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className={`
                 p-2 rounded-full bg-primary text-primary-foreground transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed
                 hover:scale-105 active:scale-95
               `}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <>
                        <MessageSquare size={28} className="absolute transition-transform duration-300 group-hover:scale-0" />
                        <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-20" />
                        {/* Voice Icon on Hover maybe? No, keep simple */}
                        <MessageSquare size={28} />
                    </>
                )}
            </button>
        </div>
    );
}
