import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const ExhibitorExpos = () => {
  const { user } = useAuth();
  const [expos, setExpos] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedExpo, setSelectedExpo] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    products: "",
  });
  const [documents, setDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exposRes, appsRes] = await Promise.all([
        api.get("/expos"),
        api.get("/applications/my"),
      ]);
      setExpos(exposRes.data);
      setMyApplications(appsRes.data);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load expos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hasApplied = (expoId) => {
    return myApplications.some((app) => (app.expo?._id || app.expo) === expoId);
  };

  const handleOpenApplyModal = (expo) => {
    setSelectedExpo(expo);
    setFormData({
      companyName: user?.company || "",
      products: "",
    });
    setDocuments([]);
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("Maximum 3 documents allowed");
      return;
    }
    setError("");
    setDocuments(files);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedExpo) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("expo", selectedExpo._id);
    data.append("companyName", formData.companyName);
    data.append("products", formData.products);

    documents.forEach((doc) => {
      data.append("documents", doc);
    });

    try {
      await api.post("/applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(`Application submitted successfully for ${selectedExpo.title}!`);
      setSelectedExpo(null);
      fetchData();
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

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
        <span style={{ backgroundColor: "var(--color-kiwi, #abf139)", color: "#000", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ EXHIBITION OPPORTUNITIES ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          BROWSE UPCOMING EXPOS & TRADE SHOWS
        </h1>
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#6b7280", margin: "4px 0 0 0", fontWeight: 500 }}>
          Apply for commercial booth space and showcase your products to thousands of registered buyers.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fee2e2", border: "2.5px solid var(--color-primary, #ff3e33)", boxShadow: "3px 3px 0px var(--color-primary, #ff3e33)", padding: "12px 16px", color: "#991b1b", fontWeight: 700, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          Error: {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "var(--color-kiwi, #abf139)", border: "2.5px solid var(--color-dark, #231e25)", boxShadow: "3px 3px 0px var(--color-dark, #231e25)", padding: "12px 16px", color: "#000000", fontWeight: 800, fontFamily: "'Satoshi', sans-serif", fontSize: 14 }}>
          Success: {success}
        </div>
      )}

      {/* Expo Cards Grid */}
      {loading ? (
        <p style={{ padding: 32, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading trade show expos...</p>
      ) : expos.length === 0 ? (
        <div style={{ backgroundColor: "#ffffff", border: "2.5px solid #000", padding: 32, textAlign: "center", fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>
          No expos currently available for application.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {expos.map((expo, idx) => {
            const applied = hasApplied(expo._id);
            const bannerColors = ["var(--color-purple-mimosa, #a67eff)", "var(--color-selective-yellow, #feb804)", "var(--color-primary, #ff3e33)", "var(--color-kiwi, #abf139)"];
            const bannerBg = bannerColors[idx % bannerColors.length];

            return (
              <motion.div
                key={expo._id}
                whileHover={{ y: -6, boxShadow: "8px 8px 0px var(--color-dark, #231e25)" }}
                style={{
                  backgroundColor: "#ffffff",
                  border: "3px solid var(--color-dark, #231e25)",
                  boxShadow: "5px 5px 0px var(--color-dark, #231e25)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* 4 Corner Viewfinders */}
                <div style={{ position: "absolute", top: -5, left: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />
                <div style={{ position: "absolute", top: -5, right: -5, width: 9, height: 9, backgroundColor: "#fff", border: "1.5px solid #000", zIndex: 10 }} />

                {/* Banner Header */}
                <div
                  style={{
                    backgroundColor: bannerBg,
                    color: bannerBg === "var(--color-selective-yellow, #feb804)" || bannerBg === "var(--color-kiwi, #abf139)" ? "#000" : "#fff",
                    borderBottom: "2.5px solid var(--color-dark, #231e25)",
                    padding: "10px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 0.5 }}>
                    {expo.theme || "TRADE SHOW"}
                  </span>
                  {applied && (
                    <span style={{ backgroundColor: "#000", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 2 }}>
                      APPLIED
                    </span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "22px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, gap: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--color-dark, #231e25)", margin: "0 0 8px 0", lineHeight: 0.95 }}>
                      {expo.title}
                    </h3>
                    <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 13, color: "#6b7280", fontWeight: 700, marginBottom: 12 }}>
                      Dates: {new Date(expo.startDate).toLocaleDateString()} – {new Date(expo.endDate).toLocaleDateString()} <br />
                      Location: {expo.location || "TBA"}
                    </div>
                    {expo.description && (
                      <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 14, color: "#4b5563", lineHeight: 1.45, margin: 0 }}>
                        {expo.description.substring(0, 110)}...
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: "1.5px dashed var(--color-dark, #231e25)", paddingTop: 14 }}>
                    {applied ? (
                      <button
                        disabled
                        style={{
                          width: "100%",
                          backgroundColor: "#e5e7eb",
                          color: "#6b7280",
                          border: "2px solid #9ca3af",
                          padding: "10px",
                          borderRadius: 3,
                          fontFamily: "var(--font-display)",
                          fontSize: 18,
                          cursor: "not-allowed",
                        }}
                      >
                        Application Submitted
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOpenApplyModal(expo)}
                        style={{
                          width: "100%",
                          backgroundColor: "var(--color-primary, #ff3e33)",
                          color: "#ffffff",
                          border: "2px solid var(--color-dark, #231e25)",
                          boxShadow: "2px 2px 0px var(--color-dark, #231e25)",
                          padding: "10px",
                          borderRadius: 3,
                          fontFamily: "var(--font-display)",
                          fontSize: 20,
                          letterSpacing: 0.5,
                          cursor: "pointer",
                        }}
                      >
                        Apply for Booth Space
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {selectedExpo && (
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
            onClick={() => setSelectedExpo(null)}
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
                maxWidth: 540,
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
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: 0 }}>
                  BOOTH APPLICATION // {selectedExpo.title}
                </h3>
                <button
                  onClick={() => setSelectedExpo(null)}
                  style={{ background: "none", border: "2px solid #000", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontWeight: 900, fontSize: 16 }}
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Enter your registered company name"
                    style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Products / Showcase Description</label>
                  <textarea
                    rows="3"
                    value={formData.products}
                    onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                    placeholder="Describe the products, prototypes, or services you plan to exhibit"
                    style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Supporting Documents (Max 3: PDF, DOC, Images)</label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    style={{ width: "100%", padding: "8px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 12, marginTop: 4, backgroundColor: "#fff" }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    backgroundColor: "var(--color-kiwi, #abf139)",
                    color: "#000000",
                    border: "2px solid #000",
                    boxShadow: "3px 3px 0px #000",
                    padding: "12px",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginTop: 8,
                  }}
                >
                  {submitting ? "SUBMITTING APPLICATION..." : "SUBMIT BOOTH APPLICATION"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExhibitorExpos;