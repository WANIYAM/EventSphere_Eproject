import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api.js";
import {
  CornerBrackets, ShineSweep, PulseDot, RotatingBadge, TickerStrip, Scanline, GrainOverlay, TickStrip,
} from "../../components/common/NeoBrutalKit.jsx";

const ExhibitorProfile = () => {
  const [profile, setProfile] = useState({ name: "", phone: "", company: "", description: "", website: "", category: "", logo: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [logoFile, setLogoFile] = useState(null);
  const [logoSubmitting, setLogoSubmitting] = useState(false);
  const [infoSubmitting, setInfoSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile");
      setProfile({
        name: res.data.name || "", phone: res.data.phone || "",
        company: res.data.company || "", description: res.data.description || "",
        website: res.data.website || "", category: res.data.category || "",
        logo: res.data.logo || "",
      });
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to load profile");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4500);
    return () => clearTimeout(t);
  }, [success]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setInfoSubmitting(true);
    try {
      const res = await api.put("/profile", {
        name: profile.name, phone: profile.phone, company: profile.company,
        description: profile.description, website: profile.website, category: profile.category,
      });
      setSuccess("Company profile details updated successfully!");
      setProfile((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to update profile");
    } finally { setInfoSubmitting(false); }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return setError("Please select an image file first");
    setError(""); setSuccess("");
    setLogoSubmitting(true);
    const formData = new FormData();
    formData.append("logo", logoFile);
    try {
      const res = await api.post("/profile/logo", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Company logo updated!");
      setProfile((prev) => ({ ...prev, logo: res.data.logo }));
      setLogoFile(null);
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Failed to upload logo");
    } finally { setLogoSubmitting(false); }
  };

  const inputStyle = (name) => ({
    width: "100%", padding: "10px 12px", border: "2px solid #000", borderRadius: 4,
    fontFamily: "'Satoshi', sans-serif", fontWeight: 600, fontSize: 14, marginTop: 4,
    background: "#fff", outline: "none", boxSizing: "border-box",
    boxShadow: focused === name ? "4px 4px 0 var(--color-purple-mimosa, #a67eff)" : "2px 2px 0 #000",
    transition: "box-shadow 0.2s ease",
  });
  const labelStyle = { fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "#231e25", display: "inline-flex", alignItems: "center", gap: 6 };

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4px" }}>
        <div style={{ background: "#fff", border: "3px solid #000", boxShadow: "8px 8px 0 #000", padding: 50, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <Scanline color="rgba(166,126,255,0.35)" height={70} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid #231e25", borderTopColor: "var(--color-purple-mimosa, #a67eff)", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: 1, margin: 0 }}>LOADING EXHIBITOR PROFILE...</p>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22, paddingBottom: 40 }}>
      <div style={{ background: "var(--color-dark, #231e25)", border: "2px solid #000", borderRadius: 4, padding: "5px 0", boxShadow: "3px 3px 0 #000" }}>
        <TickerStrip items={["EXHIBITOR SETTINGS", "COMPANY PROFILE", "LOGO & BRANDING", "PUBLIC SHOWCASE"]} color="var(--color-purple-mimosa, #a67eff)" duration={26} fontSize={11} />
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "8px 8px 0 var(--color-dark, #231e25)", padding: "24px 28px", position: "relative", overflow: "hidden" }}>
        <CornerBrackets color="#000" inset={9} size={12} thickness={2.5} />
        <ShineSweep duration={1.7} delay={0.2} opacity={0.22} />
        <TickStrip color="rgba(0,0,0,0.3)" gap={14} />
        <GrainOverlay opacity={0.1} />
        <RotatingBadge text="PROFILE EDIT" size={90} bg="var(--color-purple-mimosa, #a67eff)" color="#fff" top={-20} right={-20} duration={17} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-purple-mimosa, #a67eff)", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: 0.8, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000" }}>
            <PulseDot color="#fff" size={6} glow={false} />
            [ EXHIBITOR SETTINGS ]
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(30px, 4vw, 46px)", color: "var(--color-dark, #231e25)", lineHeight: 0.95, margin: "10px 0 0 0", letterSpacing: 1 }}>
            COMPANY PROFILE & SHOWCASE
          </h1>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22, alignItems: "start" }}>
        <motion.form onSubmit={handleInfoSubmit}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
          style={{ background: "var(--color-light, #fff8eb)", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "26px", display: "flex", flexDirection: "column", gap: 14, position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <ShineSweep duration={1.7} delay={0.25} opacity={0.2} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-dark, #231e25)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", marginBottom: 8, fontFamily: "'Satoshi', sans-serif", alignSelf: "flex-start" }}>
            <PulseDot color="var(--color-kiwi, #abf139)" size={6} glow={false} />
            01 // COMPANY DETAILS
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: "0 0 8px 0", letterSpacing: 0.6 }}>COMPANY DETAILS & SPECIFICATIONS</h3>

          <div>
            <label style={labelStyle}>Primary Contact Person *</label>
            <input type="text" name="name" required value={profile.name} onChange={handleChange} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} style={inputStyle("name")} />
          </div>
          <div>
            <label style={labelStyle}>Company / Brand Name</label>
            <input type="text" name="company" value={profile.company} onChange={handleChange} onFocus={() => setFocused("company")} onBlur={() => setFocused(null)} style={inputStyle("company")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} style={inputStyle("phone")} />
            </div>
            <div>
              <label style={labelStyle}>Industry Category</label>
              <input type="text" name="category" value={profile.category} onChange={handleChange} onFocus={() => setFocused("cat")} onBlur={() => setFocused(null)} placeholder="AI & Robotics" style={inputStyle("cat")} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Website URL</label>
            <input type="text" name="website" value={profile.website} onChange={handleChange} onFocus={() => setFocused("web")} onBlur={() => setFocused(null)} placeholder="https://company.com" style={inputStyle("web")} />
          </div>
          <div>
            <label style={labelStyle}>Company Description</label>
            <textarea name="description" rows="4" value={profile.description} onChange={handleChange} onFocus={() => setFocused("desc")} onBlur={() => setFocused(null)} placeholder="Summary of products and innovations featured at your booth" style={{ ...inputStyle("desc"), resize: "vertical", lineHeight: 1.55 }} />
          </div>

          <motion.button type="submit" disabled={infoSubmitting}
            whileHover={infoSubmitting ? {} : { y: -3, boxShadow: "6px 6px 0 #000" }} whileTap={infoSubmitting ? {} : { y: 1 }}
            style={{ position: "relative", overflow: "hidden", background: infoSubmitting ? "#9ca3af" : "var(--color-primary, #ff3e33)", color: "#fff", border: "2.5px solid #000", boxShadow: "4px 4px 0 #000", padding: "12px", fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, cursor: infoSubmitting ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {!infoSubmitting && <ShineSweep duration={1.4} delay={0} opacity={0.35} />}
            {infoSubmitting && <PulseDot color="#fff" size={7} glow={false} />}
            {infoSubmitting ? "SAVING..." : "SAVE PROFILE DETAILS"}
          </motion.button>
        </motion.form>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}
          style={{ background: "#fff", border: "3px solid var(--color-dark, #231e25)", boxShadow: "6px 6px 0 var(--color-dark, #231e25)", padding: "26px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 18, position: "relative", overflow: "hidden" }}>
          <CornerBrackets color="#000" inset={8} size={11} thickness={2.5} />
          <ShineSweep duration={1.7} delay={0.3} opacity={0.2} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-dark, #231e25)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 10, fontWeight: 900, letterSpacing: 1, border: "1.5px solid #000", boxShadow: "2px 2px 0 #000", fontFamily: "'Satoshi', sans-serif", position: "relative", zIndex: 2 }}>
            <PulseDot color="var(--color-kiwi, #abf139)" size={6} glow={false} />
            02 // BRANDING
          </div>

          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, margin: 0, letterSpacing: 0.6, position: "relative", zIndex: 2 }}>COMPANY LOGO</h3>

          <motion.div whileHover={{ rotate: -3, scale: 1.04 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
            style={{ width: 152, height: 152, borderRadius: 10, border: "3px solid var(--color-dark, #231e25)", background: "var(--color-light, #fff8eb)", boxShadow: "5px 5px 0 #000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            {profile.logo ? (
              <img src={`http://localhost:5000${profile.logo}`} alt="Company Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30 }}>🏢</div>
                <span style={{ fontSize: 11, fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: 1, color: "#6b7280" }}>NO LOGO</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "var(--color-purple-mimosa, #a67eff)" }} />
          </motion.div>

          <form onSubmit={handleLogoUpload} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 2 }}>
            <label style={{ width: "100%", border: "2.5px dashed #000", borderRadius: 6, padding: "12px", background: "#fafafa", cursor: "pointer", boxSizing: "border-box", transition: "background 0.2s" }}>
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} style={{ display: "none" }} />
              <div style={{ fontFamily: "'Satoshi', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: 0.6, color: "#231e25", textAlign: "center" }}>
                {logoFile ? `📎 ${logoFile.name.length > 24 ? logoFile.name.slice(0, 24) + "…" : logoFile.name}` : "📁 SELECT IMAGE FILE"}
              </div>
            </label>

            <motion.button type="submit" disabled={logoSubmitting}
              whileHover={logoSubmitting ? {} : { y: -3, boxShadow: "5px 5px 0 #000" }} whileTap={logoSubmitting ? {} : { y: 1 }}
              style={{ position: "relative", overflow: "hidden", background: "var(--color-dark, #231e25)", color: "#fff", border: "2.5px solid #000", boxShadow: "3px 3px 0 #000", padding: "11px", fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: 1, cursor: logoSubmitting ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {logoSubmitting && <PulseDot color="var(--color-kiwi, #abf139)" size={7} glow={false} />}
              {logoSubmitting ? "UPLOADING..." : "UPLOAD NEW LOGO"}
            </motion.button>
          </form>

          <div style={{ background: "rgba(166,126,255,0.08)", border: "1.5px dashed #000", padding: "8px 12px", borderRadius: 4, fontFamily: "'Satoshi', sans-serif", fontSize: 11, fontWeight: 700, color: "#4b5563", lineHeight: 1.5, position: "relative", zIndex: 2 }}>
            💡 Recommended: square PNG or JPG, min 400×400px, transparent background.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExhibitorProfile;