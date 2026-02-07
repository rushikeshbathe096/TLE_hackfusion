
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    isVerified?: boolean;
    department?: string;
    // Add other user properties as needed
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                // Optional: redirect to login if strictly protected, but layout handles protection usually
                return;
            }

            const res = await fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.ok) {
                setUser(data.user);
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.push("/");
    };

    return (
        <UserContext.Provider value={{ user, loading, logout, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
