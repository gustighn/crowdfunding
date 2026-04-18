import { useState, useEffect } from "react";
import { nativeToScVal } from "@stellar/stellar-sdk";
import { useContract } from "./hooks/useContract";

// - Styles --------------------------
const s = {
  app: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2.5rem 1.5rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "3rem",
    paddingBottom: "0",
    borderBottom: "none",
  },
  title: { 
    fontSize: "2rem", 
    fontWeight: 700, 
    margin: 0,
    color: "#f1f5f9",
    letterSpacing: "-0.5px",
  },
  btnPrimary: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "0.65rem 1.5rem",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
  },
  btnOutline: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#cbd5e1",
    border: "1.5px solid #475569",
    padding: "0.65rem 1.5rem",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
  },
  btnDonate: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "0.55rem 1.2rem",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
    transition: "all 0.3s ease",
  },
  walletInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  address: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    fontFamily: "Courier, monospace",
    background: "rgba(30, 41, 59, 0.6)",
    padding: "0.5rem 1rem",
    borderRadius: 5,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(71, 85, 105, 0.5)",
  },
  balance: { 
    fontSize: "0.85rem", 
    color: "#60a5fa", 
    fontWeight: 700,
    background: "rgba(59, 130, 246, 0.15)",
    padding: "0.35rem 0.75rem",
    borderRadius: 4,
  },
  walletRow: { display: "flex", alignItems: "center", gap: 12 },
  card: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    borderRadius: 12,
    padding: "1.75rem",
    marginBottom: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  form: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    borderRadius: 12,
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  input: {
    width: "100%",
    border: "1.5px solid #475569",
    borderRadius: 8,
    padding: "0.8rem 1rem",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    marginBottom: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    background: "rgba(15, 23, 42, 0.5)",
    color: "#e2e8f0",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#cbd5e1",
    marginBottom: "0.5rem",
    letterSpacing: "0.3px",
  },
  error: { 
    color: "#fca5a5", 
    fontSize: "0.85rem", 
    margin: "0.75rem 0",
    padding: "0.75rem 1rem",
    background: "rgba(220, 38, 38, 0.15)",
    borderRadius: 6,
    borderLeft: "3px solid #dc2626",
  },
  success: { 
    color: "#86efac", 
    fontSize: "0.85rem", 
    margin: "0.75rem 0",
    padding: "0.75rem 1rem",
    background: "rgba(16, 185, 129, 0.15)",
    borderRadius: 6,
    borderLeft: "3px solid #10b981",
  },
  campaignTitle: { 
    margin: "0 0 0.5rem", 
    fontSize: "1.2rem", 
    fontWeight: 700,
    color: "#f1f5f9",
  },
  campaignBody: { 
    margin: "0 0 1rem", 
    color: "#cbd5e1", 
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  campaignFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1.25rem",
    paddingTop: "1rem",
    borderTop: "1px solid rgba(71, 85, 105, 0.3)",
  },
  campaignStats: {
    fontSize: "0.85rem",
    color: "#94a3b8",
  },
  sectionTitle: { 
    fontWeight: 700, 
    marginBottom: "1.5rem", 
    color: "#f1f5f9",
    fontSize: "1.1rem",
    letterSpacing: "0.3px",
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "3rem 2rem",
    fontSize: "1rem",
    background: "rgba(30, 41, 59, 0.3)",
    borderRadius: 12,
  },
};

export default function App() {
  // - Hook - semua fungsi wallet & contract ada di sini ---
  const {
    publicKey,
    isWalletConnected,
    walletLoading,
    walletError,
    connectWallet,
    disconnectWallet,
    readContract,
    writeContract,
    txLoading,
    txError,
    txSuccess,
    xlmBalance,
  } = useContract();

  // - State lokal ----------------------
  const [campaigns, setCampaigns] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");

  // Load campaign saat pertama kali halaman dibuka
  useEffect(() => {
    loadCampaigns();
  }, []);

  // - Fungsi-fungsi ---------------------

  async function loadCampaigns() {
    const data = await readContract("get_campaigns");
    setCampaigns(data || []);
  }

  async function handleCreate() {
    await writeContract("create_campaign", [
      nativeToScVal(title, { type: "string" }),
      nativeToScVal(description, { type: "string" }),
      nativeToScVal(Number(target), { type: "u64" }),
      nativeToScVal(Math.floor(Date.now() / 1000), { type: "u64" }),
      nativeToScVal(publicKey, { type: "address" }),
    ]);

    await loadCampaigns();
  }

  async function handleDonate(id) {
    await writeContract("donate", [
      nativeToScVal(id, { type: "u64" }),
      nativeToScVal(10, { type: "u64" }), // contoh 10 XLM
    ]);

    await loadCampaigns();
  }

  // - UI ---------------------------
  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>Crowdfunding DApp</h1>

        {isWalletConnected ? (
          <div style={s.walletInfo}>
            <div style={s.walletRow}>
              <span style={s.address}>
                {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
              </span>
              <button style={s.btnOutline} onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
            {xlmBalance !== null && (
              <span style={s.balance}>
                {parseFloat(xlmBalance).toFixed(2)} XLM
              </span>
            )}
          </div>
        ) : (
          <button
            style={s.btnPrimary}
            onClick={connectWallet}
            disabled={walletLoading}
          >
            {walletLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {/* Error & status transaksi */}
      {walletError && <p style={s.error}>⚠ {walletError}</p>}
      {txError && <p style={s.error}>⚠ {txError}</p>}
      {txSuccess && <p style={s.success}>✓ Transaction confirmed!</p>}

      {/* Form buat note - hanya muncul kalau wallet sudah connect */}
      {isWalletConnected && (
        <div style={s.form}>
          <p style={s.sectionTitle}>Create New Campaign</p>

          <label style={s.label}>Campaign Title</label>
          <input
            style={s.input}
            placeholder="What's your campaign about?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label style={s.label}>Description</label>
          <input
            style={s.input}
            placeholder="Tell us more details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label style={s.label}>Target Amount (XLM)</label>
          <input
            style={s.input}
            placeholder="Enter target amount..."
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            type="number"
          />

          <button
            style={{...s.btnPrimary, width: "100%", marginTop: "0.5rem"}}
            onClick={handleCreate}
            disabled={txLoading || !title || !description || !target}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.background = "#2563eb";
                e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#3b82f6";
              e.target.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.3)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            {txLoading ? "Creating..." : "Create Campaign"}
          </button>
        </div>
      )}

      {/* Daftar notes */}
      <p style={s.sectionTitle}>All Campaign ({campaigns.length})</p>

      {campaigns.length === 0 ? (
        <p style={s.empty}>No campaigns yet. Be the first to create one! 🚀</p>
      ) : (
        campaigns.map((c) => (
          <div key={c.id} style={s.card}>
            <h3 style={s.campaignTitle}>{c.title}</h3>
            <p style={s.campaignBody}>{c.description}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <span style={s.label}>Target</span>
                <p style={{ ...s.campaignStats, margin: 0, fontSize: "1rem", fontWeight: 600, color: "#60a5fa" }}>
                  {Number(c.target)} XLM
                </p>
              </div>
              <div>
                <span style={s.label}>Raised</span>
                <p style={{ ...s.campaignStats, margin: 0, fontSize: "1rem", fontWeight: 600, color: "#10b981" }}>
                  {Number(c.raised)} XLM
                </p>
              </div>
            </div>

            <div style={{ 
              background: "rgba(30, 58, 138, 0.3)", 
              borderRadius: 8, 
              padding: "0.75rem", 
              marginBottom: "1rem",
              textAlign: "center",
              border: "1px solid rgba(96, 165, 250, 0.2)",
            }}>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#93c5fd", fontWeight: 600 }}>
                {(Number(c.target) > 0 ? ((Number(c.raised) / Number(c.target)) * 100).toFixed(0) : 0)}% funded
              </p>
            </div>

            <div style={s.campaignFooter}>
              <span style={s.campaignStats}>ID: {c.id}</span>
              <button 
                onClick={() => handleDonate(c.id)}
                style={{
                  ...s.btnDonate,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#059669";
                  e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.4)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#10b981";
                  e.target.style.boxShadow = "none";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                💰 Donate 10 XLM
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
