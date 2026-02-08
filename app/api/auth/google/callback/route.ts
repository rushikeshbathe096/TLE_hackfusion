import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(new URL(`/login?error=Google auth failed: ${error}`, req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=No code provided", req.url));
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback` : "http://localhost:3000/api/auth/google/callback";

        // Exchange code for tokens
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId!,
                client_secret: clientSecret!,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok) {
            console.error("Token exchange failed", tokenData);
            return NextResponse.redirect(new URL("/login?error=Failed to exchange token", req.url));
        }

        // Get user info
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userRes.json();

        if (!userRes.ok) {
            console.error("User info fetch failed", userData);
            return NextResponse.redirect(new URL("/login?error=Failed to fetch user info", req.url));
        }

        const { email, name, picture } = userData;

        // Enforce @gmail.com restriction
        if (!email.endsWith("@gmail.com")) {
            return NextResponse.redirect(new URL("/login?error=Only @gmail.com accounts are allowed", req.url));
        }

        await connectDB();

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            // Note: Google Authenticated users are verifying their email by definition
            user = await User.create({
                email,
                name,
                profileImage: picture, // Use Google profile picture
                role: "citizen", // Default role
                isVerified: true,
                // No password for Google auth users (or set a random one if schema requires it, but schema likely allows missing if designed for it, or we can set a dummy one)
                // Assuming schema requires password, we'll set a random high-entropy one that they don't know
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email, role: user.role },
            process.env.JWT_SECRET || "devsecret",
            { expiresIn: "7d" }
        );

        // Redirect with token in URL (frontend will grab it)
        // A cleaner way is to set a cookie, but for consistency with existing local storage flow, we can pass it in query and let frontend handle it
        return NextResponse.redirect(new URL(`/login?token=${token}`, req.url));

    } catch (err: any) {
        console.error("Google Auth Error:", err);
        return NextResponse.redirect(new URL("/login?error=Internal server error", req.url));
    }
}
