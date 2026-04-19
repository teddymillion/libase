"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../api";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function signup(name: string, email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("accessToken",  data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      router.push("/closet");
    } catch (e: any) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken",  data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      router.push("/closet");
    } catch (e: any) {
      setError(e.response?.data?.message || "Incorrect email or password");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  }

  return { signup, login, logout, loading, error };
}
