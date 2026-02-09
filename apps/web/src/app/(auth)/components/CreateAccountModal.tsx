"use client";

import styles from "./modal.module.css";

type SignupMethod = "phone" | "email";

export function CreateAccountModal(props: {
  method: SignupMethod;
  name: string;
  value: string;
  onChangeName: (v: string) => void;
  onChangeValue: (v: string) => void;
  onToggleMethod: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const { method, name, value, onChangeName, onChangeValue, onToggleMethod, onClose, onNext } = props;

  const secondaryLabel = method === "phone" ? "Phone" : "Email";
  const switchText = method === "phone" ? "Use email instead" : "Use phone instead";
  const placeholder = method === "phone" ? "+31 6 1234 5678" : "you@mail.com";

  const canNext = name.trim().length >= 2 && value.trim().length >= 3;

  return (
    <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.iconBtn} type="button" onClick={onClose} aria-label="Close">
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
              <span className={styles.label}>{secondaryLabel}</span>
              <span className={styles.switchLink} onClick={onToggleMethod}>
                {switchText}
              </span>
            </div>
            <input
              className={styles.input}
              value={value}
              onChange={(e) => onChangeValue(e.target.value)}
              placeholder={placeholder}
              inputMode={method === "phone" ? "tel" : "email"}
            />
          </div>

          <p className={styles.helper}>
            Date of birth и прочие поля добавим позже — сейчас собираем UX как у X.
          </p>
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