"use client";

import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // простая валидация
    if (!username.trim() || !email.trim() || !password) {
      setErr("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch<{ access_token?: string; token?: string }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
            username: username.trim(),
          }),
        }
      );

      const token = res.access_token || res.token;
      if (token) setToken(token);

      router.push("/feed");
    } catch (e: any) {
      setErr(e?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Register</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="Your username"
            autoComplete="username"
          />
        </label>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="you@mail.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </label>

        {err && <div style={{ color: "crimson" }}>{err}</div>}

        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? "Loading..." : "Create account"}
        </button>
      </form>
    </div>
  );
}