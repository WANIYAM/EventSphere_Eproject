import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../services/api.js";

export const FloorPlanSection: React.FC<{ booths?: any[]; expos?: any[] }> = ({
  booths: initialBooths = [],
  expos = [],
}) => {
  const [selectedExpoId, setSelectedExpoId] = useState<string>("");
  const [activeBooths, setActiveBooths] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState<any | null>(null);

  // Initialize selectedExpoId when expos arrive
  useEffect(() => {
    if (expos && expos.length > 0) {
      if (!selectedExpoId || !expos.some((e) => e._id === selectedExpoId)) {
        setSelectedExpoId(expos[0]._id);
      }
    } else if (initialBooths.length > 0) {
      setActiveBooths(initialBooths);
    }
  }, [expos, initialBooths]);

  // Fetch booths when expo changes
  useEffect(() => {
    const fetchBooths = async () => {
      if (!selectedExpoId) return;
      try {
        setLoading(true);
        const res = await api.get(`/expos/${selectedExpoId}/booths`);
        
        if (res.data && res.data.length > 0) {
          setActiveBooths(res.data);
        } else {
          // Fallback virtual booths if admin created expo without generating booths
          const mockBooths = Array.from({ length: 16 }, (_, i) => ({
            _id: `mock-${i + 1}`,
            boothNumber: `A${i + 1}`,
            price: 500 + i * 50,
            size: "3x3 m",
            status: i === 0 ? "booked" : i === 1 ? "reserved" : "available",
            exhibitor: i === 0 ? { company: "Anchor Exhibitor" } : null,
          }));
          setActiveBooths(mockBooths);
        }
      } catch (err) {
        console.error("Error fetching booths:", err);
        setActiveBooths(
          Array.from({ length: 16 }, (_, i) => ({
            _id: `err-${i}`,
            boothNumber: `A${i + 1}`,
            price: 500,
            status: "available",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooths();
  }, [selectedExpoId]);

  const getStatusColor = (status: string) => {
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

  const availableCount = activeBooths.filter((b) => b.status === "available").length;
  const reservedCount = activeBooths.filter((b) => b.status === "reserved").length;
  const bookedCount = activeBooths.filter((b) => b.status === "booked").length;

  return (
    <section
      id="floorplan"
      style={{
        backgroundColor: "var(--color-dark, #231e25)",
        color: "var(--color-light, #fff8eb)",
        padding: "100px clamp(20px, 4vw, 64px) 140px clamp(20px, 4vw, 64px)",
        position: "relative",
        zIndex: 2,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        
        {/* Header & Dropdown */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
          <div>
            <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
              [ BOOTH AVAILABILITY // SELECT EVENT ]
            </span>
            <h2 className="style-display" style={{ fontSize: "clamp(46px, 7vw, 96px)", color: "#fff", margin: "10px 0 0 0", lineHeight: 0.9 }}>
              EXPO &#123; FLOOR PLAN &#125; & BOOTH SPACES
            </h2>
          </div>

          {expos.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "#161318", border: "2px solid #fff", padding: "8px 14px", borderRadius: 6 }}>
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 800, color: "var(--color-kiwi)" }}>EXPO:</span>
              <select
                value={selectedExpoId}
                onChange={(e) => setSelectedExpoId(e.target.value)}
                style={{
                  backgroundColor: "var(--color-light, #fff8eb)",
                  color: "var(--color-dark, #231e25)",
                  border: "2px solid #000",
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  outline: "none",
                  cursor: "pointer",
                  maxWidth: 380,
                }}
              >
                {expos.map((exp) => (
                  <option key={exp._id} value={exp._id}>
                    {exp.title} ({exp.location || "Convention Hall"})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontFamily: "'Satoshi', sans-serif", fontSize: 13, fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, backgroundColor: "var(--color-kiwi)", border: "1.5px solid #fff" }} />
              Available ({availableCount})
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, backgroundColor: "var(--color-selective-yellow)", border: "1.5px solid #fff" }} />
              Reserved ({reservedCount})
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, backgroundColor: "var(--color-primary)", border: "1.5px solid #fff" }} />
              Booked ({bookedCount})
            </span>
          </div>

          <Link
            to="/register?role=exhibitor"
            style={{
              backgroundColor: "var(--color-selective-yellow, #feb804)",
              color: "#000000",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #ffffff",
              padding: "10px 20px",
              fontFamily: "var(--font-display)",
              fontSize: 20,
              textDecoration: "none",
              letterSpacing: 0.5,
            }}
          >
            APPLY TO EXHIBIT
          </Link>
        </div>

        {/* Grid */}
        <div
          style={{
            backgroundColor: "#161318",
            border: "3px solid #ffffff",
            boxShadow: "8px 8px 0px rgba(0,0,0,0.5)",
            padding: "32px",
            minHeight: 280,
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>
              Loading booth availability...
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 14 }}>
              {activeBooths.map((booth) => {
                const { bg, text } = getStatusColor(booth.status);

                return (
                  <motion.div
                    key={booth._id}
                    whileHover={{ scale: 1.05, y: -3 }}
                    onClick={() => setSelectedBooth(booth)}
                    style={{
                      backgroundColor: bg,
                      color: text,
                      border: "2px solid #000000",
                      boxShadow: "3px 3px 0px #000000",
                      padding: "14px 10px",
                      borderRadius: 4,
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 90,
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1 }}>
                      {booth.boothNumber}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, fontFamily: "'Satoshi', sans-serif" }}>
                      ${booth.price || 500}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {booth.exhibitor?.company || booth.exhibitor?.name || booth.status}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Inspector */}
        <AnimatePresence>
          {selectedBooth && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              style={{
                marginTop: 24,
                backgroundColor: "var(--color-light, #fff8eb)",
                color: "var(--color-dark, #231e25)",
                border: "3px solid #000",
                boxShadow: "5px 5px 0px #fff",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "var(--color-primary)" }}>
                  BOOTH DETAILS // {selectedBooth.boothNumber}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "4px 0" }}>
                  {selectedBooth.exhibitor?.company ? `Assigned to: ${selectedBooth.exhibitor.company}` : `Status: ${selectedBooth.status.toUpperCase()}`}
                </h3>
                <p style={{ margin: 0, fontSize: 14, fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}>
                  Dimensions: {selectedBooth.size || "3x3 m"} - Price: ${selectedBooth.price || 500}
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {selectedBooth.status === "booked" && selectedBooth.exhibitor?._id && (
                  <Link
                    to={`/exhibitors/${selectedBooth.exhibitor._id}`}
                    style={{ backgroundColor: "var(--color-dark)", color: "#fff", border: "2px solid #000", padding: "8px 16px", textDecoration: "none", fontWeight: 800, fontSize: 13 }}
                  >
                    View Exhibitor Profile
                  </Link>
                )}
                <button
                  onClick={() => setSelectedBooth(null)}
                  aria-label="Close"
                  style={{ backgroundColor: "var(--color-primary)", color: "#fff", border: "2px solid #000", padding: "8px 16px", cursor: "pointer", fontWeight: 800, fontSize: 13 }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};