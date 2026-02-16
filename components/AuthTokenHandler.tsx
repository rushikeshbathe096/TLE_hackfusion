"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthTokenHandler() {
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        // store token (your app likely reads from localStorage)
        localStorage.setItem("token", token);
        // remove token from url
        params.delete("token");
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "");
        router.replace(newUrl);
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  return null;
}
