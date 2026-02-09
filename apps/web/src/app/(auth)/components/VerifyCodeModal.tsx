"use client";

import { useState } from "react";
import styles from "./modal.module.css";

type SignupMethod = "phone" | "email";

export function VerifyCodeModal(props: {
  method: SignupMethod;
  value: string;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const { method, value, onBack, onClose, onNext } = props;
  const [code, setCode] = useState("");

  const label = method === "phone" ? "phone number" : "email";
  const canNext = code.trim().length >= 4;

  return (
    <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.iconBtn} type="button" onClick={onBack} aria-label="Back">
            ←
          </button>
          <div className={styles.title}>X</div>
          <button className={styles.iconBtn} type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <h3 className={styles.h3}>We sent you a code</h3>
          <p className={styles.helper}>
            Enter it below to verify your {label}: <b>{value || "(not set)"}</b>
          </p>

          <div className={styles.codeRow}>
            <input
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Verification code"
              inputMode="numeric"
              autoFocus
            />
            <span className={styles.smallLink} onClick={() => alert("Resend будет позже (реальная интеграция).")}>
              Didn’t receive a code?
            </span>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.nextBtn} type="button" disabled={!canNext} onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}