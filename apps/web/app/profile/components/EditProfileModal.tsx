"use client";

import { useState } from "react";
import styles from "./editProfileModal.module.css";

export function EditProfileModal(props: {
  initialName: string;
  initialBio: string;
  onClose: () => void;
  onSave: (next: { name: string; bio: string }) => void;
}) {
  const { initialName, initialBio, onClose, onSave } = props;

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);

  const canSave = name.trim().length >= 2;

  return (
    <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.iconBtn} type="button" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <div className={styles.title}>Edit profile</div>
          <button
            className={styles.saveBtn}
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ name: name.trim(), bio: bio.trim() })}
          >
            Save
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.banner} />
          <div className={styles.avatarWrap}>
            <div className={styles.avatar} />
            <button className={styles.photoBtn} type="button" disabled>
              Edit Photo
            </button>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>Name</div>
            <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className={styles.field}>
            <div className={styles.label}>Bio</div>
            <textarea
              className={styles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world about you"
              rows={3}
            />
          </div>

          <div className={styles.hint}>Username (@...) менять нельзя.</div>
        </div>
      </div>
    </div>
  );
}