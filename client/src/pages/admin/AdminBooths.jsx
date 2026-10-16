import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const AdminBooths = () => {
  const { id: expoId } = useParams();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingAction, setPendingAction] = useState(false);

  const [selectedBooth, setSelectedBooth] = useState(null);
  const [selectedExhibitorId, setSelectedExhibitorId] = useState("");
  const [boothFormData, setBoothFormData] = useState({ price: 500, size: "3x3 m", details: "", status: "available" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expoRes, boothRes, appRes] = await Promise.all([
        api.get(`/expos/${expoId}`),
        api.get(`/expos/${expoId}/booths`),
        api.get(`/applications?expo=${expoId}&status=approved`),
      ]);
      setExpo(expoRes.data);
      setBooths(boothRes.data);
      setApprovedApplications(appRes.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load booth management data");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [expoId]);

  useEffect(() => {
    if (!socket) return;
    const handleBoothUpdated = (data) => {
      if (data?.expoId === expoId || !data?.expoId) fetchData();
    };
    socket.on("booth:updated", handleBoothUpdated);
    return () => socket.off("booth:updated", handleBoothUpdated);
  }, [socket, expoId]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setSelectedExhibitorId("");
    setBoothFormData({
      price: booth.price || 500, size: booth.size || "3x3 m",
      details: booth.details || "", status: booth.status || "available",
    });
    setError(""); setSuccess("");
  };

  const handleUpdateBooth = async (e) => {
    e.preventDefault();
    if (!selectedBooth || pendingAction) return;
    setPendingAction(true);
    try {
      await api.put(`/booths/${selectedBooth._id}`, boothFormData);
      setSuccess("Booth details updated successfully!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to update booth");
    } finally { setPendingAction(false); }
  };

  const handleAssignBooth = async () => {
    if (!selectedBooth || !selectedExhibitorId || pendingAction) {
      return setError("Please select an approved exhibitor to assign");
    }
    setPendingAction(true);
    try {
      await api.put(`/booths/${selectedBooth._id}/assign`, { exhibitorId: selectedExhibitorId });
      setSuccess("Booth assigned successfully!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to assign booth");
    } finally { setPendingAction(false); }
  };

  const handleConfirmBooth = async () => {
    if (!selectedBooth || pendingAction) return;
    setPendingAction(true);
    try {
      await api.put(`/booths/${selectedBooth._id}/confirm`);
      setSuccess("Booth reservation confirmed to booked!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to confirm booth");
    } finally { setPendingAction(false); }
  };

  const handleReleaseBooth = async () => {
    if (!selectedBooth || pendingAction) return;
    setPendingAction(true);
    try {
      await api.put(`/booths/${selectedBooth._id}/release`);
      setSuccess("Booth released back to available!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to release booth");
    } finally { setPendingAction(false); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return { bg: "var(--color-kiwi, #abf139)", text: "#000" };
      case "reserved": return { bg: "var(--color-selective-yellow, #feb804)", text: "#000" };
      case "booked": return { bg: "var(--color-primary, #ff3e33)", text: "#fff" };
      default: return { bg: "#e5e7eb", text: "#000" };
    }
  };

  const available = booths.filter((b) => b.status === "available").length;
  const reserved = booths.filter((b) => b.status === "reserved").length;
  const booked = booths.filter((b) => b.status === "booked").length;
  const occupancy = booths.length ? Math.round((booked / booths.length) * 100) : 0;

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["FLOOR PLAN ALLOCATION", `${booths.length} BOOTHS`, `${available} AVAILABLE`, `${booked} BOOKED`, `${occupancy}% OCCUPANCY`]} color="var(--color-cerulean, #14a6ea)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={`${occupancy}% FILL`} size={90} bg="var(--color-cerulean, #14a6ea)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <Link to="/admin/expos" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, color: "var(--color-dark, #231e25)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1.5px solid #000", borderRadius: 3, background: "#fff", boxShadow: "2px 2px 0 #000", marginBottom: 12 }}>
            ← BACK TO EXPOS
          </Link>
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
              <PulseDot color="#fff" size={6} glow={false} />
              [ FLOOR PLAN ALLOCATION ]
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 6px 0", letterSpacing: 1 }}>
              MANAGE BOOTHS — {expo?.title || "EXPO FLOOR"}
            </h1>
            {expo && (
              <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280", margin: 0, fontWeight: 700 }}>
                📍 {expo.location} · 🗓 {new Date(expo.startDate).toLocaleDateString()} → {new Date(expo.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            style={{ background: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "4px 4px 0 var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
            <PulseDot color="var(--color-primary, #ff3e33)" size={9} /> Error: {error}
          </motion.div>
        )}
        {success && (
          <motion.div key="suc" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ background: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "4px 4px 0 var(--color-dark, #231e25)", padding: "12px 16px", color: "#000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 10, position: "relative", overflow: "hidden" }}>
            <ShineSweep duration={1.6} delay={0.2} opacity={0.4} />
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#000", color: "var(--color-kiwi, #abf139)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, border: "2px solid #000", flexShrink: 0 }}>✓</span>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEGEND */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
        style={{ background: "var(--color-light, #fff8eb)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "5px 5px 0 var(--color-dark, #231e25)", padding: "14px 20px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.6, position: "relative", zIndex: 2 }}>STATUS LEGEND:</span>
        {[
          { c: "var(--color-kiwi, #abf139)", label: "AVAILABLE", count: available },
          { c: "var(--color-selective-yellow, #feb804)", label: "RESERVED", count: reserved },
          { c: "var(--color-primary, #ff3e33)", label: "BOOKED", count: booked },
        ].map((l) => (
          <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, fontFamily: "'Satoshi', sans-serif", letterSpacing: 0.4, position: "relative", zIndex: 2, background: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "4px 10px", borderRadius: 30 }}>
            <span style={{ width: 12, height: 12, background: l.c, border: "1.5px solid #000", borderRadius: 2, display: "inline-block" }} />
            {l.label}
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "#4b5563" }}>({l.count})</span>
          </span>
        ))}
      </motion.div>

      {/* BOOTH GRID */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "24px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.25} opacity={0.18} />

        {loading ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, textAlign: "center", padding: "40px 0", position: "relative", zIndex: 2, color: "#6b7280" }}>
            Loading booth spaces...
          </p>
        ) : booths.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, textAlign: "center", padding: "40px 0", position: "relative", zIndex: 2, color: "#6b7280" }}>
            No booth spaces created for this expo.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14, position: "relative", zIndex: 2 }}>
            {booths.map((booth, idx) => {
              const { bg, text } = getStatusColor(booth.status);
              const isSelected = selectedBooth?._id === booth._id;
              return (
                <motion.div key={booth._id}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: idx * 0.02, type: "spring", stiffness: 320, damping: 22 }}
                  whileHover={{ scale: 1.06, y: -4, boxShadow: "5px 5px 0 #000" }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleBoothClick(booth)}
                  style={{
                    position: "relative", overflow: "hidden",
                    background: bg, color: text,
                    border: isSelected ? "3px solid #000" : "2.5px solid var(--color-dark, #231e25)",
                    boxShadow: isSelected ? "5px 5px 0 #000" : "3px 3px 0 var(--color-dark, #231e25)",
                    padding: "14px 10px", borderRadius: 4, textAlign: "center",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    justifyContent: "space-between", gap: 4, minHeight: 106,
                  }}>
                  {booth.status === "available" && <ShineSweep duration={1.6} delay={idx * 0.03} opacity={0.35} />}
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1, letterSpacing: 1 }}>{booth.boothNumber}</div>
                  <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 900 }}>${booth.price}</div>
                  <div style={{ fontSize: 9.5, fontFamily: "'Satoshi', sans-serif", fontWeight: 900, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: 0.4, borderTop: "1.5px dashed rgba(0,0,0,0.3)", paddingTop: 5 }}>
                    {booth.exhibitor?.company || booth.exhibitor?.name || booth.status}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedBooth && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(35, 30, 37, 0.78)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: 20 }}
            onClick={() => !pendingAction && setSelectedBooth(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "12px 12px 0 var(--color-dark, #231e25)", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: "26px", position: "relative" }}>
              <CornerBrackets color="#000" inset={10} size={13} thickness={3} />
              <Scanline color="rgba(20,166,234,0.28)" height={70} duration={2.4} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2.5px solid #000", paddingBottom: 14, marginBottom: 16, position: "relative", zIndex: 2, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: getStatusColor(selectedBooth.status).bg, color: getStatusColor(selectedBooth.status).text, padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 6, fontFamily: "'Satoshi', sans-serif" }}>
                    <PulseDot color={getStatusColor(selectedBooth.status).text} size={6} glow={false} />
                    {selectedBooth.status.toUpperCase()}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0, letterSpacing: 1 }}>
                    BOOTH {selectedBooth.boothNumber}
                  </h3>
                </div>
                <button onClick={() => !pendingAction && setSelectedBooth(null)} disabled={pendingAction}
                  style={{ background: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0 #000", width: 32, height: 32, borderRadius: "50%", cursor: pendingAction ? "not-allowed" : "pointer", fontFamily: "var(--font-display)", fontSize: 16, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  ✕
                </button>
              </div>

              {selectedBooth.exhibitor && (
                <div style={{ background: "#fff", border: "2px solid #000", boxShadow: "3px 3px 0 #000", padding: "12px 14px", marginBottom: 16, fontFamily: "'Satoshi', sans-serif", fontSize: 12.5, lineHeight: 1.55, position: "relative", zIndex: 2 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 900, letterSpacing: 1, color: "var(--color-primary, #ff3e33)", textTransform: "uppercase", marginBottom: 6 }}>
                    <PulseDot color="var(--color-primary, #ff3e33)" size={5} glow={false} />
                    ASSIGNED EXHIBITOR
                  </div>
                  <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.4 }}>{selectedBooth.exhibitor.name}</strong>
                  <span><strong>Company:</strong> {selectedBooth.exhibitor.company || "N/A"}</span><br />
                  <span><strong>Email:</strong> {selectedBooth.exhibitor.email}</span>
                </div>
              )}

              <form onSubmit={handleUpdateBooth} style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 2 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>Dimensions</label>
                    <input type="text" value={boothFormData.size} onChange={(e) => setBoothFormData({ ...boothFormData, size: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>Price ($)</label>
                    <input type="number" value={boothFormData.price} onChange={(e) => setBoothFormData({ ...boothFormData, price: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box", outline: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>Status</label>
                  <select value={boothFormData.status} onChange={(e) => setBoothFormData({ ...boothFormData, status: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box", outline: "none" }}>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                <motion.button type="submit" disabled={pendingAction} whileHover={{ y: -3, boxShadow: "6px 6px 0 #000" }} whileTap={{ y: 1, boxShadow: "2px 2px 0 #000" }}
                  style={{ position: "relative", overflow: "hidden", background: "var(--color-dark, #231e25)", color: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "11px", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, cursor: pendingAction ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {pendingAction && <PulseDot color="#fff" size={7} glow={false} />}
                  {pendingAction ? "SAVING..." : "SAVE BOOTH DETAILS"}
                </motion.button>
              </form>

              {selectedBooth.status === "available" && (
                <div style={{ borderTop: "2px dashed #000", paddingTop: 16, marginTop: 16, position: "relative", zIndex: 2 }}>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: "0 0 10px 0", letterSpacing: 0.6, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <PulseDot color="var(--color-kiwi, #abf139)" size={7} glow={false} />
                    ASSIGN TO APPROVED EXHIBITOR
                  </h4>
                  <select value={selectedExhibitorId} onChange={(e) => setSelectedExhibitorId(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginBottom: 10, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box", outline: "none" }}>
                    <option value="">-- Select Approved Exhibitor --</option>
                    {approvedApplications.map((app) => (
                      <option key={app._id} value={app.exhibitor?._id}>
                        {app.exhibitor?.name} ({app.companyName || app.exhibitor?.company})
                      </option>
                    ))}
                  </select>
                  <motion.button onClick={handleAssignBooth} disabled={pendingAction} whileHover={{ y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={{ y: 1 }}
                    style={{ background: "var(--color-kiwi, #abf139)", color: "#000", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "11px 16px", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, cursor: pendingAction ? "not-allowed" : "pointer", width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {pendingAction && <PulseDot color="#000" size={7} glow={false} />}
                    ASSIGN BOOTH SPACE
                  </motion.button>
                </div>
              )}

              {selectedBooth.status === "reserved" && (
                <div style={{ borderTop: "2px dashed #000", paddingTop: 16, marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, position: "relative", zIndex: 2 }}>
                  <motion.button onClick={handleConfirmBooth} disabled={pendingAction} whileHover={{ y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={{ y: 1 }}
                    style={{ background: "var(--color-kiwi, #abf139)", color: "#000", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "11px", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 0.6, cursor: pendingAction ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {pendingAction && <PulseDot color="#000" size={6} glow={false} />}
                    ✓ CONFIRM BOOKING
                  </motion.button>
                  <motion.button onClick={handleReleaseBooth} disabled={pendingAction} whileHover={{ y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={{ y: 1 }}
                    style={{ background: "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "11px", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 0.6, cursor: pendingAction ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {pendingAction && <PulseDot color="#fff" size={6} glow={false} />}
                    ✕ RELEASE
                  </motion.button>
                </div>
              )}

              {selectedBooth.status === "booked" && (
                <div style={{ borderTop: "2px dashed #000", paddingTop: 16, marginTop: 16, position: "relative", zIndex: 2 }}>
                  <motion.button onClick={handleReleaseBooth} disabled={pendingAction} whileHover={{ y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={{ y: 1 }}
                    style={{ width: "100%", background: "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "11px", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.6, cursor: pendingAction ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {pendingAction && <PulseDot color="#fff" size={7} glow={false} />}
                    ✕ RELEASE & CANCEL BOOKING
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBooths;