"use client";

import { useMemo } from "react";
import styles from "./modal.module.css";

export function CreateAccountModal(props: {
  displayName: string; // Name (не уникальное)
  username: string; // @handle (уникальный, потом нельзя менять)
  email: string;
  password: string;

  loading?: boolean;
  error?: string | null;

  onChangeDisplayName: (v: string) => void;
  onChangeUsername: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePassword: (v: string) => void;

  onClose: () => void;
  onNext: () => void; // дальше: /auth/register и открытие VerifyCodeModal
}) {
  const {
    displayName,
    username,
    email,
    password,
    loading,
    error,
    onChangeDisplayName,
    onChangeUsername,
    onChangeEmail,
    onChangePassword,
    onClose,
    onNext,
  } = props;

  const cleanUsername = useMemo(() => {
    // приводим к handle: lower, без пробелов, без @, только [a-z0-9_]
    let v = (username || "").trim().toLowerCase();
    v = v.replace(/^@+/, "");
    v = v.replace(/\s+/g, "");
    v = v.replace(/[^a-z0-9_]/g, "");
    return v;
  }, [username]);

  const canNext = useMemo(() => {
    const n = (displayName || "").trim();
    const u = cleanUsername;
    const e = (email || "").trim().toLowerCase();
    const p = (password || "").trim();

    if (loading) return false;

    if (n.length < 2) return false;
    if (u.length < 3) return false; // минимально
    if (!e.includes("@") || e.length < 5) return false;
    if (p.length < 6) return false;

    return true;
  }, [displayName, cleanUsername, email, password, loading]);

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
            disabled={!!loading}
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
              value={displayName}
              onChange={(e) => onChangeDisplayName(e.target.value)}
              placeholder="Name"
              autoFocus
              disabled={!!loading}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Username</span>
              <span style={{ opacity: 0.65, fontSize: 12 }}>
                (can’t be changed later)
              </span>
            </div>
            <input
              className={styles.input}
              value={username}
              onChange={(e) => onChangeUsername(e.target.value)}
              placeholder="handle"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={!!loading}
            />
            <div style={{ marginTop: 6, opacity: 0.75, fontSize: 12 }}>
              Your handle: <b>@{cleanUsername || "..."}</b>
            </div>
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
              disabled={!!loading}
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
              disabled={!!loading}
            />
          </div>

          <p className={styles.helper}>
            Сейчас делаем только email-flow. Телефон убрали.
          </p>

          {error ? (
            <p style={{ color: "crimson", margin: "8px 0 0" }}>{error}</p>
          ) : null}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.nextBtn}
            type="button"
            disabled={!canNext}
            onClick={onNext}
          >
            {loading ? "Loading..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}