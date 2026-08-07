"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type SafeLink = {
  token: string;
  label: string;
  createdAt: string;
  expiresAt: string | null;
  maxUses: number | null;
  useCount: number;
  revoked: boolean;
};

function statusBadge(link: SafeLink): { text: string; color: string } {
  if (link.revoked) return { text: "Revoked", color: "var(--danger)" };
  if (link.expiresAt && new Date(link.expiresAt) < new Date())
    return { text: "Expired", color: "var(--warning)" };
  if (link.maxUses !== null && link.useCount >= link.maxUses)
    return { text: "Max uses", color: "var(--warning)" };
  return { text: "Active", color: "var(--success)" };
}

function fmt(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminPage() {
  const router = useRouter();
  const [links, setLinks] = useState<SafeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [newLinkUrl, setNewLinkUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/links");
    if (res.status === 403) { router.push("/overview"); return; }
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setNewLinkUrl(null);
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
    setLabel(""); setPassword(""); setExpiresAt(""); setMaxUses("");
    load();
  }

  async function handleRevoke(token: string) {
    await fetch("/api/admin/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action: "revoke" }),
    });
    load();
  }

  async function handleDelete(token: string) {
    if (!confirm("Delete this link permanently?")) return;
    await fetch("/api/admin/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action: "delete" }),
    });
    load();
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const cell: React.CSSProperties = {
    padding: "8px 12px",
    fontSize: 13,
    borderBottom: "1px solid var(--border)",
    color: "var(--text-primary)",
    fontVariantNumeric: "tabular-nums",
    verticalAlign: "middle",
  };
  const th: React.CSSProperties = {
    ...cell,
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: "var(--bg)",
  };
  const input: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "7px 10px",
    fontSize: 13,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-primary)",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 24px", display: "flex", alignItems: "center", height: 48 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>T7 Admin</span>
        <span style={{ flex: 1 }} />
        <button onClick={() => router.push("/overview")} style={{ marginRight: 12, fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "0 8px" }}>← Dashboard</button>
        <button onClick={handleLogout} style={{ fontSize: 13, color: "var(--danger)", background: "none", border: "1px solid var(--border)", cursor: "pointer", padding: "4px 12px" }}>Log out</button>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 24px", color: "var(--text-primary)" }}>Share Links</h1>

        {/* Create form */}
        <div style={{ border: "1px solid var(--border)", background: "var(--surface)", padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Create new link</h2>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Label *</label>
                <input style={input} required value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Regional Heads" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Password *</label>
                <input style={input} required type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Share with recipient" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Expires (default 30d)</label>
                <input style={input} type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Max uses (optional)</label>
                <input style={input} type="number" min="1" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Unlimited" />
              </div>
            </div>
            {formError && <p style={{ fontSize: 13, color: "var(--danger)", margin: "0 0 8px" }}>{formError}</p>}
            <button type="submit" disabled={creating} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, background: "var(--text-primary)", color: "var(--surface)", border: "none", cursor: creating ? "not-allowed" : "pointer" }}>
              {creating ? "Creating…" : "Create link"}
            </button>
          </form>

          {newLinkUrl && (
            <div style={{ marginTop: 16, padding: "12px 16px", background: "var(--bg)", border: "1px solid var(--success)", display: "flex", alignItems: "center", gap: 12 }}>
              <code style={{ flex: 1, fontSize: 12, color: "var(--success)", wordBreak: "break-all" }}>{newLinkUrl}</code>
              <button onClick={() => copyLink(newLinkUrl)} style={{ flexShrink: 0, padding: "4px 12px", fontSize: 12, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", color: "var(--text-primary)" }}>
                {copied === newLinkUrl ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {/* Links table */}
        <div style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
          {loading ? (
            <p style={{ padding: 24, color: "var(--text-muted)", fontSize: 14 }}>Loading…</p>
          ) : links.length === 0 ? (
            <p style={{ padding: 24, color: "var(--text-muted)", fontSize: 14 }}>No share links yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Label", "Created", "Expires", "Uses", "Status", "Actions"].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {links.map(link => {
                  const status = statusBadge(link);
                  return (
                    <tr key={link.token}>
                      <td style={cell}>{link.label}</td>
                      <td style={cell}>{fmt(link.createdAt)}</td>
                      <td style={cell}>{fmt(link.expiresAt)}</td>
                      <td style={cell}>{link.useCount}{link.maxUses !== null ? ` / ${link.maxUses}` : ""}</td>
                      <td style={cell}>
                        <span style={{ color: status.color, fontWeight: 600, fontSize: 12 }}>{status.text}</span>
                      </td>
                      <td style={cell}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => copyLink(`${window.location.origin}/login?t=${link.token}`)} style={{ fontSize: 12, padding: "3px 8px", border: "1px solid var(--border)", background: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                            {copied === `${window.location.origin}/login?t=${link.token}` ? "Copied!" : "Copy link"}
                          </button>
                          {!link.revoked && (
                            <button onClick={() => handleRevoke(link.token)} style={{ fontSize: 12, padding: "3px 8px", border: "1px solid var(--border)", background: "none", cursor: "pointer", color: "var(--warning)" }}>
                              Revoke
                            </button>
                          )}
                          <button onClick={() => handleDelete(link.token)} style={{ fontSize: 12, padding: "3px 8px", border: "1px solid var(--border)", background: "none", cursor: "pointer", color: "var(--danger)" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
