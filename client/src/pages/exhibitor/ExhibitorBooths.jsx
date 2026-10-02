import { useState, useEffect } from "react";
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
      setError(err.response?.data?.message || "Failed to load applications");
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
      setError(err.response?.data?.message || "Failed to load booth layout");
    }
  };

  useEffect(() => {
    if (selectedExpoId) {
      fetchExpoBooths(selectedExpoId);
    }
  }, [selectedExpoId]);

  useEffect(() => {
    if (!socket) return;

    const handleBoothUpdated = (data) => {
      if (data?.expoId === selectedExpoId || !data?.expoId) {
        if (selectedExpoId) fetchExpoBooths(selectedExpoId);
      }
    };

    socket.on("booth:updated", handleBoothUpdated);

    return () => {
      socket.off("booth:updated", handleBoothUpdated);
    };
  }, [socket, selectedExpoId]);

  // Find my booth in currently selected expo
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
        setError(err.response?.data?.message || "Failed to reserve booth");
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
        setError(err.response?.data?.message || "Failed to cancel reservation");
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
        staff: staffList
      });
      setSuccess("Booth details & staff roster saved successfully!");
      fetchExpoBooths(selectedExpoId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save booth details");
    }
  };

  if (loading) return <p>Loading booth self-selection...</p>;

  return (
    <div className="exhibitor-page-container">
      <h2>Booth Self-Selection & Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {approvedApplications.length === 0 ? (
        <div className="alert alert-info">
          You don't have any approved applications yet. Once an admin approves your application, you will be able to pick a booth here.
        </div>
      ) : (
        <>
          <div className="form-group" style={{ maxWidth: "400px", marginBottom: "1.5rem" }}>
            <label>Select Approved Expo:</label>
            <select value={selectedExpoId} onChange={(e) => setSelectedExpoId(e.target.value)}>
              {approvedApplications.map((app) => (
                <option key={app._id} value={app.expo._id || app.expo}>
                  {app.expo.title}
                </option>
              ))}
            </select>
          </div>

          {/* Legend */}
          <div className="legend-container">
            <span className="legend-item">
              <span className="legend-color legend-available"></span> Available (Click to Reserve)
            </span>
            <span className="legend-item">
              <span className="legend-color legend-reserved"></span> Reserved
            </span>
            <span className="legend-item">
              <span className="legend-color legend-booked"></span> Booked
            </span>
          </div>

          {/* Grid */}
          <div className="booth-grid" style={{ marginBottom: "2rem" }}>
            {booths.map((booth) => (
              <div
                key={booth._id}
                className={`booth-box booth-${booth.status}`}
                onClick={() => {
                  if (booth.status === "available" && !myBooth) {
                    handleReserve(booth);
                  }
                }}
              >
                <div className="booth-number">{booth.boothNumber}</div>
                <div className="booth-price">${booth.price}</div>
                {booth.exhibitor && (
                  <div className="booth-exhibitor">{booth.exhibitor.company || booth.exhibitor.name}</div>
                )}
              </div>
            ))}
          </div>

          {/* My Booth Details Card */}
          {myBooth && (
            <div className="form-card" style={{ marginTop: "2rem" }}>
              <h3>My Booth Details</h3>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>Booth Number:</strong> {myBooth.boothNumber} |{" "}
                <strong>Status:</strong>{" "}
                <span className={`badge badge-${myBooth.status}`}>
                  {myBooth.status === "reserved" ? "Reserved (Waiting Admin Confirm)" : "Booked (Confirmed)"}
                </span>
              </p>

              {myBooth.status === "reserved" && (
                <button onClick={handleCancelReservation} className="btn btn-danger btn-sm" style={{ marginBottom: "1rem" }}>
                  Cancel Reservation
                </button>
              )}

              <form onSubmit={handleSaveMyBoothDetails} style={{ marginTop: "1rem" }}>
                <div className="form-group">
                  <label>Booth Details & Showcase Info</label>
                  <textarea
                    rows="3"
                    value={detailsText}
                    onChange={(e) => setDetailsText(e.target.value)}
                    placeholder="Enter special requirements or booth details"
                  />
                </div>

                {/* Staff list */}
                <h4>Booth Staff Roster</h4>
                <div className="staff-list" style={{ margin: "0.5rem 0 1rem 0" }}>
                  {staffList.length === 0 ? (
                    <p className="text-muted">No staff members added yet.</p>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {staffList.map((st, i) => (
                        <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.35rem" }}>
                          <span>
                            <strong>{st.name}</strong> - {st.role || "Staff"}
                          </span>
                          <button
                            type="button"
                            className="btn-sm btn-danger"
                            onClick={() => handleRemoveStaff(i)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-grid" style={{ marginBottom: "1rem" }}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Staff Name"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Role (e.g. Sales Rep)"
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <button type="button" onClick={handleAddStaff} className="btn btn-secondary btn-sm">
                      Add Staff Member
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Save My Booth Info
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExhibitorBooths;
