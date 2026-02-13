"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

type Me = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  bio?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
};

function formatJoined(dateIso: string) {
  const d = new Date(dateIso);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const m = months[d.getMonth()] ?? "";
  const y = d.getFullYear();
  return `Joined ${m} ${y}`;
}

function EditProfileModal(props: {
  open: boolean;
  initialName: string;
  initialBio: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (data: { displayName: string; bio: string }) => void;
}) {
  const { open, initialName, initialBio, loading, error, onClose, onSave } = props;

  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);

  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setBio(initialBio);
  }, [open, initialName, initialBio]);

  if (!open) return null;

  const canSave = name.trim().length >= 2 && !loading;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        display: "grid",
        placeItems: "start center",
        padding: "24px 14px",
        zIndex: 50,
      }}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(640px, 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(0,0,0,0.92)",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr 88px",
            alignItems: "center",
            padding: "10px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ✕
          </button>

          <div style={{ fontWeight: 800, textAlign: "left", paddingLeft: 4 }}>
            Edit profile
          </div>

          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave({ displayName: name.trim(), bio: bio.trim() })}
            style={{
              justifySelf: "end",
              height: 34,
              padding: "0 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: canSave ? "#fff" : "rgba(255,255,255,0.20)",
              color: canSave ? "#0f1419" : "rgba(255,255,255,0.65)",
              fontWeight: 800,
              cursor: canSave ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 14, display: "grid", gap: 14 }}>
          {/* Banner placeholder */}
          <div
            style={{
              height: 140,
              borderRadius: 16,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                opacity: 0.75,
                fontWeight: 700,
              }}
            >
              Banner (later)
            </div>
          </div>

          {/* Avatar placeholder */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              🙂
            </div>
            <button
              type="button"
              disabled
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 700,
              }}
            >
              Change photo (later)
            </button>
          </div>

          {/* Fields */}
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 700 }}>Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  padding: "0 12px",
                  outline: "none",
                  fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 700 }}>Bio</div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                rows={4}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  padding: "10px 12px",
                  outline: "none",
                  fontSize: 14,
                  resize: "none",
                }}
              />
              <div style={{ fontSize: 12, opacity: 0.6 }}>
                Username (@handle) is not editable.
              </div>
            </div>

            {error ? (
              <div style={{ color: "crimson", fontSize: 13, fontWeight: 700 }}>
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }

    (async () => {
      try {
        const data = await apiFetch<Me>("/auth/me", { method: "GET" });
        setMe(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const joinedText = useMemo(() => {
    if (!me?.createdAt) return "";
    return formatJoined(me.createdAt);
  }, [me?.createdAt]);

  function onLogout() {
    clearToken();
    router.replace("/auth");
  }

  async function onSaveProfile(data: { displayName: string; bio: string }) {
    setSaveErr(null);
    setSaving(true);
    try {
      // ✅ правильный endpoint
      const updated = await apiFetch<Me>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          displayName: data.displayName,
          bio: data.bio,
        }),
      });

      setMe(updated);
      setEditOpen(false);
    } catch (e: any) {
      setSaveErr(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main style={{ padding: 16, color: "#fff" }}>Loading...</main>;
  if (err) return <main style={{ padding: 16, color: "crimson" }}>{err}</main>;
  if (!me) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "18px 14px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Top bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 40px",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
            aria-label="Back"
          >
            ←
          </button>

          <div style={{ textAlign: "center", fontWeight: 800 }}>
            {me.displayName || me.username}
          </div>

          <button
            type="button"
            onClick={onLogout}
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
            aria-label="Logout"
            title="Logout"
          >
            ⎋
          </button>
        </div>

        {/* Banner */}
        <div
          style={{
            height: 170,
            borderRadius: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(800px 300px at 40% 40%, rgba(255,255,255,0.08), rgba(0,0,0,0))",
            }}
          />
        </div>

        {/* Avatar + Edit */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: -36,
            padding: "0 10px",
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "3px solid #000",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
            }}
          >
            🙂
          </div>

          <button
            type="button"
            onClick={() => {
              setSaveErr(null);
              setEditOpen(true);
            }}
            style={{
              height: 36,
              padding: "0 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "transparent",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Edit profile
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: "10px 10px 0", display: "grid", gap: 6 }}>
          <div style={{ fontSize: 20, fontWeight: 900 }}>
            {me.displayName || me.username}
          </div>

          <div style={{ opacity: 0.75, fontWeight: 700 }}>@{me.username}</div>

          {me.bio ? (
            <div style={{ opacity: 0.9, fontWeight: 600 }}>{me.bio}</div>
          ) : null}

          <div
            style={{
              opacity: 0.65,
              fontSize: 13,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span>📅</span>
            <span>{joinedText}</span>
          </div>
        </div>

        {/* Actions row (на телефоне тут будет Create channel) */}
        <div style={{ padding: "14px 10px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            disabled
            style={{
              height: 36,
              padding: "0 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 800,
              cursor: "not-allowed",
            }}
          >
            Create channel (later)
          </button>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        initialName={me.displayName || me.username}
        initialBio={me.bio ?? ""}
        loading={saving}
        error={saveErr}
        onClose={() => setEditOpen(false)}
        onSave={onSaveProfile}
      />
    </main>
  );
}