"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";
import { CreateAccountModal } from "./components/CreateAccountModal";
import { VerifyCodeModal } from "./components/VerifyCodeModal";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

type SignupMethod = "phone" | "email";

export default function AuthPage() {
  const router = useRouter();

  const [createOpen, setCreateOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  // только email, телефон пока отключаем
  const [method, setMethod] = useState<SignupMethod>("email");

  const [signupName, setSignupName] = useState("");
  const [signupValue, setSignupValue] = useState(""); // email
  const [password, setPassword] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onOpenCreate = () => {
    setErr(null);
    setCreateOpen(true);
    setVerifyOpen(false);
  };

  const onCloseAll = () => {
    setCreateOpen(false);
    setVerifyOpen(false);
  };

  async function onNextFromCreate() {
    setErr(null);

    const username = signupName.trim();
    const email = signupValue.trim().toLowerCase();

    if (!username) return setErr("Name is required");
    if (!email) return setErr("Email is required");
    if (!password.trim()) return setErr("Password is required");

    setLoading(true);
    try {
      // register -> создаёт юзера + генерит код (и должен отправить email, когда EmailService включишь)
      await apiFetch<{ ok: boolean; userId: string }>(`/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      });

      setCreateOpen(false);
      setVerifyOpen(true);
    } catch (e: any) {
      setErr(e?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(code: string) {
    setErr(null);
    setLoading(true);
    try {
      const email = signupValue.trim().toLowerCase();

      await apiFetch<{ ok: boolean }>(`/auth/verify`, {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      // после verify — логинимся и кидаем в /feed
      const loginRes = await apiFetch<{ accessToken: string }>(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(loginRes.accessToken);
      router.push("/feed");
    } catch (e: any) {
      setErr(e?.message || "Verify failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.bg} style={{ backgroundImage: 'url("/auth-bg.jpg")' }} />
      <div className={styles.bgOverlay} />

      <div className={styles.shell}>
        <section className={styles.left}>
          <div className={styles.bigLogo} aria-hidden="true">
            <span className={styles.bigX} />
          </div>
        </section>

        <section className={styles.right}>
          <h1 className={styles.h1}>Proof matters</h1>
          <h2 className={styles.h2}>Join and publish.</h2>

          <div className={styles.actions}>
            <button className={styles.socialBtn} type="button" disabled>
              <span className={styles.socialIcon} aria-hidden="true">
                G
              </span>
              Sign up with Google
            </button>

            <button className={styles.socialBtn} type="button" disabled>
              <span className={styles.socialIcon} aria-hidden="true">
                
              </span>
              Sign up with Apple
            </button>

            <div className={styles.orRow}>
              <div className={styles.orLine} />
              <span className={styles.orText}>OR</span>
              <div className={styles.orLine} />
            </div>

            <button className={styles.primaryBtn} type="button" onClick={onOpenCreate}>
              Create account
            </button>

            {err ? <p style={{ color: "crimson", margin: 0 }}>{err}</p> : null}

            <p className={styles.disclaimer}>
              By signing up, you agree to the Terms of Service and Privacy Policy.
            </p>

            <div className={styles.signinBox}>
              <p className={styles.signinText}>Already have an account?</p>
              <button className={styles.outlineBtn} type="button" disabled>
                Sign in
              </button>
            </div>
          </div>
        </section>
      </div>

{createOpen && (
  <CreateAccountModal
    name={signupName}
    email={signupValue}
    password={password}
    onChangeName={setSignupName}
    onChangeEmail={setSignupValue}
    onChangePassword={setPassword}
    onClose={onCloseAll}
    onNext={onNextFromCreate}
  />
)}

      {verifyOpen && (
        <VerifyCodeModal
          method={method}
          value={signupValue}
          loading={loading}
          error={err}
          onBack={() => {
            setErr(null);
            setVerifyOpen(false);
            setCreateOpen(true);
          }}
          onClose={onCloseAll}
          onNext={onVerify}
        />
      )}
    </main>
  );
}