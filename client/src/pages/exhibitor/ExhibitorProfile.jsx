import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../services/api.js";

const ExhibitorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    company: "",
    description: "",
    website: "",
    category: "",
    logo: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [logoSubmitting, setLogoSubmitting] = useState(false);
  const [infoSubmitting, setInfoSubmitting] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setProfile({
        name: res.data.name || "",
        phone: res.data.phone || "",
        company: res.data.company || "",
        description: res.data.description || "",
        website: res.data.website || "",
        category: res.data.category || "",
        logo: res.data.logo || "",
      });
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setInfoSubmitting(true);

    try {
      const res = await api.put("/profile", {
        name: profile.name,
        phone: profile.phone,
        company: profile.company,
        description: profile.description,
        website: profile.website,
        category: profile.category,
      });
      setSuccess("Company profile details updated successfully!");
      setProfile((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to update profile");
    } finally {
      setInfoSubmitting(false);
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return setError("Please select an image file first");

    setError("");
    setSuccess("");
    setLogoSubmitting(true);

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      const res = await api.post("/profile/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Company logo updated!");
      setProfile((prev) => ({ ...prev, logo: res.data.logo }));
      setLogoFile(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to upload logo");
    } finally {
      setLogoSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 40, fontFamily: "'Satoshi', sans-serif", fontWeight: 700 }}>Loading exhibitor profile...</p>;

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
        <span style={{ backgroundColor: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}>
          [ EXHIBITOR SETTINGS ]
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Bebas Neue', cursive, sans-serif)", fontSize: "clamp(36px, 5vw, 48px)", color: "var(--color-dark, #231e25)", lineHeight: 0.9, margin: "6px 0 0 0" }}>
          COMPANY PROFILE & SHOWCASE
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

      {/* Form Split Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}>
        {/* Left: Main Details Form */}
        <form
          onSubmit={handleInfoSubmit}
          style={{
            backgroundColor: "var(--color-light, #fff8eb)",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0 }}>
            COMPANY DETAILS & SPECIFICATIONS
          </h3>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Primary Contact Person *</label>
            <input
              type="text"
              name="name"
              required
              value={profile.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Company / Brand Name</label>
            <input
              type="text"
              name="company"
              value={profile.company}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
              />
            </div>

            <div>
              <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Industry Category</label>
              <input
                type="text"
                name="category"
                value={profile.category}
                onChange={handleChange}
                placeholder="e.g. AI & Robotics, FinTech"
                style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Website URL</label>
            <input
              type="text"
              name="website"
              value={profile.website}
              onChange={handleChange}
              placeholder="https://company.com"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <div>
            <label style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Company Description</label>
            <textarea
              name="description"
              rows="4"
              value={profile.description}
              onChange={handleChange}
              placeholder="Summary of products and innovations featured at your booth"
              style={{ width: "100%", padding: "10px", border: "2px solid var(--color-dark, #231e25)", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontWeight: 600, marginTop: 4, backgroundColor: "#fff" }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={infoSubmitting}
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
              cursor: infoSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {infoSubmitting ? "SAVING..." : "SAVE PROFILE DETAILS →"}
          </motion.button>
        </form>

        {/* Right: Logo Upload Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "3px solid var(--color-dark, #231e25)",
            boxShadow: "6px 6px 0px var(--color-dark, #231e25)",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 16,
          }}
        >
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: 0 }}>
            COMPANY LOGO
          </h3>

          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 8,
              border: "2.5px solid var(--color-dark, #231e25)",
              backgroundColor: "var(--color-light, #fff8eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {profile.logo ? (
              <img
                src={`http://localhost:5000${profile.logo}`}
                alt="Company Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: 48 }}>🏢</span>
            )}
          </div>

          <form onSubmit={handleLogoUpload} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              style={{ fontSize: 12, fontFamily: "'Satoshi', sans-serif" }}
            />
            <motion.button
              type="submit"
              disabled={logoSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: "var(--color-dark, #231e25)",
                color: "#ffffff",
                border: "2px solid #000",
                boxShadow: "2px 2px 0px #000",
                padding: "10px",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                cursor: logoSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {logoSubmitting ? "UPLOADING..." : "UPLOAD NEW LOGO"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorProfile;