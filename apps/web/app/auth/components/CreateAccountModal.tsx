"use client";

import { useMemo } from "react";
import styles from "./modal.module.css";

export function CreateAccountModal(props: {
  name: string; // displayName (можно же и username)
  email: string;
  password: string;

  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;

  onClose: () => void;
  onNext: () => void; // дальше: отправка /auth/register и открытие VerifyCodeModal
}) {
  const {
    name,
    email,
    password,
    onChangeName,
    onChangeEmail,
    onChangePassword,
    onClose,
    onNext,
  } = props;

  const canNext = useMemo(() => {
    const n = name.trim();
    const e = email.trim();
    const p = password.trim();
    // минимальные проверки (чтобы кнопка не была всегда активна)
    if (n.length < 2) return false;
    if (!e.includes("@") || e.length < 5) return false;
    if (p.length < 6) return false;
    return true;
  }, [name, email, password]);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button
            className={styles.iconBtn}
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          <div className={styles.title}>X</div>
          <div />
        </div>

        <div className={styles.body}>
          <h3 className={styles.h3}>Create your account</h3>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Name</span>
            </div>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Name"
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Email</span>
            </div>
            <input
              className={styles.input}
              value={email}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="you@mail.com"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Password</span>
            </div>
            <input
              className={styles.input}
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              placeholder="Minimum 6 characters"
              type="password"
            />
          </div>

          <p className={styles.helper}>
            Сейчас делаем только email-flow. Телефон убрали.
          </p>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.nextBtn}
            type="button"
            disabled={!canNext}
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}