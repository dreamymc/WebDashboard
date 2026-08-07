"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";

export function ShareLinkModal() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newLinkUrl, setNewLinkUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function close() {
    setOpen(false);
    setLabel(""); setPassword(""); setExpiresAt(""); setMaxUses("");
    setFormError(null); setNewLinkUrl(null); setCopied(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setCreating(true);

    const body: Record<string, unknown> = { label, password };
    if (expiresAt) body.expiresAt = expiresAt;
    if (maxUses) body.maxUses = parseInt(maxUses, 10);

    const res = await fetch("/api/admin/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setCreating(false);

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setFormError(d.error ?? "Failed to create link");
      return;
    }
    const data = await res.json();
    setNewLinkUrl(data.shareUrl);
  }

  async function copyLink() {
    if (!newLinkUrl) return;
    await navigator.clipboard.writeText(newLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "7px 10px",
    fontSize: 13,
    border: "1px solid var(--border-color)",
    background: "var(--bg)",
    color: "var(--text-primary)",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 4,
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-secondary)",
          fontSize: 13,
          fontWeight: 500,
          padding: 0,
        }}
      >
        <Share2 style={{ width: 14, height: 14 }} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={close}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "var(--surface)",
              border: "1px solid var(--border-color)",
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                Create share link
              </h2>
              <button
                onClick={close}
                aria-label="Close"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {!newLinkUrl ? (
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Label *</label>
                  <input style={inputStyle} required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Regional Heads" />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Password *</label>
                  <input style={inputStyle} required type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Share with recipient" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>Expires (default 30d)</label>
                    <input
                      style={inputStyle}
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Max uses</label>
                    <input style={inputStyle} type="number" min="1" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Unlimited" />
                  </div>
                </div>
                {formError && <p style={{ fontSize: 13, color: "var(--danger)", margin: "0 0 12px" }}>{formError}</p>}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    type="button"
                    onClick={close}
                    style={{ padding: "8px 16px", fontSize: 13, color: "var(--text-secondary)", background: "none", border: "1px solid var(--border-color)", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, background: "var(--text-primary)", color: "var(--surface)", border: "none", cursor: creating ? "not-allowed" : "pointer" }}
                  >
                    {creating ? "Creating…" : "Create link"}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
                  Link created. Copy it now — the password won&apos;t be shown again here.
                </p>
                <div style={{ padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--success)", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <code style={{ flex: 1, fontSize: 12, color: "var(--success)", wordBreak: "break-all" }}>{newLinkUrl}</code>
                  <button
                    onClick={copyLink}
                    style={{ flexShrink: 0, padding: "4px 12px", fontSize: 12, border: "1px solid var(--border-color)", background: "var(--surface)", cursor: "pointer", color: "var(--text-primary)" }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href="/admin" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    Manage all links →
                  </a>
                  <button
                    onClick={close}
                    style={{ padding: "8px 16px", fontSize: 13, color: "var(--text-primary)", background: "none", border: "1px solid var(--border-color)", cursor: "pointer" }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
