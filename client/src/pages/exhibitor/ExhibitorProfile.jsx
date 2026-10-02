import { useState, useEffect } from "react";
import api from "../../services/api.js";

const ExhibitorProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    company: "",
    description: "",
    website: "",
    category: "",
    logo: ""
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
        logo: res.data.logo || ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
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
        category: profile.category
      });
      setSuccess("Profile information updated successfully!");
      setProfile((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
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
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess("Company logo updated!");
      setProfile((prev) => ({ ...prev, logo: res.data.logo }));
      setLogoFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload logo");
    } finally {
      setLogoSubmitting(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="exhibitor-page-container">
      <h2>Exhibitor Company Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "2rem", marginTop: "1rem" }}>
        {/* Main Info Form */}
        <form onSubmit={handleInfoSubmit} className="form-card">
          <h3>Company Information</h3>
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label>Contact Name *</label>
            <input type="text" name="name" required value={profile.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="company" value={profile.company} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Website URL</label>
            <input
              type="text"
              name="website"
              value={profile.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="form-group">
            <label>Industry Category</label>
            <input
              type="text"
              name="category"
              value={profile.category}
              onChange={handleChange}
              placeholder="e.g. Software, Healthcare, Manufacturing"
            />
          </div>
          <div className="form-group">
            <label>Company Description</label>
            <textarea
              name="description"
              rows="4"
              value={profile.description}
              onChange={handleChange}
              placeholder="Brief summary of products and services"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={infoSubmitting}>
            {infoSubmitting ? "Saving..." : "Save Profile Details"}
          </button>
        </form>

        {/* Logo Upload Panel */}
        <div className="form-card text-center" style={{ height: "fit-content" }}>
          <h3>Company Logo</h3>
          <div className="logo-preview-box" style={{ margin: "1rem 0" }}>
            {profile.logo ? (
              <img
                src={`http://localhost:5000${profile.logo}`}
                alt="Company Logo"
                style={{ maxWidth: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "0.375rem" }}
              />
            ) : (
              <div className="text-muted" style={{ padding: "2rem", border: "2px dashed #ccc" }}>
                No Logo Uploaded
              </div>
            )}
          </div>

          <form onSubmit={handleLogoUpload}>
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                style={{ fontSize: "0.85rem" }}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" disabled={logoSubmitting}>
              {logoSubmitting ? "Uploading..." : "Upload Logo"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorProfile;
