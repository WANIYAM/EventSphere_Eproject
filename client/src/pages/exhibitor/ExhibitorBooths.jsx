import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../services/api.js";
import { useSocket } from "../../context/SocketContext.jsx";

const ExhibitorBooths = () => {
  const { socket } = useSocket();
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [selectedExpoId, setSelectedExpoId] = useState("");
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchExpoBooths = async (expoId) => {
    if (!expoId) return;
    try {
      const res = await api.get(`/expos/${expoId}/booths`);
      setBooths(res.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load booth layout");
    }
  };

  useEffect(() => {
    if (selectedExpoId) fetchExpoBooths(selectedExpoId);
  }, [selectedExpoId]);

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
    const currentApp = approvedApplications.find(
      (app) => (app.expo._id || app.expo) === selectedExpoId
    );
    if (currentApp && currentApp.booth) {
      const boothObj = booths.find((b) => b._id === (currentApp.booth._id || currentApp.booth));
      setMyBooth(boothObj || currentApp.booth);
      if (boothObj) {
        setDetailsText(boothObj.details || "");
        setStaffList(boothObj.staff || []);
      }
    } else {
      setMyBooth(null);
      setDetailsText("");
      setStaffList([]);
    }
  }, [selectedExpoId, booths, approvedApplications]);

  const handleReserve = async (booth) => {
    if (window.confirm(`Are you sure you want to reserve Booth ${booth.boothNumber}?`)) {
      setError("");
      setSuccess("");
      try {
        await api.put(`/booths/${booth._id}/reserve`);
        setSuccess(`Booth ${booth.boothNumber} reserved successfully! Waiting for admin confirmation.`);
        fetchApplications();
        if (selectedExpoId) fetchExpoBooths(selectedExpoId);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to reserve booth");
      }
    }
  };

  const handleCancelReservation = async () => {
    if (!myBooth) return;
    if (window.confirm("Cancel your booth reservation?")) {
      setError("");
      setSuccess("");
      try {
        await api.put(`/booths/${myBooth._id}/cancel`);
        setSuccess("Reservation cancelled successfully.");
        fetchApplications();
        if (selectedExpoId) fetchExpoBooths(selectedExpoId);
      } catch (err) {
        setError(err.userMessage || err.response?.data?.message || "Failed to cancel reservation");
      }
    }
  };

  const handleAddStaff = () => {
    if (!newStaffName.trim()) return;
    setStaffList([...staffList, { name: newStaffName.trim(), role: newStaffRole.trim() }]);
    setNewStaffName("");
    setNewStaffRole("");
  };

  const handleRemoveStaff = (index) => {
    setStaffList(staffList.filter((_, i) => i !== index));
  };

  const handleSaveMyBoothDetails = async (e) => {
    e.preventDefault();
    if (!myBooth) return;
    setError("");
    setSuccess("");
    try {
      await api.put(`/booths/${myBooth._id}/my-details`, {
        details: detailsText,
        staff: staffList,
      });
      setSuccess("Booth details & staff roster saved successfully!");
      fetchExpoBooths(selectedExpoId);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to save booth details");
    }
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading booth self-selection...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "10px 0" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "3px solid var(--color-dark, #231e25)",
          boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
          padding: "24px 28px",
        }}
      >
        <span style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ FLOOR PLAN SELF-SELECTION ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          BOOTH SELECTION & ROSTER
        </h1>
      </div>

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

      {approvedApplications.length === 0 ? (
        <div style={{ backgroundColor: "var(--color-light, #fff8eb)", border: "2.5px solid #000", padding: 32, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
          You don't have any approved applications yet. Once an organizer approves your booth application, you will be able to select and manage your booth space here.
        </div>
      ) : (
        <>
          {/* Selector & Legend */}
          <div
            style={{
              backgroundColor: "var(--color-light, #fff8eb)",
              border: "2.5px solid var(--color-dark, #231e25)",
              boxShadow: "4px 4px 0px var(--color-dark, #231e25)",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800 }}>Approved Expo:</label>
              <select
                value={selectedExpoId}
                onChange={(e) => setSelectedExpoId(e.target.value)}
                style={{ padding: "8px 14px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 700, backgroundColor: "#fff" }}
              >
                {approvedApplications.map((app) => (
                  <option key={app._id} value={app.expo._id || app.expo}>
                    {app.expo.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 16, fontSize: 12, fontWeight: 700, fontFamily: "'Satoshi', sans-serif" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, backgroundColor: "var(--color-kiwi, #abf139)", border: "1.5px solid #000" }} /> Available
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, backgroundColor: "var(--color-selective-yellow, #feb804)", border: "1.5px solid #000" }} /> Reserved
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, backgroundColor: "var(--color-primary, #ff3e33)", border: "1.5px solid #000" }} /> Booked
              </span>
            </div>
          </div>

          {/* Interactive Booth Floor Grid */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid var(--color-dark, #231e25)",
              boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
              padding: "24px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
              {booths.map((booth) => {
                const bg = booth.status === "available" ? "var(--color-kiwi, #abf139)" : booth.status === "reserved" ? "var(--color-selective-yellow, #feb804)" : "var(--color-primary, #ff3e33)";
                const text = booth.status === "booked" ? "#ffffff" : "#000000";

                return (
                  <motion.div
                    key={booth._id}
                    whileHover={{ scale: booth.status === "available" && !myBooth ? 1.06 : 1 }}
                    onClick={() => {
                      if (booth.status === "available" && !myBooth) handleReserve(booth);
                    }}
                    style={{
                      backgroundColor: bg,
                      color: text,
                      border: "2px solid var(--color-dark, #231e25)",
                      boxShadow: "3px 3px 0px var(--color-dark, #231e25)",
                      padding: "12px 8px",
                      borderRadius: 4,
                      textAlign: "center",
                      cursor: booth.status === "available" && !myBooth ? "pointer" : "default",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 85,
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>{booth.boothNumber}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, fontFamily: "'Satoshi', sans-serif" }}>${booth.price}</div>
                    <div style={{ fontSize: 10, fontFamily: "'Satoshi', sans-serif", fontWeight: 800, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {booth.exhibitor?.company || booth.exhibitor?.name || booth.status}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* My Assigned Booth Details Card */}
          {myBooth && (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid var(--color-dark, #231e25)",
                boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
                padding: "28px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--color-dark, #231e25)", paddingBottom: 14 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0 }}>
                    MY BOOTH DETAILS // {myBooth.boothNumber}
                  </h3>
                  <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700, color: "#6b7280" }}>
                    Status: <strong style={{ color: "var(--color-primary, #ff3e33)" }}>{myBooth.status.toUpperCase()}</strong>
                  </span>
                </div>

                {myBooth.status === "reserved" && (
                  <button
                    onClick={handleCancelReservation}
                    style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1.5px solid #000", padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800 }}
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveMyBoothDetails} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 18 }}>
                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Booth Description & Special Requirements</label>
                  <textarea
                    rows="3"
                    value={detailsText}
                    onChange={(e) => setDetailsText(e.target.value)}
                    placeholder="Enter showcase requirements, power needs, or product notes"
                    style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
                  />
                </div>

                {/* Staff Roster */}
                <div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 10px 0" }}>ON-SITE BOOTH STAFF ROSTER</h4>
                  {staffList.length === 0 ? (
                    <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280" }}>No staff members added to this booth yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                      {staffList.map((st, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--color-light, #fff8eb)", border: "1.5px solid #000", padding: "8px 14px", borderRadius: 3 }}>
                          <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, fontWeight: 700 }}>
                            👤 {st.name} — <span style={{ color: "#6b7280" }}>{st.role || "Staff"}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStaff(i)}
                            style={{ backgroundColor: "var(--color-primary, #ff3e33)", color: "#fff", border: "1px solid #000", padding: "2px 8px", borderRadius: 2, cursor: "pointer", fontSize: 11, fontWeight: 800 }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginTop: 10 }}>
                    <input
                      type="text"
                      placeholder="Staff Full Name"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      style={{ padding: "8px 12px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 600 }}
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Sales Rep)"
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      style={{ padding: "8px 12px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 600 }}
                    />
                    <button
                      type="button"
                      onClick={handleAddStaff}
                      style={{ backgroundColor: "var(--color-dark, #231e25)", color: "#fff", border: "2px solid #000", padding: "8px 16px", fontFamily: "var(--font-display)", fontSize: 16, cursor: "pointer" }}
                    >
                      + Add Staff
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    backgroundColor: "var(--color-primary, #ff3e33)",
                    color: "#ffffff",
                    border: "2px solid #000",
                    boxShadow: "3px 3px 0px #000",
                    padding: "12px",
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  SAVE BOOTH INFO & STAFF ROSTER →
                </motion.button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExhibitorBooths;