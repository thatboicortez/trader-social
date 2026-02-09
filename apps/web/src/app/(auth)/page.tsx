"use client";

import { useState } from "react";
import styles from "./auth.module.css";
import { CreateAccountModal } from "./components/CreateAccountModal";
import { VerifyCodeModal } from "./components/VerifyCodeModal";

type SignupMethod = "phone" | "email";

export default function AuthPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const [method, setMethod] = useState<SignupMethod>("phone");
  const [signupName, setSignupName] = useState("");
  const [signupValue, setSignupValue] = useState(""); // phone or email

  const onOpenCreate = () => {
    setCreateOpen(true);
    setVerifyOpen(false);
  };

  const onCloseAll = () => {
    setCreateOpen(false);
    setVerifyOpen(false);
  };

  const onNextFromCreate = () => {
    // UI-only: переходим на следующий "Verify code"
    setCreateOpen(false);
    setVerifyOpen(true);
  };

  return (
    <main className={styles.page}>
      {/* Background (замени путь на свою картинку) */}
      <div
        className={styles.bg}
        style={{
          backgroundImage: `url("/auth-bg.jpg")`, // положи картинку в public/auth-bg.jpg
        }}
      />
      <div className={styles.bgOverlay} />

      <div className={styles.shell}>
        <section className={styles.left}>
          <div className={styles.bigLogo} aria-hidden="true">
            {/* Тут можешь заменить на свой SVG/логотип */}
            <span className={styles.bigX}></span>
          </div>
        </section>

        {/* Right CTA area */}
        <section className={styles.right}>
          <h1 className={styles.h1}>Happening now</h1>
          <h2 className={styles.h2}>Join today.</h2>

          <div className={styles.actions}>
            <button className={styles.socialBtn} type="button">
              <span className={styles.socialIcon} aria-hidden="true">G</span>
              Sign up with Google
            </button>

            <button className={styles.socialBtn} type="button">
              <span className={styles.socialIcon} aria-hidden="true"></span>
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

            <p className={styles.disclaimer}>
              By signing up, you agree to the Terms of Service and Privacy Policy.
            </p>

            <div className={styles.signinBox}>
              <p className={styles.signinText}>Already have an account?</p>
              <button
                className={styles.outlineBtn}
                type="button"
                onClick={() => alert("Sign in UI позже. Сейчас делаем signup flow.")}
              >
                Sign in
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      {createOpen && (
        <CreateAccountModal
          method={method}
          name={signupName}
          value={signupValue}
          onChangeName={setSignupName}
          onChangeValue={setSignupValue}
          onToggleMethod={() => {
            setMethod((m) => (m === "phone" ? "email" : "phone"));
            setSignupValue("");
          }}
          onClose={onCloseAll}
          onNext={onNextFromCreate}
        />
      )}

      {verifyOpen && (
        <VerifyCodeModal
          method={method}
          value={signupValue}
          onBack={() => {
            setVerifyOpen(false);
            setCreateOpen(true);
          }}
          onClose={onCloseAll}
          onNext={() => alert("Дальше будет реальная регистрация/верификация. Сейчас UI готов.")}
        />
      )}
    </main>
  );
}