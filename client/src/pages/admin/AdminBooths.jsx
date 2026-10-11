import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";

const AdminBooths = () => {
  const { id: expoId } = useParams();
  const { socket } = useSocket();

  const [expo, setExpo] = useState(null);
  const [booths, setBooths] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedBooth, setSelectedBooth] = useState(null);
  const [selectedExhibitorId, setSelectedExhibitorId] = useState("");
  const [boothFormData, setBoothFormData] = useState({
    price: 500,
    size: "3x3 m",
    details: "",
    status: "available",
  });

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [expoId]);

  useEffect(() => {
    if (!socket) return;
    const handleBoothUpdated = (data) => {
      if (data?.expoId === expoId || !data?.expoId) fetchData();
    };
    socket.on("booth:updated", handleBoothUpdated);
    return () => socket.off("booth:updated", handleBoothUpdated);
  }, [socket, expoId]);

  const handleBoothClick = (booth) => {
    setSelectedBooth(booth);
    setSelectedExhibitorId("");
    setBoothFormData({
      price: booth.price || 500,
      size: booth.size || "3x3 m",
      details: booth.details || "",
      status: booth.status || "available",
    });
    setError("");
    setSuccess("");
  };

  const handleUpdateBooth = async (e) => {
    e.preventDefault();
    if (!selectedBooth) return;
    try {
      await api.put(`/booths/${selectedBooth._id}`, boothFormData);
      setSuccess("Booth details updated successfully!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to update booth");
    }
  };

  const handleAssignBooth = async () => {
    if (!selectedBooth || !selectedExhibitorId) {
      return setError("Please select an approved exhibitor to assign");
    }
    try {
      await api.put(`/booths/${selectedBooth._id}/assign`, { exhibitorId: selectedExhibitorId });
      setSuccess("Booth assigned successfully!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to assign booth");
    }
  };

  const handleConfirmBooth = async () => {
    if (!selectedBooth) return;
    try {
      await api.put(`/booths/${selectedBooth._id}/confirm`);
      setSuccess("Booth reservation confirmed to booked!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to confirm booth");
    }
  };

  const handleReleaseBooth = async () => {
    if (!selectedBooth) return;
    try {
      await api.put(`/booths/${selectedBooth._id}/release`);
      setSuccess("Booth released back to available!");
      fetchData();
      setSelectedBooth(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to release booth");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return { bg: "var(--color-kiwi, #abf139)", text: "#000000" };
      case "reserved":
        return { bg: "var(--color-selective-yellow, #feb804)", text: "#000000" };
      case "booked":
        return { bg: "var(--color-primary, #ff3e33)", text: "#ffffff" };
      default:
        return { bg: "#e5e7eb", text: "#000000" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "10px 0" }}>
      {/* Top Header Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <Link
            to="/admin/expos"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: "var(--color-dark, #231e25)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            ← Back to Expos
          </Link>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ backgroundColor: "var(--color-cerulean, #14a6ea)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              [ FLOOR PLAN ALLOCATION ]
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
            MANAGE BOOTHS — {expo?.title || "EXPO FLOOR"}
          </h1>
          {expo && (
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#6b7280", margin: "4px 0 0 0", fontWeight: 600 }}>
              📍 {expo.location} • 📅 {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          ✓ {success}
        </div>
      )}

      {/* Interactive Legend Bar */}
      <div
        style={{
          backgroundColor: "var(--color-light, #fff8eb)",
          border: "2.5px solid var(--color-dark, #231e25)",
          boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
          padding: "14px 20px",
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--color-dark)" }}>STATUS LEGEND:</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
          <span style={{ width: 14, height: 14, backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000", borderRadius: 2 }} />
          Available ({booths.filter((b) => b.status === "available").length})
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
          <span style={{ width: 14, height: 14, backgroundColor: "var(--color-selective-yellow, #feb804)", border: "1.5px solid #000", borderRadius: 2 }} />
          Reserved ({booths.filter((b) => b.status === "reserved").length})
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
          <span style={{ width: 14, height: 14, backgroundColor: "var(--color-primary, #ff3e33)", border: "1.5px solid #000", borderRadius: 2 }} />
          Booked ({booths.filter((b) => b.status === "booked").length})
        </div>
      </div>

      {/* Floor Plan Booth Grid */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "28px",
        }}
      >
        {loading ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, textAlign: "center", padding: "40px 0" }}>
            Loading live booth telemetry...
          </p>
        ) : booths.length === 0 ? (
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, textAlign: "center", padding: "40px 0" }}>
            No booth spaces created for this expo.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: 14,
            }}
          >
            {booths.map((booth) => {
              const { bg, text } = getStatusColor(booth.status);

              return (
                <motion.div
                  key={booth._id}
                  onClick={() => handleBoothClick(booth)}
                  whileHover={{ scale: 1.05, y: -4, boxShadow: "5px 5px 0px var(--color-dark, #231e25)" }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    backgroundColor: bg,
                    color: text,
                    border: "2.5px solid var(--color-dark, #231e25)",
                    boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                    padding: "14px 10px",
                    borderRadius: 4,
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 4,
                    minHeight: 100,
                  }}
                >
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1 }}>
                    {booth.boothNumber}
                  </div>
                  <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800 }}>
                    ${booth.price}
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {booth.exhibitor?.company || booth.exhibitor?.name || booth.status}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Neo-Brutalist Booth Management Modal */}
      <AnimatePresence>
        {selectedBooth && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(35, 30, 37, 0.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: 20,
            }}
            onClick={() => setSelectedBooth(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "var(--color-light, #fff8eb)",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "10px 10px 0px var(--color-dark, #231e25)",
                width: "100%",
                maxWidth: 520,
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                position: "relative",
              }}
            >
              {/* Corner Handles */}
              <div style={{ position: "absolute", top: -6, left: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />
              <div style={{ position: "absolute", top: -6, right: -6, width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "2px solid #000" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--color-dark, #231e25)", paddingBottom: 12 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, margin: 0 }}>
                  BOOTH {selectedBooth.boothNumber} // SETTINGS
                </h3>
                <button
                  onClick={() => setSelectedBooth(null)}
                  style={{ background: "none", border: "2px solid #000", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontWeight: 900, fontSize: 16 }}
                >
                  ✕
                </button>
              </div>

              <div style={{ margin: "18px 0" }}>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700, margin: 0 }}>
                  Current Status:{" "}
                  <span style={{ backgroundColor: getStatusColor(selectedBooth.status).bg, color: getStatusColor(selectedBooth.status).text, padding: "2px 8px", borderRadius: 2, border: "1px solid #000", textTransform: "uppercase" }}>
                    {selectedBooth.status}
                  </span>
                </p>

                {(selectedBooth.status === "booked" || selectedBooth.status === "reserved") && selectedBooth.exhibitor && (
                  <div style={{ backgroundColor: "#ffffff", border: "2px solid var(--color-dark, #231e25)", padding: "12px", marginTop: 12, fontFamily: "'Satoshi', sans-serif", fontSize: 13, lineHeight: 1.45 }}>
                    <strong>Exhibitor:</strong> {selectedBooth.exhibitor.name} <br />
                    <strong>Company:</strong> {selectedBooth.exhibitor.company || "N/A"} <br />
                    <strong>Email:</strong> {selectedBooth.exhibitor.email}
                  </div>
                )}

                <form onSubmit={handleUpdateBooth} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Dimensions</label>
                    <input
                      type="text"
                      value={boothFormData.size}
                      onChange={(e) => setBoothFormData({ ...boothFormData, size: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Price ($)</label>
                    <input
                      type="number"
                      value={boothFormData.price}
                      onChange={(e) => setBoothFormData({ ...boothFormData, price: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Status</label>
                    <select
                      value={boothFormData.status}
                      onChange={(e) => setBoothFormData({ ...boothFormData, status: e.target.value })}
                      style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginTop: 4 }}
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#fff", border: "2px solid #000", padding: "10px", fontFamily: "var(--font-display)", fontSize: 18, cursor: "pointer", marginTop: 6 }}
                  >
                    Save Booth Details
                  </button>
                </form>

                {/* Status Action Controls */}
                {selectedBooth.status === "available" && (
                  <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 16, marginTop: 16 }}>
                    <h4 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: "0 0 8px 0" }}>Assign to Approved Exhibitor</h4>
                    <select
                      value={selectedExhibitorId}
                      onChange={(e) => setSelectedExhibitorId(e.target.value)}
                      style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, marginBottom: 10 }}
                    >
                      <option value="">-- Select Approved Exhibitor --</option>
                      {approvedApplications.map((app) => (
                        <option key={app._id} value={app.exhibitor?._id}>
                          {app.exhibitor?.name} ({app.companyName || app.exhibitor?.company})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssignBooth}
                      style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "2px solid #000", boxShadow: "2px 2px 0px #000", padding: "10px 16px", fontFamily: "var(--font-display)", fontSize: 18, cursor: "pointer", width: "100%" }}
                    >
                      Assign Booth Space
                    </button>
                  </div>
                )}

                {selectedBooth.status === "reserved" && (
                  <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 16, marginTop: 16, display: "flex", gap: 10 }}>
                    <button
                      onClick={handleConfirmBooth}
                      style={{ flex: 1, backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", border: "2px solid #000", boxShadow: "2px 2px 0px #000", padding: "10px", fontFamily: "var(--font-display)", fontSize: 18, cursor: "pointer" }}
                    >
                      Confirm (Mark Booked)
                    </button>
                    <button
                      onClick={handleReleaseBooth}
                      style={{ flex: 1, backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0px #000", padding: "10px", fontFamily: "var(--font-display)", fontSize: 18, cursor: "pointer" }}
                    >
                      Release to Available
                    </button>
                  </div>
                )}

                {selectedBooth.status === "booked" && (
                  <div style={{ borderTop: "2px dashed var(--color-dark, #231e25)", paddingTop: 16, marginTop: 16 }}>
                    <button
                      onClick={handleReleaseBooth}
                      style={{ width: "100%", backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "2px solid #000", boxShadow: "2px 2px 0px #000", padding: "10px", fontFamily: "var(--font-display)", fontSize: 18, cursor: "pointer" }}
                    >
                      Release & Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBooths;