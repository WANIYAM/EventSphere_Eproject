import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const ExhibitorBooths = () => {
  const { socket } = useSocket();
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState("");
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingAction, setPendingAction] = useState(false);

  const [myBooth, setMyBooth] = useState(null);
  const [detailsText, setDetailsText] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/my");
      const approved = res.data.filter((app) => app.status === "approved");
      setApprovedApplications(approved);
      if (approved.length > 0) {
        setSelectedExpoId(approved[0].expo._id || approved[0].expo);
      }
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load applications");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const fetchExpoBooths = async (expoId) => {
    if (!expoId) return;
    try {
      const res = await api.get(`/expos/${expoId}/booths`);
      setBooths(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load booth layout");
    }
  };

  useEffect(() => { if (selectedExpoId) fetchExpoBooths(selectedExpoId); }, [selectedExpoId]);

  useEffect(() => {
    if (!socket) return;
    const handleBoothUpdated = (data) => {
      if (data?.expoId === selectedExpoId || !data?.expoId) {
        if (selectedExpoId) fetchExpoBooths(selectedExpoId);
      }
    };
    socket.on("booth:updated", handleBoothUpdated);
    return () => socket.off("booth:updated", handleBoothUpdated);
  }, [socket, selectedExpoId]);

  useEffect(() => {
    const currentApp = approvedApplications.find((app) => (app.expo._id || app.expo) === selectedExpoId);
    if (currentApp && currentApp.booth) {
      const boothObj = booths.find((b) => b._id === (currentApp.booth._id || currentApp.booth));
      setMyBooth(boothObj || currentApp.booth);
      if (boothObj) {
        setDetailsText(boothObj.details || "");
        setStaffList(boothObj.staff || []);
      }
    } else {
      setMyBooth(null); setDetailsText(""); setStaffList([]);
    }
  }, [selectedExpoId, booths, approvedApplications]);

  const handleReserve = async (booth) => {
    if (pendingAction) return;
    if (window.confirm(`Are you sure you want to reserve Booth ${booth.boothNumber}?`)) {
      setError(""); setSuccess(""); setPendingAction(true);
      try {
        await api.put(`/booths/${booth._id}/reserve`);
        setSuccess(`Booth ${booth.boothNumber} reserved successfully! Waiting for admin confirmation.`);
        fetchApplications();
        if (selectedExpoId) fetchExpoBooths(selectedExpoId);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to reserve booth");
      } finally { setPendingAction(false); }
    }
  };

  const handleCancelReservation = async () => {
    if (!myBooth || pendingAction) return;
    if (window.confirm("Cancel your booth reservation?")) {
      setError(""); setSuccess(""); setPendingAction(true);
      try {
        await api.put(`/booths/${myBooth._id}/cancel`);
        setSuccess("Reservation cancelled successfully.");
        fetchApplications();
        if (selectedExpoId) fetchExpoBooths(selectedExpoId);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to cancel reservation");
      } finally { setPendingAction(false); }
    }
  };

  const handleAddStaff = () => {
    if (!newStaffName.trim()) return;
    setStaffList([...staffList, { name: newStaffName.trim(), role: newStaffRole.trim() }]);
    setNewStaffName(""); setNewStaffRole("");
  };

  const handleRemoveStaff = (index) => setStaffList(staffList.filter((_, i) => i !== index));

  const handleSaveMyBoothDetails = async (e) => {
    e.preventDefault();
    if (!myBooth || pendingAction) return;
    setError(""); setSuccess(""); setPendingAction(true);
    try {
      await api.put(`/booths/${myBooth._id}/my-details`, { details: detailsText, staff: staffList });
      setSuccess("Booth details & staff roster saved successfully!");
      fetchExpoBooths(selectedExpoId);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to save booth details");
    } finally { setPendingAction(false); }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4px" }}>
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <Scanline color="rgba(255,62,51,0.3)" height={70} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-primary, #ff3e33)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>LOADING BOOTH SELF-SELECTION...</p>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["FLOOR PLAN SELF-SELECTION", `${booths.length} BOOTHS`, `${approvedApplications.length} APPROVED EXPOS`, "REALTIME BOOTH SYNC"]} color="var(--color-primary, #ff3e33)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text={myBooth ? `BOOTH ${myBooth.boothNumber}` : "SELECT"} size={92} bg="var(--color-primary, #ff3e33)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primary, #ff3e33)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <PulseDot color="#fff" size={6} glow={false} />
            [ FLOOR PLAN SELF-SELECTION ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 6px 0", letterSpacing: 1 }}>
            BOOTH SELECTION & ROSTER
          </h1>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, color: "#6b7280", margin: 0, fontWeight: 600 }}>
            Click an available booth to reserve it, then manage your staff roster.
          </p>
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

      {approvedApplications.length === 0 ? (
        <div style={{ background: "var(--color-light, #fff8eb)", border: "2.5px solid #000", boxShadow: "5px 5px 0 #000", padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={10} thickness={2} />
          You don't have any approved applications yet. Once an organizer approves your booth application, you will be able to select and manage your booth space here.
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "5px 5px 0 var(--color-dark, #231e25)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, position: "relative", overflow: "hidden" }}>
            <CornerBrackets color="#000" inset={7} size={10} thickness={2} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 2, flexWrap: "wrap" }}>
              <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>Approved Expo:</label>
              <select value={selectedExpoId} onChange={(e) => setSelectedExpoId(e.target.value)}
                style={{ padding: "8px 14px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, background: "#fff", boxShadow: "2px 2px 0 #000", outline: "none" }}>
                {approvedApplications.map((app) => (
                  <option key={app._id} value={app.expo._id || app.expo}>{app.expo.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", position: "relative", zIndex: 2 }}>
              {[
                { c: "var(--color-kiwi, #abf139)", l: "AVAILABLE" },
                { c: "var(--color-selective-yellow, #feb804)", l: "RESERVED" },
                { c: "var(--color-primary, #ff3e33)", l: "BOOKED" },
              ].map((x) => (
                <span key={x.l} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, fontFamily: "'Satoshi', sans-serif", background: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "4px 10px", borderRadius: 30, letterSpacing: 0.4 }}>
                  <span style={{ width: 10, height: 10, background: x.c, border: "1.5px solid #000", borderRadius: 2, display: "inline-block" }} />
                  {x.l}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "22px", position: "relative", overflow: "hidden" }}>
            <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
            <ShineSweep duration={1.7} delay={0.25} opacity={0.18} />

            {booths.length === 0 ? (
              <p style={{ textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, color: "#6b7280", padding: "20px 0", position: "relative", zIndex: 2 }}>
                No booths created for this expo yet.
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14, position: "relative", zIndex: 2 }}>
                {booths.map((booth, idx) => {
                  const bg = booth.status === "available" ? "var(--color-kiwi, #abf139)" : booth.status === "reserved" ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)";
                  const text = booth.status === "booked" ? "#fff" : "#000";
                  const clickable = booth.status === "available" && !myBooth && !pendingAction;
                  const isMyBooth = myBooth?._id === booth._id;

                  return (
                    <motion.div key={booth._id}
                      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: idx * 0.02, type: "spring", stiffness: 320, damping: 22 }}
                      whileHover={clickable ? { scale: 1.06, y: -4, boxShadow: "5px 5px 0 #000" } : {}}
                      whileTap={clickable ? { scale: 0.96 } : {}}
                      onClick={() => clickable && handleReserve(booth)}
                      style={{
                        position: "relative", overflow: "hidden",
                        background: bg, color: text,
                        border: isMyBooth ? "3px solid #000" : "2.5px solid var(--color-dark, #231e25)",
                        boxShadow: isMyBooth ? "5px 5px 0 #000" : "3px 3px 0 var(--color-dark, #231e25)",
                        padding: "12px 10px", borderRadius: 4, textAlign: "center",
                        cursor: clickable ? "pointer" : "default",
                        display: "flex", flexDirection: "column",
                        justifyContent: "space-between", gap: 4, minHeight: 90,
                      }}>
                      {booth.status === "available" && !myBooth && <ShineSweep duration={1.6} delay={idx * 0.03} opacity={0.35} />}
                      {isMyBooth && (
                        <span style={{ position: "absolute", top: 4, right: 4, background: "#000", color: "#fff", fontSize: 8, fontWeight: 900, padding: "2px 5px", borderRadius: 2, letterSpacing: 0.6 }}>
                          MINE
                        </span>
                      )}
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, lineHeight: 1, letterSpacing: 1 }}>{booth.boothNumber}</div>
                      <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11.5, fontWeight: 900 }}>${booth.price}</div>
                      <div style={{ fontSize: 9.5, fontFamily: "'Satoshi', sans-serif", fontWeight: 900, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", borderTop: "1.5px dashed rgba(0,0,0,0.3)", paddingTop: 4, letterSpacing: 0.4 }}>
                        {booth.exhibitor?.company || booth.exhibitor?.name || booth.status}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {myBooth && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "26px", position: "relative", overflow: "hidden" }}>
              <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
              <ShineSweep duration={1.7} delay={0.2} opacity={0.2} />
              <TickStrip color="rgba(0,0,0,0.3)" gap={14} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px dashed #000", paddingBottom: 14, marginBottom: 18, position: "relative", zIndex: 2, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-dark, #231e25)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 6, fontFamily: "'Satoshi', sans-serif" }}>
                    <PulseDot color={myBooth.status === "reserved" ? "var(--color-selective-yellow, #feb804)" : "var(--color-kiwi, #abf139)"} size={6} glow={false} />
                    {myBooth.status === "reserved" ? "RESERVED — AWAITING CONFIRMATION" : "CONFIRMED BOOKING"}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0, letterSpacing: 0.8 }}>
                    MY BOOTH // {myBooth.boothNumber}
                  </h3>
                </div>

                {myBooth.status === "reserved" && (
                  <motion.button onClick={handleCancelReservation} disabled={pendingAction}
                    whileHover={pendingAction ? {} : { y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={pendingAction ? {} : { y: 1 }}
                    style={{ position: "relative", overflow: "hidden", background: "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "9px 16px", borderRadius: 3, cursor: pendingAction ? "not-allowed" : "pointer", fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {pendingAction && <PulseDot color="#fff" size={6} glow={false} />}
                    {pendingAction ? "CANCELLING..." : "CANCEL RESERVATION"}
                  </motion.button>
                )}
              </div>

              <form onSubmit={handleSaveMyBoothDetails} style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 2 }}>
                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>Booth Description & Special Requirements</label>
                  <textarea rows="3" value={detailsText} onChange={(e) => setDetailsText(e.target.value)} placeholder="Enter showcase requirements, power needs, or product notes"
                    style={{ width: "100%", padding: "10px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, background: "#fff", boxShadow: "2px 2px 0 #000", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: 1.55, fontSize: 14 }} />
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: 0, letterSpacing: 0.6, display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <PulseDot color="var(--color-cerulean, #14a6ea)" size={7} glow={false} />
                      ON-SITE BOOTH STAFF ROSTER
                    </h4>
                    <span style={{ background: "var(--color-dark, #231e25)", color: "#fff", padding: "2px 10px", borderRadius: 30, fontFamily: "var(--font-display)", fontSize: 14 }}>
                      {staffList.length}
                    </span>
                  </div>

                  {staffList.length === 0 ? (
                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280", margin: 0, padding: "10px 12px", background: "#fafafa", border: "1.5px dashed #000", borderRadius: 4, textAlign: "center", fontWeight: 600 }}>
                      No staff members added to this booth yet.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                      <AnimatePresence>
                        {staffList.map((st, i) => (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-light, #fff8eb)", border: "2px solid #000", boxShadow: "2px 2px 0 #000", padding: "8px 14px", borderRadius: 3, gap: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-cerulean, #14a6ea)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 13, flexShrink: 0, border: "1.5px solid #000" }}>
                                {(st.name || "?").charAt(0).toUpperCase()}
                              </span>
                              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13.5, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {st.name} <span style={{ color: "#6b7280", fontWeight: 600 }}>— {st.role || "Staff"}</span>
                              </span>
                            </div>
                            <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={() => handleRemoveStaff(i)}
                              style={{ background: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", padding: "3px 10px", borderRadius: 3, cursor: "pointer", fontSize: 10.5, fontWeight: 900, letterSpacing: 0.4 }}>
                              REMOVE
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginTop: 12 }} className="staff-add-grid">
                    <input type="text" placeholder="Staff Full Name" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)}
                      style={{ padding: "9px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 600, background: "#fff", boxShadow: "2px 2px 0 #000", outline: "none", boxSizing: "border-box" }} />
                    <input type="text" placeholder="Role (e.g. Sales Rep)" value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)}
                      style={{ padding: "9px 12px", border: "2px solid #000", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 600, background: "#fff", boxShadow: "2px 2px 0 #000", outline: "none", boxSizing: "border-box" }} />
                    <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} onClick={handleAddStaff}
                      style={{ background: "var(--color-dark, #231e25)", color: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "9px 18px", fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 0.6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      + ADD STAFF
                    </motion.button>
                  </div>
                </div>

                <motion.button type="submit" disabled={pendingAction}
                  whileHover={pendingAction ? {} : { y: -3, boxShadow: "6px 6px 0 #000" }} whileTap={pendingAction ? {} : { y: 1 }}
                  style={{ position: "relative", overflow: "hidden", background: pendingAction ? "#9ca3af" : "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "12px", fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, cursor: pendingAction ? "not-allowed" : "pointer", marginTop: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {!pendingAction && <ShineSweep duration={1.4} delay={0} opacity={0.35} />}
                  {pendingAction && <PulseDot color="#fff" size={7} glow={false} />}
                  {pendingAction ? "SAVING..." : "SAVE BOOTH INFO & STAFF ROSTER"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          .staff-add-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ExhibitorBooths;